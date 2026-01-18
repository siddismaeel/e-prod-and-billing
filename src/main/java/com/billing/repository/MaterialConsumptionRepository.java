package com.billing.repository;

import com.billing.entity.MaterialConsumption;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MaterialConsumptionRepository extends BaseRepository<MaterialConsumption, Long> {
    default List<MaterialConsumption> findByRawMaterialId(Long rawMaterialId) {
        Specification<MaterialConsumption> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<MaterialConsumption> rawMaterialSpec = (root, query, cb) -> 
            cb.equal(root.get("rawMaterial").get("id"), rawMaterialId);
        return findAll(Specification.where(filterSpec).and(rawMaterialSpec));
    }
    
    default List<MaterialConsumption> findByRawMaterialIdAndDateBetween(Long rawMaterialId, LocalDate startDate, LocalDate endDate) {
        Specification<MaterialConsumption> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<MaterialConsumption> rawMaterialSpec = (root, query, cb) -> 
            cb.equal(root.get("rawMaterial").get("id"), rawMaterialId);
        Specification<MaterialConsumption> dateSpec = (root, query, cb) -> 
            cb.between(root.get("date"), startDate, endDate);
        return findAll(Specification.where(filterSpec).and(rawMaterialSpec).and(dateSpec));
    }
    
    default List<MaterialConsumption> findByConsumptionType(MaterialConsumption.ConsumptionType consumptionType) {
        Specification<MaterialConsumption> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<MaterialConsumption> typeSpec = (root, query, cb) -> 
            cb.equal(root.get("consumptionType"), consumptionType);
        return findAll(Specification.where(filterSpec).and(typeSpec));
    }
    
    default List<MaterialConsumption> findByReadyItemId(Long readyItemId) {
        Specification<MaterialConsumption> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<MaterialConsumption> readyItemSpec = (root, query, cb) -> 
            cb.equal(root.get("readyItem").get("id"), readyItemId);
        return findAll(Specification.where(filterSpec).and(readyItemSpec));
    }
    
    default List<MaterialConsumption> findByProductionBatchId(Long productionBatchId) {
        Specification<MaterialConsumption> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<MaterialConsumption> batchSpec = (root, query, cb) -> 
            cb.equal(root.get("productionBatchId"), productionBatchId);
        return findAll(Specification.where(filterSpec).and(batchSpec));
    }
}

