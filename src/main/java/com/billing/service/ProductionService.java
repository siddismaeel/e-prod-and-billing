package com.billing.service;

import com.billing.dto.MaterialConsumptionDTO;
import com.billing.dto.ProductionDTO;
import com.billing.entity.MaterialConsumption;
import com.billing.entity.Production;
import com.billing.entity.RawMaterial;
import com.billing.entity.ReadyItem;
import com.billing.repository.MaterialConsumptionRepository;
import com.billing.repository.ProductionRepository;
import com.billing.repository.RawMaterialRepository;
import com.billing.repository.ReadyItemRepository;
import com.billing.service.PropositionService.DeviationResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductionService {

    private final ProductionRepository productionRepository;
    private final ReadyItemRepository readyItemRepository;
    private final ProductionRecipeService recipeService;
    private final RawMaterialStockService stockService;
    private final ReadyItemStockService readyItemStockService;
    private final MaterialConsumptionRepository consumptionRepository;
    private final RawMaterialRepository rawMaterialRepository;
    private final PropositionService propositionService;

    @Transactional
    public ProductionDTO produceReadyItem(ProductionDTO dto) {
        ReadyItem readyItem = readyItemRepository.findById(dto.getReadyItemId())
                .orElseThrow(() -> new RuntimeException("Ready item not found with id: " + dto.getReadyItemId()));

        // Calculate required materials based on recipe
        Map<Long, BigDecimal> requiredMaterials = recipeService.calculateRequiredMaterials(
                dto.getReadyItemId(), dto.getQuality(), dto.getQuantityProduced());

        // Check if enough materials are available
        for (Map.Entry<Long, BigDecimal> entry : requiredMaterials.entrySet()) {
            BigDecimal currentStock = stockService.getCurrentStock(entry.getKey());
            if (currentStock.compareTo(entry.getValue()) < 0) {
                throw new RuntimeException("Insufficient stock for raw material ID: " + entry.getKey() +
                        ". Required: " + entry.getValue() + ", Available: " + currentStock);
            }
        }

        // Create production record
        Production production = new Production();
        production.setReadyItem(readyItem);
        production.setQuality(dto.getQuality());
        production.setQuantityProduced(dto.getQuantityProduced());
        production.setProductionDate(dto.getProductionDate());
        production.setBatchNumber(dto.getBatchNumber());
        production.setRemarks(dto.getRemarks());

        production = productionRepository.save(production);

        // Consume raw materials
        LocalDate today = LocalDate.now();
        for (Map.Entry<Long, BigDecimal> entry : requiredMaterials.entrySet()) {
            RawMaterial rawMaterial = rawMaterialRepository.findById(entry.getKey())
                    .orElseThrow(() -> new RuntimeException("Raw material not found"));

            // Record consumption
            MaterialConsumption consumption = new MaterialConsumption();
            consumption.setRawMaterial(rawMaterial);
            consumption.setQuantity(entry.getValue());
            consumption.setConsumptionType(MaterialConsumption.ConsumptionType.PRODUCTION);
            consumption.setReadyItem(readyItem);
            consumption.setProductionBatchId(production.getId());
            consumption.setDate(today);
            consumptionRepository.save(consumption);

            // Update stock
            BigDecimal currentStock = stockService.getCurrentStock(entry.getKey());
            stockService.recordDailyStock(entry.getKey(), today, currentStock,
                    BigDecimal.ZERO, entry.getValue());
        }

        // Update ready item stock
        BigDecimal currentReadyStock = readyItemStockService.getCurrentStock(dto.getReadyItemId());
        readyItemStockService.recordDailyStock(dto.getReadyItemId(), today, currentReadyStock,
                dto.getQuantityProduced(), BigDecimal.ZERO);

        // Check propositions and update ReadyItem with impact data
        checkPropositionsAndUpdateReadyItem(readyItem, dto.getQuantityProduced(), dto.getQuality(), requiredMaterials);

        return convertToDTO(production);
    }

    private void checkPropositionsAndUpdateReadyItem(ReadyItem readyItem, BigDecimal quantityProduced, 
                                                      String quality, Map<Long, BigDecimal> actualQuantities) {
        try {
            // Calculate deviations using PropositionService
            DeviationResult deviationResult = propositionService.calculateDeviations(
                    readyItem.getId(), quantityProduced, quality, actualQuantities);

            // Determine quality and cost impact
            String qualityImpact = determineQualityImpact(deviationResult);
            String costImpact = determineCostImpact(deviationResult);

            // Update ReadyItem with all calculated values
            readyItem.setQualityImpact(qualityImpact);
            readyItem.setCostImpact(costImpact);
            readyItem.setExtraQuantityUsed(deviationResult.getExtraQuantityUsed());
            readyItem.setLessQuantityUsed(deviationResult.getLessQuantityUsed());
            readyItem.setPercentageDeviation(deviationResult.getPercentageDeviation());
            readyItem.setLastPropositionCheck(LocalDateTime.now());

            readyItemRepository.save(readyItem);
        } catch (Exception e) {
            // If proposition check fails, set default values
            readyItem.setQualityImpact("NONE");
            readyItem.setCostImpact("NONE");
            readyItem.setExtraQuantityUsed(BigDecimal.ZERO);
            readyItem.setLessQuantityUsed(BigDecimal.ZERO);
            readyItem.setPercentageDeviation(BigDecimal.ZERO);
            readyItem.setLastPropositionCheck(LocalDateTime.now());
            readyItemRepository.save(readyItem);
        }
    }

    private String determineQualityImpact(DeviationResult deviationResult) {
        if (deviationResult.getExtraQuantityUsed().compareTo(BigDecimal.ZERO) > 0) {
            return "HIGH"; // Using more material = better quality
        } else if (deviationResult.getLessQuantityUsed().compareTo(BigDecimal.ZERO) > 0) {
            return "LOW"; // Using less material = lower quality
        } else {
            return "NORMAL"; // No deviation
        }
    }

    private String determineCostImpact(DeviationResult deviationResult) {
        if (deviationResult.getExtraQuantityUsed().compareTo(BigDecimal.ZERO) > 0) {
            return "HIGH"; // Using more material = higher cost
        } else if (deviationResult.getLessQuantityUsed().compareTo(BigDecimal.ZERO) > 0) {
            return "LOW"; // Using less material = lower cost
        } else {
            return "NORMAL"; // No deviation
        }
    }

    @Transactional
    public ProductionDTO recordProduction(ProductionDTO dto) {
        return produceReadyItem(dto);
    }

    public List<ProductionDTO> getAllProductions() {
        return productionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ProductionDTO convertToDTO(Production production) {
        ProductionDTO dto = new ProductionDTO();
        dto.setId(production.getId());
        dto.setReadyItemId(production.getReadyItem().getId());
        dto.setQuality(production.getQuality());
        dto.setQuantityProduced(production.getQuantityProduced());
        dto.setProductionDate(production.getProductionDate());
        dto.setBatchNumber(production.getBatchNumber());
        dto.setRemarks(production.getRemarks());
        return dto;
    }
}

