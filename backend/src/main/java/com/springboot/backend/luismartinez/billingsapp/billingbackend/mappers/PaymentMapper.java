package com.springboot.backend.luismartinez.billingsapp.billingbackend.mappers;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.PaymentDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentDTO toDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setAmount(payment.getAmount());
        dto.setPaidAt(payment.getPaidAt());
        dto.setMethod(payment.getMethod());
        dto.setInvoiceId(payment.getInvoice() != null ? payment.getInvoice().getId() : null);
        return dto;
    }
}
