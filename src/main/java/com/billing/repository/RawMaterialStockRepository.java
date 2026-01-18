package com.billing.repository;

import com.billing.entity.RawMaterialStock;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RawMaterialStockRepository extends BaseRepository<RawMaterialStock, Long> {
    default List<RawMaterialStock> findByRawMaterialId(Long rawMaterialId) {
        Specification<RawMaterialStock> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<RawMaterialStock> rawMaterialSpec = (root, query, cb) -> 
            cb.equal(root.get("rawMaterial").get("id"), rawMaterialId);
        return findAll(Specification.where(filterSpec).and(rawMaterialSpec));
    }
    
    default Optional<RawMaterialStock> findByRawMaterialIdAndStockDate(Long rawMaterialId, LocalDate stockDate) {
        Specification<RawMaterialStock> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<RawMaterialStock> rawMaterialSpec = (root, query, cb) -> 
            cb.equal(root.get("rawMaterial").get("id"), rawMaterialId);
        Specification<RawMaterialStock> dateSpec = (root, query, cb) -> 
            cb.equal(root.get("stockDate"), stockDate);
        return findOne(Specification.where(filterSpec).and(rawMaterialSpec).and(dateSpec));
    }
    
    default Optional<RawMaterialStock> findFirstByRawMaterialIdOrderByStockDateDesc(Long rawMaterialId) {
        Specification<RawMaterialStock> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<RawMaterialStock> rawMaterialSpec = (root, query, cb) -> 
            cb.equal(root.get("rawMaterial").get("id"), rawMaterialId);
        List<RawMaterialStock> results = findAll(Specification.where(filterSpec).and(rawMaterialSpec), 
            Sort.by(Sort.Direction.DESC, "stockDate"));
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }
    
    default List<RawMaterialStock> findByRawMaterialIdAndStockDateBetween(Long rawMaterialId, LocalDate startDate, LocalDate endDate) {
        Specification<RawMaterialStock> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<RawMaterialStock> rawMaterialSpec = (root, query, cb) -> 
            cb.equal(root.get("rawMaterial").get("id"), rawMaterialId);
        Specification<RawMaterialStock> dateSpec = (root, query, cb) -> 
            cb.between(root.get("stockDate"), startDate, endDate);
        return findAll(Specification.where(filterSpec).and(rawMaterialSpec).and(dateSpec));
    }
}

