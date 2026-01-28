package com.springboot.backend.luismartinez.billingsapp.billingbackend.controllers;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Invoice;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.enums.InvoiceStatus;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.exceptions.BusinessException;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.services.InvoiceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(InvoiceController.class)
public class InvoiceControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InvoiceService invoiceService;

    @Test
    void shouldIssueInvoice() throws Exception {

        Invoice invoice = new Invoice();
        invoice.setId(1L);
        invoice.setStatus(InvoiceStatus.ISSUED);

        when(invoiceService.issueInvoice(1L)).thenReturn(invoice);

        mockMvc.perform(post("/api/invoices/1/issue"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ISSUED"));
    }
    
    @Test
    void shouldReturn400_whenBusinessExceptionThrown() throws Exception {

        when(invoiceService.issueInvoice(1L))
                .thenThrow(new BusinessException("Invalid state"));

        mockMvc.perform(post("/api/invoices/1/issue"))
                .andExpect(status().isBadRequest());
    }

}
