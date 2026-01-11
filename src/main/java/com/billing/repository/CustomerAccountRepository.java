package com.billing.repository;

import com.billing.entity.CustomerAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerAccountRepository extends JpaRepository<CustomerAccount, Long> {
    Optional<CustomerAccount> findByCustomerId(Long customerId);
    
    @Query("SELECT ca FROM CustomerAccount ca JOIN FETCH ca.customer WHERE ca.customer.id = :customerId")
    Optional<CustomerAccount> findByCustomerIdWithCustomer(@Param("customerId") Long customerId);
}



