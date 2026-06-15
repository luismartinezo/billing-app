package com.springboot.backend.luismartinez.billingsapp.billingbackend.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.ProductDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Product;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.mappers.ProductMapper;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.ProductRepository;

import java.util.List;

@RestController
@RequestMapping("${api.version}/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductMapper productMapper;

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::toDTO)
                .toList();
    }

    @GetMapping({"/{id}", "detail/{id}"})
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(productMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping({"", "create"})
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody Product product) {
        Product savedProduct = productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(productMapper.toDTO(savedProduct));
    }

    @PutMapping({"/{id}", "update/{id}"})
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody Product product) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    product.setId(id);
                    Product updatedProduct = productRepository.save(product);
                    return ResponseEntity.ok(productMapper.toDTO(updatedProduct));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping({"/{id}", "delete/{id}"})
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> {
                    productRepository.delete(product);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
