package com.billing.repository;

import com.billing.entity.Proposition;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropositionRepository extends BaseRepository<Proposition, Long> {
    default List<Proposition> findByReadyItemId(Long readyItemId) {
        Specification<Proposition> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Proposition> readyItemSpec = (root, query, cb) -> 
            cb.equal(root.get("readyItem").get("id"), readyItemId);
        return findAll(Specification.where(filterSpec).and(readyItemSpec));
    }
    
    default Optional<Proposition> findByReadyItemIdAndRawMaterialId(Long readyItemId, Long rawMaterialId) {
        Specification<Proposition> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Proposition> readyItemSpec = (root, query, cb) -> 
            cb.equal(root.get("readyItem").get("id"), readyItemId);
        Specification<Proposition> rawMaterialSpec = (root, query, cb) -> 
            cb.equal(root.get("rawMaterial").get("id"), rawMaterialId);
        return findOne(Specification.where(filterSpec).and(readyItemSpec).and(rawMaterialSpec));
    }
    
    default void deleteByReadyItemId(Long readyItemId) {
        List<Proposition> propositions = findByReadyItemId(readyItemId);
        deleteAll(propositions);
    }
}

