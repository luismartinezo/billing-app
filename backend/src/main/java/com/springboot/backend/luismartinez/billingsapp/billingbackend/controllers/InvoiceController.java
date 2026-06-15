package com.springboot.backend.luismartinez.billingsapp.billingbackend.controllers;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.InvoiceDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.PaymentDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.PaymentRequest;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Invoice;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.mappers.InvoiceMapper;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.mappers.PaymentMapper;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.services.InvoiceService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.*;

import java.util.List;

@RestController
@RequestMapping("${api.version}/invoices")
@CrossOrigin(origins = "http://localhost:4200")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private InvoiceMapper invoiceMapper;

    @Autowired
    private PaymentMapper paymentMapper;

    //@PreAuthorize("isAuthenticated()")
    @GetMapping("/list")
    public List<InvoiceDTO> getAllInvoices() {
        return invoiceService.getAll().stream()
                .map(invoiceMapper::toDTO)
                .toList();
    }

    @GetMapping({"/{id}", "detail/{id}"})
    public ResponseEntity<InvoiceDTO> getById(@PathVariable Long id) {
        Invoice invoice = invoiceService.getById(id);
        return ResponseEntity.ok(invoiceMapper.toDTO(invoice));
    }

    @GetMapping("/customer/{customerId}")
    public List<InvoiceDTO> getByCustomer(@PathVariable Long customerId) {
        return invoiceService.getByCustomerId(customerId).stream()
                .map(invoiceMapper::toDTO)
                .toList();
    }

    @GetMapping("/{id}/payments/list")
    public List<PaymentDTO> getPayments(@PathVariable Long id){
        return paymentRepository.findByInvoiceId(id).stream()
                .map(paymentMapper::toDTO)
                .toList();
    }

    @PostMapping("/{id}/payments/add")
    public ResponseEntity<PaymentDTO> payInvoice(
            @PathVariable Long id,
            @RequestBody PaymentRequest request
        ) {
        var payment = invoiceService.registerPayment(
                id,
                request.getAmount(),
                String.valueOf(request.getMethod())
        );
        return ResponseEntity.ok(paymentMapper.toDTO(payment));
    }
    @PostMapping({"", "create"})
    public ResponseEntity<InvoiceDTO> create(@Valid @RequestBody Invoice invoice) {
        Invoice created = invoiceService.createInvoice(invoice);
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceMapper.toDTO(created));
    }

    @DeleteMapping({"/{id}", "delete/{id}"})
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        invoiceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Status (PASO 5 y 6)
    @PostMapping("/{id}/issue")
    public InvoiceDTO issue(@PathVariable Long id) {
        return invoiceMapper.toDTO(invoiceService.issueInvoice(id));
    }

    @PostMapping("/{id}/pay")
    public InvoiceDTO pay(@PathVariable Long id) {
        return invoiceMapper.toDTO(invoiceService.payInvoice(id));
    }

    @PostMapping("/{id}/cancel")
    public InvoiceDTO cancel(@PathVariable Long id) {
        return invoiceMapper.toDTO(invoiceService.cancelInvoice(id));
    }

    @GetMapping("/{id}/pdf")
    public void pdf(@PathVariable Long id, HttpServletResponse response) throws Exception{

        Invoice invoice=invoiceService.getById(id);

        response.setContentType("application/pdf");

        Document doc=new Document();
        PdfWriter.getInstance(doc,response.getOutputStream());
        doc.open();

        doc.add(new Paragraph("Invoice "+invoice.getInvoiceNumber()));
        doc.add(new Paragraph("Customer "+invoice.getCustomer().getFirstName()));

        doc.close();
    }
}
