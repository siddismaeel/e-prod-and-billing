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
    Optional<ReadyItemStock> findFirstByReadyItemIdOrderByStockDateDesc(Long readyItemId);
    List<ReadyItemStock> findByReadyItemIdAndStockDateBetween(Long readyItemId, LocalDate startDate, LocalDate endDate);
}

