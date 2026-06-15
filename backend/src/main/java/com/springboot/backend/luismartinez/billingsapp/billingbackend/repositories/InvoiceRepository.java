package com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.TopClientDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Invoice;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.enums.InvoiceStatus;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByCustomerId(Long customerId);

    long countByStatus(InvoiceStatus status);

    @Query("""
            SELECT new com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.TopClientDTO(
                c.id,
                CONCAT(c.firstName, ' ', c.lastName),
                COUNT(i),
                SUM(i.total)
            )
            FROM Invoice i
            JOIN i.customer c
            GROUP BY c.id, c.firstName, c.lastName
            ORDER BY SUM(i.total) DESC
            """)
    List<TopClientDTO> findTopClients();
    
    @Query("SELECT i FROM Invoice i JOIN FETCH i.customer JOIN FETCH i.items WHERE i.id = ?1")
    Invoice findByIdWithCustomerAndItems(Long id);
}
