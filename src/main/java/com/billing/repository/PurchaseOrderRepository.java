package com.billing.repository;

import com.billing.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findByCustomerId(Long customerId);
    List<PurchaseOrder> findByOrderDateBetween(LocalDate startDate, LocalDate endDate);
    List<PurchaseOrder> findByPaymentStatus(String paymentStatus);
    List<PurchaseOrder> findByDeletedAtIsNull();
    
    @Query("SELECT DISTINCT po FROM PurchaseOrder po LEFT JOIN FETCH po.customer WHERE po.deletedAt IS NULL")
    List<PurchaseOrder> findAllWithCustomer();
    
    @Query("SELECT po FROM PurchaseOrder po LEFT JOIN FETCH po.customer WHERE po.id = :id")
    Optional<PurchaseOrder> findByIdWithCustomer(@Param("id") Long id);
}

