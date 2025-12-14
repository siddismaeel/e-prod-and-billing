package com.billing.repository;

import com.billing.entity.Production;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductionRepository extends JpaRepository<Production, Long> {
    List<Production> findByReadyItemId(Long readyItemId);
    List<Production> findByProductionDateBetween(LocalDate startDate, LocalDate endDate);
    Optional<Production> findByBatchNumber(String batchNumber);
    List<Production> findByReadyItemIdAndQuality(Long readyItemId, String quality);
}

