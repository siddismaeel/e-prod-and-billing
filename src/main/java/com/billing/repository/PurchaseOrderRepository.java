package com.billing.repository;

import com.billing.entity.PurchaseOrder;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends BaseRepository<PurchaseOrder, Long> {
    default List<PurchaseOrder> findByCustomerId(Long customerId) {
        Specification<PurchaseOrder> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<PurchaseOrder> customerSpec = (root, query, cb) -> 
            cb.equal(root.get("customer").get("id"), customerId);
        return findAll(Specification.where(filterSpec).and(customerSpec));
    }
    
    default List<PurchaseOrder> findByOrderDateBetween(LocalDate startDate, LocalDate endDate) {
        Specification<PurchaseOrder> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<PurchaseOrder> dateSpec = (root, query, cb) -> 
            cb.between(root.get("orderDate"), startDate, endDate);
        return findAll(Specification.where(filterSpec).and(dateSpec));
    }
    
    default List<PurchaseOrder> findByPaymentStatus(String paymentStatus) {
        Specification<PurchaseOrder> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<PurchaseOrder> statusSpec = (root, query, cb) -> 
            cb.equal(root.get("paymentStatus"), paymentStatus);
        return findAll(Specification.where(filterSpec).and(statusSpec));
    }
    
    default List<PurchaseOrder> findByDeletedAtIsNull() {
        Specification<PurchaseOrder> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<PurchaseOrder> deletedSpec = (root, query, cb) -> 
            cb.isNull(root.get("deletedAt"));
        return findAll(Specification.where(filterSpec).and(deletedSpec));
    }
    
    default List<PurchaseOrder> findAllWithCustomer() {
        Specification<PurchaseOrder> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<PurchaseOrder> deletedSpec = (root, query, cb) -> 
            cb.isNull(root.get("deletedAt"));
        // Note: LEFT JOIN FETCH needs to be handled via entity graph or separate query
        // For now, using standard query
        return findAll(Specification.where(filterSpec).and(deletedSpec));
    }
    
    default Optional<PurchaseOrder> findByIdWithCustomer(Long id) {
        Specification<PurchaseOrder> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<PurchaseOrder> idSpec = (root, query, cb) -> 
            cb.equal(root.get("id"), id);
        // Note: LEFT JOIN FETCH needs to be handled via entity graph or separate query
        // For now, using standard query
        return findOne(Specification.where(filterSpec).and(idSpec));
    }
}

