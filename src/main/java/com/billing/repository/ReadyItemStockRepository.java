package com.billing.repository;

import com.billing.entity.ReadyItemStock;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReadyItemStockRepository extends BaseRepository<ReadyItemStock, Long> {
    default List<ReadyItemStock> findByReadyItemId(Long readyItemId) {
        Specification<ReadyItemStock> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<ReadyItemStock> readyItemSpec = (root, query, cb) -> 
            cb.equal(root.get("readyItem").get("id"), readyItemId);
        return findAll(Specification.where(filterSpec).and(readyItemSpec));
    }
    
    default Optional<ReadyItemStock> findByReadyItemIdAndStockDate(Long readyItemId, LocalDate stockDate) {
        Specification<ReadyItemStock> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<ReadyItemStock> readyItemSpec = (root, query, cb) -> 
            cb.equal(root.get("readyItem").get("id"), readyItemId);
        Specification<ReadyItemStock> dateSpec = (root, query, cb) -> 
            cb.equal(root.get("stockDate"), stockDate);
        return findOne(Specification.where(filterSpec).and(readyItemSpec).and(dateSpec));
    }
    
    default Optional<ReadyItemStock> findByReadyItemIdAndStockDateAndQuality(Long readyItemId, LocalDate stockDate, String quality) {
        Specification<ReadyItemStock> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<ReadyItemStock> readyItemSpec = (root, query, cb) -> 
            cb.equal(root.get("readyItem").get("id"), readyItemId);
        Specification<ReadyItemStock> dateSpec = (root, query, cb) -> 
            cb.equal(root.get("stockDate"), stockDate);
        Specification<ReadyItemStock> qualitySpec = (root, query, cb) -> 
            cb.equal(root.get("quality"), quality);
        return findOne(Specification.where(filterSpec).and(readyItemSpec).and(dateSpec).and(qualitySpec));
    }
    
    default Optional<ReadyItemStock> findFirstByReadyItemIdOrderByStockDateDesc(Long readyItemId) {
        Specification<ReadyItemStock> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<ReadyItemStock> readyItemSpec = (root, query, cb) -> 
            cb.equal(root.get("readyItem").get("id"), readyItemId);
        List<ReadyItemStock> results = findAll(Specification.where(filterSpec).and(readyItemSpec), 
            Sort.by(Sort.Direction.DESC, "stockDate"));
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }
    
    default Optional<ReadyItemStock> findFirstByReadyItemIdAndQualityOrderByStockDateDesc(Long readyItemId, String quality) {
        Specification<ReadyItemStock> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<ReadyItemStock> readyItemSpec = (root, query, cb) -> 
            cb.equal(root.get("readyItem").get("id"), readyItemId);
        Specification<ReadyItemStock> qualitySpec = (root, query, cb) -> 
            cb.equal(root.get("quality"), quality);
        List<ReadyItemStock> results = findAll(Specification.where(filterSpec).and(readyItemSpec).and(qualitySpec), 
            Sort.by(Sort.Direction.DESC, "stockDate"));
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }
    
    default List<ReadyItemStock> findByReadyItemIdAndStockDateBetween(Long readyItemId, LocalDate startDate, LocalDate endDate) {
        Specification<ReadyItemStock> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<ReadyItemStock> readyItemSpec = (root, query, cb) -> 
            cb.equal(root.get("readyItem").get("id"), readyItemId);
        Specification<ReadyItemStock> dateSpec = (root, query, cb) -> 
            cb.between(root.get("stockDate"), startDate, endDate);
        return findAll(Specification.where(filterSpec).and(readyItemSpec).and(dateSpec));
    }
}

