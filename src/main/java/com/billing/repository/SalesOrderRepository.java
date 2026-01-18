package com.billing.repository;

import com.billing.entity.SalesOrder;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalesOrderRepository extends BaseRepository<SalesOrder, Long> {
    default List<SalesOrder> findByCustomerId(Long customerId) {
        Specification<SalesOrder> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<SalesOrder> customerSpec = (root, query, cb) -> 
            cb.equal(root.get("customer").get("id"), customerId);
        return findAll(Specification.where(filterSpec).and(customerSpec));
    }
    
    default List<SalesOrder> findByOrderDateBetween(LocalDate startDate, LocalDate endDate) {
        Specification<SalesOrder> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<SalesOrder> dateSpec = (root, query, cb) -> 
            cb.between(root.get("orderDate"), startDate, endDate);
        return findAll(Specification.where(filterSpec).and(dateSpec));
    }
    
    default List<SalesOrder> findByPaymentStatus(String paymentStatus) {
        Specification<SalesOrder> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<SalesOrder> statusSpec = (root, query, cb) -> 
            cb.equal(root.get("paymentStatus"), paymentStatus);
        return findAll(Specification.where(filterSpec).and(statusSpec));
    }
    
    default List<SalesOrder> findByDeletedAtIsNull() {
        Specification<SalesOrder> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<SalesOrder> deletedSpec = (root, query, cb) -> 
            cb.isNull(root.get("deletedAt"));
        return findAll(Specification.where(filterSpec).and(deletedSpec));
    }
    
    default List<SalesOrder> findAllWithCustomer() {
        Specification<SalesOrder> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<SalesOrder> deletedSpec = (root, query, cb) -> 
            cb.isNull(root.get("deletedAt"));
        // Note: LEFT JOIN FETCH needs to be handled via entity graph or separate query
        // For now, using standard query
        return findAll(Specification.where(filterSpec).and(deletedSpec));
    }
    
    default Optional<SalesOrder> findByIdWithCustomer(Long id) {
        Specification<SalesOrder> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<SalesOrder> idSpec = (root, query, cb) -> 
            cb.equal(root.get("id"), id);
        // Note: LEFT JOIN FETCH needs to be handled via entity graph or separate query
        // For now, using standard query
        return findOne(Specification.where(filterSpec).and(idSpec));
    }
}

