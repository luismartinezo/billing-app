package com.springboot.backend.luismartinez.billingsapp.billingbackend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Product;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.ProductRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product update(Long id, Product product) {
        return productRepository.findById(id)
                .map(existing -> {
                    product.setId(id);
                    return productRepository.save(product);
                })
                .orElse(null);
    }

    @Override
    public void delete(Long id) {
        productRepository.findById(id).ifPresent(productRepository::delete);
    }
}
