package com.billing.repository;

import com.billing.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    List<PaymentTransaction> findByCustomerId(Long customerId);
    List<PaymentTransaction> findByCustomerIdAndTransactionDateBetween(Long customerId, LocalDate startDate, LocalDate endDate);
    List<PaymentTransaction> findBySalesOrderId(Long salesOrderId);
    List<PaymentTransaction> findByPurchaseOrderId(Long purchaseOrderId);
    List<PaymentTransaction> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);
}

