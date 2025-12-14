package com.billing.repository;

import com.billing.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByContact(String contact);
    List<Customer> findByNameContainingIgnoreCase(String name);
}

