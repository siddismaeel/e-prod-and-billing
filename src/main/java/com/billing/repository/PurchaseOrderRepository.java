package com.billing.repository;

import com.billing.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findByCustomerId(Long customerId);
    List<PurchaseOrder> findByOrderDateBetween(LocalDate startDate, LocalDate endDate);
    List<PurchaseOrder> findByPaymentStatus(String paymentStatus);
    List<PurchaseOrder> findByDeletedAtIsNull();
}

