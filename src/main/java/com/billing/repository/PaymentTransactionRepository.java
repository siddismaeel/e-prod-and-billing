package com.billing.repository;

import com.billing.entity.PaymentTransaction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentTransactionRepository extends BaseRepository<PaymentTransaction, Long> {
    default List<PaymentTransaction> findByCustomerId(Long customerId) {
        Specification<PaymentTransaction> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<PaymentTransaction> customerSpec = (root, query, cb) -> 
            cb.equal(root.get("customer").get("id"), customerId);
        return findAll(Specification.where(filterSpec).and(customerSpec));
    }
    
    default List<PaymentTransaction> findByCustomerIdAndTransactionDateBetween(Long customerId, LocalDate startDate, LocalDate endDate) {
        Specification<PaymentTransaction> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<PaymentTransaction> customerSpec = (root, query, cb) -> 
            cb.equal(root.get("customer").get("id"), customerId);
        Specification<PaymentTransaction> dateSpec = (root, query, cb) -> 
            cb.between(root.get("transactionDate"), startDate, endDate);
        return findAll(Specification.where(filterSpec).and(customerSpec).and(dateSpec));
    }
    
    default List<PaymentTransaction> findBySalesOrderId(Long salesOrderId) {
        Specification<PaymentTransaction> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<PaymentTransaction> salesOrderSpec = (root, query, cb) -> 
            cb.equal(root.get("salesOrder").get("id"), salesOrderId);
        return findAll(Specification.where(filterSpec).and(salesOrderSpec));
    }
    
    default List<PaymentTransaction> findByPurchaseOrderId(Long purchaseOrderId) {
        Specification<PaymentTransaction> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<PaymentTransaction> purchaseOrderSpec = (root, query, cb) -> 
            cb.equal(root.get("purchaseOrder").get("id"), purchaseOrderId);
        return findAll(Specification.where(filterSpec).and(purchaseOrderSpec));
    }
    
    default List<PaymentTransaction> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate) {
        Specification<PaymentTransaction> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<PaymentTransaction> dateSpec = (root, query, cb) -> 
            cb.between(root.get("transactionDate"), startDate, endDate);
        return findAll(Specification.where(filterSpec).and(dateSpec));
    }
}



