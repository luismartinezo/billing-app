package com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.MonthlyRevenueDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PaymentRepository extends JpaRepository <Payment, Long> {
    List<Payment> findByInvoiceId(Long invoiceId);

    @Query("""
            SELECT new com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.MonthlyRevenueDTO(
                YEAR(p.paidAt),
                MONTH(p.paidAt),
                SUM(p.amount)
            )
            FROM Payment p
            GROUP BY YEAR(p.paidAt), MONTH(p.paidAt)
            ORDER BY YEAR(p.paidAt) DESC, MONTH(p.paidAt) DESC
            """)
    List<MonthlyRevenueDTO> findMonthlyRevenue();
}
