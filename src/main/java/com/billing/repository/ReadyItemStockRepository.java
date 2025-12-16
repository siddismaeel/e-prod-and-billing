package com.billing.repository;

import com.billing.entity.ReadyItemStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReadyItemStockRepository extends JpaRepository<ReadyItemStock, Long> {
    List<ReadyItemStock> findByReadyItemId(Long readyItemId);
    Optional<ReadyItemStock> findByReadyItemIdAndStockDate(Long readyItemId, LocalDate stockDate);
    Optional<ReadyItemStock> findByReadyItemIdAndStockDateAndQuality(Long readyItemId, LocalDate stockDate, String quality);
    Optional<ReadyItemStock> findFirstByReadyItemIdOrderByStockDateDesc(Long readyItemId);
    Optional<ReadyItemStock> findFirstByReadyItemIdAndQualityOrderByStockDateDesc(Long readyItemId, String quality);
    List<ReadyItemStock> findByReadyItemIdAndStockDateBetween(Long readyItemId, LocalDate startDate, LocalDate endDate);
}

