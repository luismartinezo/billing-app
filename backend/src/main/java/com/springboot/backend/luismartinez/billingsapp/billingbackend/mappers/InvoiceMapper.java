package com.springboot.backend.luismartinez.billingsapp.billingbackend.mappers;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.CustomerDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.InvoiceDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.InvoiceItemDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Customer;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Invoice;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.InvoiceItem;
import org.springframework.stereotype.Component;

@Component
public class InvoiceMapper {
    public InvoiceDTO toDTO(Invoice invoice) {
        InvoiceDTO dto = new InvoiceDTO();
        dto.setId(invoice.getId());
        dto.setInvoiceNumber(invoice.getInvoiceNumber());
        dto.setCreatedAt(invoice.getCreatedAt());
        dto.setIssueDate(invoice.getIssueDate());
        dto.setDueDate(invoice.getDueDate());
        dto.setPaidAt(invoice.getPaidAt());
        dto.setStatus(invoice.getStatus());

        dto.setSubtotal(invoice.getSubtotal());
        dto.setTaxAmount(invoice.getTaxAmount());
        dto.setTotal(invoice.getTotal());

        dto.setCustomer(toCustomerDTO(invoice.getCustomer()));

        dto.setItems(
                invoice.getItems().stream()
                        .map(this::toItemDTO)
                        .toList()
        );

        return dto;
    }

    private InvoiceItemDTO toItemDTO(InvoiceItem item) {
        InvoiceItemDTO dto = new InvoiceItemDTO();
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setPrice(item.getPrice());
        dto.setQuantity(item.getQuantity());
        dto.setTotal(item.getTotal());
        return dto;
    }

    private CustomerDTO toCustomerDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getFirstName());
        dto.setEmail(customer.getEmail());
        return dto;
    }
}
