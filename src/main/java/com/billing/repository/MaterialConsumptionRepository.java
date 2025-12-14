package com.billing.repository;

import com.billing.entity.MaterialConsumption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MaterialConsumptionRepository extends JpaRepository<MaterialConsumption, Long> {
    List<MaterialConsumption> findByRawMaterialId(Long rawMaterialId);
    List<MaterialConsumption> findByRawMaterialIdAndDateBetween(Long rawMaterialId, LocalDate startDate, LocalDate endDate);
    List<MaterialConsumption> findByConsumptionType(MaterialConsumption.ConsumptionType consumptionType);
    List<MaterialConsumption> findByReadyItemId(Long readyItemId);
    List<MaterialConsumption> findByProductionBatchId(Long productionBatchId);
}

