package com.billing.repository;

import com.billing.entity.SalesItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesItemRepository extends JpaRepository<SalesItem, Long> {
    List<SalesItem> findBySalesOrderId(Long salesOrderId);
    List<SalesItem> findByGoodsTypeId(Long goodsTypeId);
    List<SalesItem> findByReadyItemId(Long readyItemId);
    List<SalesItem> findByReadyItemIdAndQuality(Long readyItemId, String quality);
    List<SalesItem> findByDeletedAtIsNull();
}

