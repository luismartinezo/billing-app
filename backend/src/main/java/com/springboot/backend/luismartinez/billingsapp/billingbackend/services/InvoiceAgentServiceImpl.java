package com.springboot.backend.luismartinez.billingsapp.billingbackend.services;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.MonthlyRevenueDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.TopClientDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.enums.InvoiceStatus;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.CustomerRepository;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.InvoiceRepository;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.Month;
import java.util.List;
import java.util.Locale;

@Service
@Transactional(readOnly = true)
public class InvoiceAgentServiceImpl implements InvoiceAgentService {

    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;
    private final PaymentRepository paymentRepository;
    private final NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(Locale.GERMANY);

    public InvoiceAgentServiceImpl(
            InvoiceRepository invoiceRepository,
            CustomerRepository customerRepository,
            PaymentRepository paymentRepository
    ) {
        this.invoiceRepository = invoiceRepository;
        this.customerRepository = customerRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public String handleMessage(String message) {
        String normalizedMessage = normalize(message);

        if (matches(normalizedMessage, "pending invoice", "pending invoices", "facturas pendientes")) {
            return countInvoicesByStatus(InvoiceStatus.PENDING, "pending");
        }

        if (matches(normalizedMessage, "paid invoice", "paid invoices", "facturas pagadas")) {
            return countInvoicesByStatus(InvoiceStatus.PAID, "paid");
        }

        if (matches(normalizedMessage, "monthly revenue", "revenue by month", "ingresos mensuales")) {
            return monthlyRevenue();
        }

        if (matches(normalizedMessage, "total invoices", "all invoices", "total facturas")) {
            return totalInvoices();
        }

        if (matches(normalizedMessage, "top clients", "best clients", "top customers", "mejores clientes")) {
            return topClients();
        }

        return help();
    }

    private String normalize(String message) {
        return message == null ? "" : message.trim().toLowerCase(Locale.ROOT);
    }

    private boolean matches(String message, String... keywords) {
        for (String keyword : keywords) {
            if (message.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private String countInvoicesByStatus(InvoiceStatus status, String label) {
        long count = invoiceRepository.countByStatus(status);
        return "You have " + count + " " + label + " invoice" + plural(count) + ".";
    }

    private String totalInvoices() {
        long invoiceCount = invoiceRepository.count();
        long customerCount = customerRepository.count();
        return "You have " + invoiceCount + " invoice" + plural(invoiceCount)
                + " across " + customerCount + " client" + plural(customerCount) + ".";
    }

    private String monthlyRevenue() {
        List<MonthlyRevenueDTO> revenue = paymentRepository.findMonthlyRevenue();

        if (revenue.isEmpty()) {
            return "No payment revenue has been registered yet.";
        }

        StringBuilder response = new StringBuilder("Monthly revenue:\n");
        revenue.forEach(item -> response
                .append("- ")
                .append(Month.of(item.getMonth()))
                .append(" ")
                .append(item.getYear())
                .append(": ")
                .append(formatCurrency(item.getRevenue()))
                .append("\n"));

        return response.toString().trim();
    }

    private String topClients() {
        List<TopClientDTO> clients = invoiceRepository.findTopClients();

        if (clients.isEmpty()) {
            return "No clients with invoices found yet.";
        }

        StringBuilder response = new StringBuilder("Top clients:\n");
        clients.stream().limit(5).forEach(client -> response
                .append("- ")
                .append(client.getCustomerName())
                .append(": ")
                .append(client.getInvoiceCount())
                .append(" invoice")
                .append(plural(client.getInvoiceCount()))
                .append(", ")
                .append(formatCurrency(client.getTotalInvoiced()))
                .append("\n"));

        return response.toString().trim();
    }

    private String help() {
        return "I can answer: pending invoices, paid invoices, monthly revenue, total invoices, or top clients.";
    }

    private String plural(long count) {
        return count == 1 ? "" : "s";
    }

    private String formatCurrency(BigDecimal amount) {
        return currencyFormat.format(amount == null ? BigDecimal.ZERO : amount);
    }
}
