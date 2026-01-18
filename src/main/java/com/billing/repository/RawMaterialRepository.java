package com.billing.repository;

import com.billing.entity.RawMaterial;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.util.List;
import java.util.Optional;

@Repository
public interface RawMaterialRepository extends BaseRepository<RawMaterial, Long> {
    default Optional<RawMaterial> findByCode(String code) {
        Specification<RawMaterial> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<RawMaterial> codeSpec = (root, query, cb) -> cb.equal(root.get("code"), code);
        return findOne(Specification.where(filterSpec).and(codeSpec));
    }
    
    default List<RawMaterial> findByGoodsTypeId(Long goodsTypeId) {
        Specification<RawMaterial> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<RawMaterial> goodsTypeSpec = (root, query, cb) -> 
            cb.equal(root.get("goodsType").get("id"), goodsTypeId);
        return findAll(Specification.where(filterSpec).and(goodsTypeSpec));
    }
}

