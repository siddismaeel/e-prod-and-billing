package com.billing.repository;

import com.billing.entity.Customer;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends BaseRepository<Customer, Long> {
    default Optional<Customer> findByContact(String contact) {
        Specification<Customer> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Customer> contactSpec = (root, query, cb) -> cb.equal(root.get("contact"), contact);
        return findOne(Specification.where(filterSpec).and(contactSpec));
    }
    
    default List<Customer> findByNameContainingIgnoreCase(String name) {
        Specification<Customer> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Customer> nameSpec = (root, query, cb) -> 
            cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
        return findAll(Specification.where(filterSpec).and(nameSpec));
    }
}

