package com.billing.repository;

import com.billing.entity.ReadyItem;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReadyItemRepository extends BaseRepository<ReadyItem, Long> {
    default Optional<ReadyItem> findByCode(String code) {
        Specification<ReadyItem> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<ReadyItem> codeSpec = (root, query, cb) -> cb.equal(root.get("code"), code);
        return findOne(Specification.where(filterSpec).and(codeSpec));
    }
    
    default List<ReadyItem> findByGoodsTypeId(Long goodsTypeId) {
        Specification<ReadyItem> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<ReadyItem> goodsTypeSpec = (root, query, cb) -> 
            cb.equal(root.get("goodsType").get("id"), goodsTypeId);
        return findAll(Specification.where(filterSpec).and(goodsTypeSpec));
    }
}

