package com.billing.service;

import com.billing.dto.PropositionDTO;
import com.billing.dto.PropositionBatchDTO;
import com.billing.dto.PropositionEntryDTO;
import com.billing.entity.Proposition;
import com.billing.entity.RawMaterial;
import com.billing.entity.ReadyItem;
import com.billing.repository.ProductionRecipeRepository;
import com.billing.repository.PropositionRepository;
import com.billing.repository.RawMaterialRepository;
import com.billing.repository.ReadyItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropositionService {

    private final PropositionRepository propositionRepository;
    private final ReadyItemRepository readyItemRepository;
    private final RawMaterialRepository rawMaterialRepository;
    private final ProductionRecipeRepository recipeRepository;

    @Transactional
    public PropositionDTO upsertProposition(PropositionDTO dto) {
        ReadyItem readyItem = readyItemRepository.findById(dto.getReadyItemId())
                .orElseThrow(() -> new RuntimeException("Ready item not found with id: " + dto.getReadyItemId()));

        RawMaterial rawMaterial = rawMaterialRepository.findById(dto.getRawMaterialId())
                .orElseThrow(() -> new RuntimeException("Raw material not found with id: " + dto.getRawMaterialId()));

        Proposition proposition = propositionRepository
                .findByReadyItemIdAndRawMaterialId(dto.getReadyItemId(), dto.getRawMaterialId())
                .orElse(new Proposition());

        proposition.setReadyItem(readyItem);
        proposition.setRawMaterial(rawMaterial);
        proposition.setExpectedPercentage(dto.getExpectedPercentage());

        proposition = propositionRepository.save(proposition);
        return convertToDTO(proposition);
    }

    @Transactional
    public List<PropositionDTO> upsertPropositionsBatch(PropositionBatchDTO batchDto) {
        ReadyItem readyItem = readyItemRepository.findById(batchDto.getReadyItemId())
                .orElseThrow(() -> new RuntimeException("Ready item not found with id: " + batchDto.getReadyItemId()));

        List<PropositionDTO> savedPropositions = new ArrayList<>();
        
        for (PropositionEntryDTO entry : batchDto.getRawMaterialEntries()) {
            RawMaterial rawMaterial = rawMaterialRepository.findById(entry.getRawMaterialId())
                    .orElseThrow(() -> new RuntimeException("Raw material not found with id: " + entry.getRawMaterialId()));

            Proposition proposition = propositionRepository
                    .findByReadyItemIdAndRawMaterialId(batchDto.getReadyItemId(), entry.getRawMaterialId())
                    .orElse(new Proposition());

            proposition.setReadyItem(readyItem);
            proposition.setRawMaterial(rawMaterial);
            proposition.setExpectedPercentage(entry.getExpectedPercentage());

            proposition = propositionRepository.save(proposition);
            savedPropositions.add(convertToDTO(proposition));
        }
        
        return savedPropositions;
    }

    public List<PropositionDTO> getPropositionsByReadyItem(Long readyItemId) {
        return propositionRepository.findByReadyItemId(readyItemId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public boolean validatePropositions(Long readyItemId) {
        List<Proposition> propositions = propositionRepository.findByReadyItemId(readyItemId);
        BigDecimal totalPercentage = propositions.stream()
                .map(Proposition::getExpectedPercentage)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Check if total is approximately 100% (allowing small rounding differences)
        return totalPercentage.compareTo(new BigDecimal("99.5")) >= 0 && 
               totalPercentage.compareTo(new BigDecimal("100.5")) <= 0;
    }

    public DeviationResult calculateDeviations(Long readyItemId, BigDecimal quantityProduced, 
                                                String quality, Map<Long, BigDecimal> actualQuantities) {
        List<Proposition> propositions = propositionRepository.findByReadyItemId(readyItemId);
        
        if (propositions.isEmpty()) {
            // No propositions defined, return zero deviations
            return new DeviationResult(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        }

        // First, calculate total expected quantity based on recipes
        BigDecimal totalExpectedFromRecipes = BigDecimal.ZERO;
        Map<Long, BigDecimal> expectedQuantitiesFromRecipes = new HashMap<>();
        
        for (Proposition proposition : propositions) {
            Long rawMaterialId = proposition.getRawMaterial().getId();
            
            // Get recipe quantity required per unit for this material and quality
            BigDecimal quantityRequiredPerUnit = recipeRepository
                    .findByReadyItemIdAndRawMaterialIdAndQuality(readyItemId, rawMaterialId, quality)
                    .map(com.billing.entity.ProductionRecipe::getQuantityRequired)
                    .orElse(BigDecimal.ZERO);

            if (quantityRequiredPerUnit.compareTo(BigDecimal.ZERO) == 0) {
                continue; // Skip if no recipe found
            }

            // Calculate expected quantity from recipe
            BigDecimal expectedFromRecipe = quantityRequiredPerUnit.multiply(quantityProduced);
            expectedQuantitiesFromRecipes.put(rawMaterialId, expectedFromRecipe);
            totalExpectedFromRecipes = totalExpectedFromRecipes.add(expectedFromRecipe);
        }

        if (totalExpectedFromRecipes.compareTo(BigDecimal.ZERO) == 0) {
            return new DeviationResult(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        }

        // Now calculate expected quantities based on Proposition percentages
        BigDecimal totalExtraQuantity = BigDecimal.ZERO;
        BigDecimal totalLessQuantity = BigDecimal.ZERO;
        BigDecimal totalExpectedQuantity = BigDecimal.ZERO;
        BigDecimal totalActualQuantity = BigDecimal.ZERO;

        for (Proposition proposition : propositions) {
            Long rawMaterialId = proposition.getRawMaterial().getId();
            
            // Get expected quantity from recipe
            BigDecimal expectedFromRecipe = expectedQuantitiesFromRecipes.getOrDefault(rawMaterialId, BigDecimal.ZERO);
            if (expectedFromRecipe.compareTo(BigDecimal.ZERO) == 0) {
                continue;
            }

            // Calculate expected quantity based on Proposition percentage
            // Expected = (Expected Percentage / 100) * Total Expected from Recipes
            BigDecimal expectedQuantity = proposition.getExpectedPercentage()
                    .divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP)
                    .multiply(totalExpectedFromRecipes);

            // Get actual quantity
            BigDecimal actualQuantity = actualQuantities.getOrDefault(rawMaterialId, BigDecimal.ZERO);

            // Calculate deviation
            BigDecimal deviation = actualQuantity.subtract(expectedQuantity);
            
            totalExpectedQuantity = totalExpectedQuantity.add(expectedQuantity);
            totalActualQuantity = totalActualQuantity.add(actualQuantity);

            if (deviation.compareTo(BigDecimal.ZERO) > 0) {
                // Extra quantity used
                totalExtraQuantity = totalExtraQuantity.add(deviation);
            } else if (deviation.compareTo(BigDecimal.ZERO) < 0) {
                // Less quantity used
                totalLessQuantity = totalLessQuantity.add(deviation.abs());
            }
        }

        // Calculate overall percentage deviation
        BigDecimal percentageDeviation = BigDecimal.ZERO;
        if (totalExpectedQuantity.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal totalDeviation = totalActualQuantity.subtract(totalExpectedQuantity);
            percentageDeviation = totalDeviation
                    .divide(totalExpectedQuantity, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
        }

        return new DeviationResult(totalExtraQuantity, totalLessQuantity, percentageDeviation);
    }

    public Map<Long, BigDecimal> calculateActualPercentages(Long readyItemId, Map<Long, BigDecimal> actualQuantities) {
        BigDecimal totalQuantity = actualQuantities.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalQuantity.compareTo(BigDecimal.ZERO) == 0) {
            return new HashMap<>();
        }

        Map<Long, BigDecimal> percentages = new HashMap<>();
        for (Map.Entry<Long, BigDecimal> entry : actualQuantities.entrySet()) {
            BigDecimal percentage = entry.getValue()
                    .divide(totalQuantity, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
            percentages.put(entry.getKey(), percentage);
        }

        return percentages;
    }

    private PropositionDTO convertToDTO(Proposition proposition) {
        PropositionDTO dto = new PropositionDTO();
        dto.setId(proposition.getId());
        dto.setReadyItemId(proposition.getReadyItem().getId());
        dto.setReadyItemName(proposition.getReadyItem() != null ? proposition.getReadyItem().getName() : null);
        dto.setRawMaterialId(proposition.getRawMaterial().getId());
        dto.setRawMaterialName(proposition.getRawMaterial() != null ? proposition.getRawMaterial().getName() : null);
        dto.setExpectedPercentage(proposition.getExpectedPercentage());
        return dto;
    }

    // Inner class for deviation results
    public static class DeviationResult {
        private final BigDecimal extraQuantityUsed;
        private final BigDecimal lessQuantityUsed;
        private final BigDecimal percentageDeviation;

        public DeviationResult(BigDecimal extraQuantityUsed, BigDecimal lessQuantityUsed, BigDecimal percentageDeviation) {
            this.extraQuantityUsed = extraQuantityUsed;
            this.lessQuantityUsed = lessQuantityUsed;
            this.percentageDeviation = percentageDeviation;
        }

        public BigDecimal getExtraQuantityUsed() {
            return extraQuantityUsed;
        }

        public BigDecimal getLessQuantityUsed() {
            return lessQuantityUsed;
        }

        public BigDecimal getPercentageDeviation() {
            return percentageDeviation;
        }
    }
}

