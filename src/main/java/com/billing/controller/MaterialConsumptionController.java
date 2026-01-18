package com.billing.controller;

import com.billing.dto.MaterialConsumptionDTO;
import com.billing.dto.ProductionRecipeDTO;
import com.billing.entity.MaterialConsumption;
import com.billing.entity.RawMaterial;
import com.billing.entity.ReadyItem;
import com.billing.repository.MaterialConsumptionRepository;
import com.billing.repository.RawMaterialRepository;
import com.billing.repository.ReadyItemRepository;
import com.billing.service.ProductionRecipeService;
import com.billing.service.RawMaterialStockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/material-consumptions")
@RequiredArgsConstructor
public class MaterialConsumptionController {

    private final MaterialConsumptionRepository consumptionRepository;
    private final RawMaterialRepository rawMaterialRepository;
    private final ReadyItemRepository readyItemRepository;
    private final RawMaterialStockService stockService;
    private final ProductionRecipeService recipeService;

    @PostMapping("/manual")
    @Transactional
    public ResponseEntity<MaterialConsumptionDTO> recordManualConsumption(@Valid @RequestBody MaterialConsumptionDTO dto) {
        RawMaterial rawMaterial = rawMaterialRepository.findById(dto.getRawMaterialId())
                .orElseThrow(() -> new RuntimeException("Raw material not found with id: " + dto.getRawMaterialId()));

        // Auto-create/update Production Recipe if all required fields are provided
        if (dto.getReadyItemId() != null && dto.getQuality() != null && !dto.getQuality().trim().isEmpty() 
                && dto.getReadyItemQuantity() != null && dto.getReadyItemQuantity().compareTo(BigDecimal.ZERO) > 0) {
            try {
                // Calculate recipe quantity per unit
                BigDecimal quantityRequired = dto.getQuantity().divide(
                    dto.getReadyItemQuantity(), 
                    4, 
                    RoundingMode.HALF_UP
                );

                // Get unit from raw material or use provided unit
                String unit = (dto.getUnit() != null && !dto.getUnit().trim().isEmpty()) 
                    ? dto.getUnit() 
                    : rawMaterial.getUnit();

                // Create/update recipe
                ProductionRecipeDTO recipeDto = new ProductionRecipeDTO();
                recipeDto.setReadyItemId(dto.getReadyItemId());
                recipeDto.setRawMaterialId(dto.getRawMaterialId());
                recipeDto.setQuality(dto.getQuality());
                recipeDto.setQuantityRequired(quantityRequired);
                recipeDto.setUnit(unit);

                recipeService.upsertRecipe(recipeDto);
            } catch (Exception e) {
                throw new RuntimeException("Failed to create/update production recipe: " + e.getMessage(), e);
            }
        }

        MaterialConsumption consumption = new MaterialConsumption();
        consumption.setRawMaterial(rawMaterial);
        consumption.setQuantity(dto.getQuantity());
        consumption.setConsumptionType(MaterialConsumption.ConsumptionType.valueOf(dto.getConsumptionType()));
        consumption.setDate(dto.getDate());
        consumption.setRemarks(dto.getRemarks());

        if (dto.getReadyItemId() != null) {
            ReadyItem readyItem = readyItemRepository.findById(dto.getReadyItemId())
                    .orElseThrow(() -> new RuntimeException("Ready item not found with id: " + dto.getReadyItemId()));
            consumption.setReadyItem(readyItem);
        }
        if (dto.getProductionBatchId() != null) {
            consumption.setProductionBatchId(dto.getProductionBatchId());
        }

        consumption = consumptionRepository.save(consumption);

        // Update stock
        BigDecimal currentStock = stockService.getCurrentStock(dto.getRawMaterialId());
        stockService.recordDailyStock(dto.getRawMaterialId(), dto.getDate(), currentStock,
                BigDecimal.ZERO, dto.getQuantity());

        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(consumption));
    }

    @GetMapping
    public ResponseEntity<List<MaterialConsumptionDTO>> getConsumptions(
            @RequestParam(required = false) Long rawMaterialId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        List<MaterialConsumption> consumptions;
        
        if (rawMaterialId != null && startDate != null && endDate != null) {
            consumptions = consumptionRepository.findByRawMaterialIdAndDateBetween(rawMaterialId, startDate, endDate);
        } else if (rawMaterialId != null) {
            consumptions = consumptionRepository.findByRawMaterialId(rawMaterialId);
        } else {
            consumptions = consumptionRepository.findAll();
        }
        
        return ResponseEntity.ok(consumptions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList()));
    }

    private MaterialConsumptionDTO convertToDTO(MaterialConsumption consumption) {
        MaterialConsumptionDTO dto = new MaterialConsumptionDTO();
        dto.setId(consumption.getId());
        dto.setRawMaterialId(consumption.getRawMaterial().getId());
        dto.setQuantity(consumption.getQuantity());
        dto.setConsumptionType(consumption.getConsumptionType().name());
        dto.setDate(consumption.getDate());
        dto.setRemarks(consumption.getRemarks());
        if (consumption.getReadyItem() != null) {
            dto.setReadyItemId(consumption.getReadyItem().getId());
        }
        if (consumption.getProductionBatchId() != null) {
            dto.setProductionBatchId(consumption.getProductionBatchId());
        }
        return dto;
    }
}

