package com.billing.repository;

import com.billing.entity.Production;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductionRepository extends BaseRepository<Production, Long> {
    default List<Production> findByReadyItemId(Long readyItemId) {
        Specification<Production> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Production> readyItemSpec = (root, query, cb) -> 
            cb.equal(root.get("readyItem").get("id"), readyItemId);
        return findAll(Specification.where(filterSpec).and(readyItemSpec));
    }
    
    default List<Production> findByProductionDateBetween(LocalDate startDate, LocalDate endDate) {
        Specification<Production> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Production> dateSpec = (root, query, cb) -> 
            cb.between(root.get("productionDate"), startDate, endDate);
        return findAll(Specification.where(filterSpec).and(dateSpec));
    }
    
    default Optional<Production> findByBatchNumber(String batchNumber) {
        Specification<Production> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Production> batchSpec = (root, query, cb) -> 
            cb.equal(root.get("batchNumber"), batchNumber);
        return findOne(Specification.where(filterSpec).and(batchSpec));
    }
    
    default List<Production> findByReadyItemIdAndQuality(Long readyItemId, String quality) {
        Specification<Production> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Production> readyItemSpec = (root, query, cb) -> 
            cb.equal(root.get("readyItem").get("id"), readyItemId);
        Specification<Production> qualitySpec = (root, query, cb) -> 
            cb.equal(root.get("quality"), quality);
        return findAll(Specification.where(filterSpec).and(readyItemSpec).and(qualitySpec));
    }
}

