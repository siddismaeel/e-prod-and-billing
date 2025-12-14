package com.billing.repository;

import com.billing.entity.ReadyItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReadyItemRepository extends JpaRepository<ReadyItem, Long> {
    Optional<ReadyItem> findByCode(String code);
    List<ReadyItem> findByGoodsTypeId(Long goodsTypeId);
}

