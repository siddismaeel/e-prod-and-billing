package com.billing.repository;

import com.billing.entity.PurchaseItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseItemRepository extends JpaRepository<PurchaseItem, Long> {
    List<PurchaseItem> findByPurchaseOrderId(Long purchaseOrderId);
    List<PurchaseItem> findByGoodsTypeId(Long goodsTypeId);
    List<PurchaseItem> findByDeletedAtIsNull();
}

