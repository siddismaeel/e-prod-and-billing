package com.billing.repository;

import com.billing.entity.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    List<SalesOrder> findByCustomerId(Long customerId);
    List<SalesOrder> findByOrderDateBetween(LocalDate startDate, LocalDate endDate);
    List<SalesOrder> findByPaymentStatus(String paymentStatus);
    List<SalesOrder> findByDeletedAtIsNull();
    
    @Query("SELECT DISTINCT so FROM SalesOrder so LEFT JOIN FETCH so.customer WHERE so.deletedAt IS NULL")
    List<SalesOrder> findAllWithCustomer();
    
    @Query("SELECT so FROM SalesOrder so LEFT JOIN FETCH so.customer WHERE so.id = :id")
    Optional<SalesOrder> findByIdWithCustomer(@Param("id") Long id);
}

