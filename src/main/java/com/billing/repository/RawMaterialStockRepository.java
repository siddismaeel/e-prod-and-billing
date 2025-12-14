package com.billing.repository;

import com.billing.entity.RawMaterialStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RawMaterialStockRepository extends JpaRepository<RawMaterialStock, Long> {
    List<RawMaterialStock> findByRawMaterialId(Long rawMaterialId);
    Optional<RawMaterialStock> findByRawMaterialIdAndStockDate(Long rawMaterialId, LocalDate stockDate);
    Optional<RawMaterialStock> findFirstByRawMaterialIdOrderByStockDateDesc(Long rawMaterialId);
    List<RawMaterialStock> findByRawMaterialIdAndStockDateBetween(Long rawMaterialId, LocalDate startDate, LocalDate endDate);
}

