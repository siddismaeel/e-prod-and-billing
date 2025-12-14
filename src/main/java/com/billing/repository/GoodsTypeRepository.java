package com.billing.repository;

import com.billing.entity.GoodsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoodsTypeRepository extends JpaRepository<GoodsType, Long> {
    List<GoodsType> findByIsDeletedFalse();
    Optional<GoodsType> findByName(String name);
}

