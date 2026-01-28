package com.springboot.backend.luismartinez.billingsapp.billingbackend.services;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Invoice;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.enums.InvoiceStatus;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.exceptions.BusinessException;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.InvoiceRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class InvoiceServiceImplTest {
    @Mock
    private InvoiceRepository invoiceRepository;

    @InjectMocks
    private InvoiceServiceImpl invoiceService;
    @Test
    void shouldIssueInvoice_whenStatusIsDraft() {
        Invoice invoice = new Invoice();
        invoice.setId(1L);
        invoice.setStatus(InvoiceStatus.DRAFT);

        when(invoiceRepository.findById(1L))
                .thenReturn(Optional.of(invoice));

        Invoice result = invoiceService.issueInvoice(1L);

        assertEquals(InvoiceStatus.ISSUED, result.getStatus());
        assertNotNull(result.getIssueDate());

        verify(invoiceRepository).save(invoice);
    }

    @Test
    void shouldThrowException_whenIssuingNonDraftInvoice() {
        Invoice invoice = new Invoice();
        invoice.setId(1L);
        invoice.setStatus(InvoiceStatus.PAID);

        when(invoiceRepository.findById(1L))
                .thenReturn(Optional.of(invoice));

        assertThrows(BusinessException.class,
                () -> invoiceService.issueInvoice(1L));
    }

}
