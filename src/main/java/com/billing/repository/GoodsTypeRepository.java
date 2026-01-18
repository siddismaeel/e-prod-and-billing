package com.billing.repository;

import com.billing.entity.GoodsType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoodsTypeRepository extends BaseRepository<GoodsType, Long> {
    default List<GoodsType> findByIsDeletedFalse() {
        Specification<GoodsType> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<GoodsType> deletedSpec = (root, query, cb) -> 
            cb.equal(root.get("isDeleted"), false);
        return findAll(Specification.where(filterSpec).and(deletedSpec));
    }
    
    default Optional<GoodsType> findByName(String name) {
        Specification<GoodsType> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<GoodsType> nameSpec = (root, query, cb) -> 
            cb.equal(root.get("name"), name);
        return findOne(Specification.where(filterSpec).and(nameSpec));
    }
}

