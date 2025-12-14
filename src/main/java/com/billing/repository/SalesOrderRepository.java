package com.billing.repository;

import com.billing.entity.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    List<SalesOrder> findByCustomerId(Long customerId);
    List<SalesOrder> findByOrderDateBetween(LocalDate startDate, LocalDate endDate);
    List<SalesOrder> findByPaymentStatus(String paymentStatus);
    List<SalesOrder> findByDeletedAtIsNull();
}

