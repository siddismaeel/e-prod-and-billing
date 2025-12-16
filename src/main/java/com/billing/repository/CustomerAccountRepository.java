package com.billing.repository;

import com.billing.entity.CustomerAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerAccountRepository extends JpaRepository<CustomerAccount, Long> {
    Optional<CustomerAccount> findByCustomerId(Long customerId);
}

