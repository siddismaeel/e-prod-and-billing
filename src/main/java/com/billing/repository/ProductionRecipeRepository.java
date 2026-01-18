package com.billing.repository;

import com.billing.entity.ProductionRecipe;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductionRecipeRepository extends BaseRepository<ProductionRecipe, Long> {
    default List<ProductionRecipe> findByReadyItemId(Long readyItemId) {
        Specification<ProductionRecipe> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<ProductionRecipe> readyItemSpec = (root, query, cb) -> 
            cb.equal(root.get("readyItem").get("id"), readyItemId);
        return findAll(Specification.where(filterSpec).and(readyItemSpec));
    }
    
    default List<ProductionRecipe> findByReadyItemIdAndQuality(Long readyItemId, String quality) {
        Specification<ProductionRecipe> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<ProductionRecipe> readyItemSpec = (root, query, cb) -> 
            cb.equal(root.get("readyItem").get("id"), readyItemId);
        Specification<ProductionRecipe> qualitySpec = (root, query, cb) -> 
            cb.equal(root.get("quality"), quality);
        return findAll(Specification.where(filterSpec).and(readyItemSpec).and(qualitySpec));
    }
    
    default Optional<ProductionRecipe> findByReadyItemIdAndRawMaterialIdAndQuality(Long readyItemId, Long rawMaterialId, String quality) {
        Specification<ProductionRecipe> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<ProductionRecipe> readyItemSpec = (root, query, cb) -> 
            cb.equal(root.get("readyItem").get("id"), readyItemId);
        Specification<ProductionRecipe> rawMaterialSpec = (root, query, cb) -> 
            cb.equal(root.get("rawMaterial").get("id"), rawMaterialId);
        Specification<ProductionRecipe> qualitySpec = (root, query, cb) -> 
            cb.equal(root.get("quality"), quality);
        return findOne(Specification.where(filterSpec).and(readyItemSpec).and(rawMaterialSpec).and(qualitySpec));
    }
    
    default List<ProductionRecipe> findByRawMaterialId(Long rawMaterialId) {
        Specification<ProductionRecipe> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<ProductionRecipe> rawMaterialSpec = (root, query, cb) -> 
            cb.equal(root.get("rawMaterial").get("id"), rawMaterialId);
        return findAll(Specification.where(filterSpec).and(rawMaterialSpec));
    }
}

