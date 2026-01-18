package com.billing.repository;

import com.billing.entity.SalesItem;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.util.List;

@Repository
public interface SalesItemRepository extends BaseRepository<SalesItem, Long> {
    default List<SalesItem> findBySalesOrderId(Long salesOrderId) {
        Specification<SalesItem> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<SalesItem> salesOrderSpec = (root, query, cb) -> 
            cb.equal(root.get("salesOrder").get("id"), salesOrderId);
        return findAll(Specification.where(filterSpec).and(salesOrderSpec));
    }
    
    default List<SalesItem> findByGoodsTypeId(Long goodsTypeId) {
        Specification<SalesItem> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<SalesItem> goodsTypeSpec = (root, query, cb) -> 
            cb.equal(root.get("goodsType").get("id"), goodsTypeId);
        return findAll(Specification.where(filterSpec).and(goodsTypeSpec));
    }
    
    default List<SalesItem> findByReadyItemId(Long readyItemId) {
        Specification<SalesItem> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<SalesItem> readyItemSpec = (root, query, cb) -> 
            cb.equal(root.get("readyItem").get("id"), readyItemId);
        return findAll(Specification.where(filterSpec).and(readyItemSpec));
    }
    
    default List<SalesItem> findByReadyItemIdAndQuality(Long readyItemId, String quality) {
        Specification<SalesItem> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<SalesItem> readyItemSpec = (root, query, cb) -> 
            cb.equal(root.get("readyItem").get("id"), readyItemId);
        Specification<SalesItem> qualitySpec = (root, query, cb) -> 
            cb.equal(root.get("quality"), quality);
        return findAll(Specification.where(filterSpec).and(readyItemSpec).and(qualitySpec));
    }
    
    default List<SalesItem> findByDeletedAtIsNull() {
        Specification<SalesItem> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<SalesItem> deletedSpec = (root, query, cb) -> 
            cb.isNull(root.get("deletedAt"));
        return findAll(Specification.where(filterSpec).and(deletedSpec));
    }
}

