package com.billing.repository;

import com.billing.entity.PurchaseItem;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.util.List;

@Repository
public interface PurchaseItemRepository extends BaseRepository<PurchaseItem, Long> {
    default List<PurchaseItem> findByPurchaseOrderId(Long purchaseOrderId) {
        Specification<PurchaseItem> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<PurchaseItem> purchaseOrderSpec = (root, query, cb) -> 
            cb.equal(root.get("purchaseOrder").get("id"), purchaseOrderId);
        return findAll(Specification.where(filterSpec).and(purchaseOrderSpec));
    }
    
    default List<PurchaseItem> findByGoodsTypeId(Long goodsTypeId) {
        Specification<PurchaseItem> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<PurchaseItem> goodsTypeSpec = (root, query, cb) -> 
            cb.equal(root.get("goodsType").get("id"), goodsTypeId);
        return findAll(Specification.where(filterSpec).and(goodsTypeSpec));
    }
    
    default List<PurchaseItem> findByRawMaterialId(Long rawMaterialId) {
        Specification<PurchaseItem> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<PurchaseItem> rawMaterialSpec = (root, query, cb) -> 
            cb.equal(root.get("rawMaterial").get("id"), rawMaterialId);
        return findAll(Specification.where(filterSpec).and(rawMaterialSpec));
    }
    
    default List<PurchaseItem> findByRawMaterialIdAndDeletedAtIsNull(Long rawMaterialId) {
        Specification<PurchaseItem> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<PurchaseItem> rawMaterialSpec = (root, query, cb) -> 
            cb.equal(root.get("rawMaterial").get("id"), rawMaterialId);
        Specification<PurchaseItem> deletedSpec = (root, query, cb) -> 
            cb.isNull(root.get("deletedAt"));
        return findAll(Specification.where(filterSpec).and(rawMaterialSpec).and(deletedSpec));
    }
    
    default List<PurchaseItem> findByDeletedAtIsNull() {
        Specification<PurchaseItem> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<PurchaseItem> deletedSpec = (root, query, cb) -> 
            cb.isNull(root.get("deletedAt"));
        return findAll(Specification.where(filterSpec).and(deletedSpec));
    }
}

