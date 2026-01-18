package com.billing.repository;

import com.billing.entity.CustomerAccount;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.util.Optional;

@Repository
public interface CustomerAccountRepository extends BaseRepository<CustomerAccount, Long> {
    default Optional<CustomerAccount> findByCustomerId(Long customerId) {
        Specification<CustomerAccount> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<CustomerAccount> customerSpec = (root, query, cb) -> 
            cb.equal(root.get("customer").get("id"), customerId);
        return findOne(Specification.where(filterSpec).and(customerSpec));
    }
    
    default Optional<CustomerAccount> findByCustomerIdWithCustomer(Long customerId) {
        // Note: JOIN FETCH needs to be handled via entity graph or separate query
        // For now, using standard query
        return findByCustomerId(customerId);
    }
}



