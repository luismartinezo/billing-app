package com.springboot.backend.luismartinez.billingsapp.billingbackend.mappers;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.ProductDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductDTO toDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        return dto;
    }
}
