package com.billing.service;

import com.billing.dto.ProductionRecipeDTO;
import com.billing.entity.ProductionRecipe;
import com.billing.entity.RawMaterial;
import com.billing.entity.ReadyItem;
import com.billing.repository.ProductionRecipeRepository;
import com.billing.repository.RawMaterialRepository;
import com.billing.repository.ReadyItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductionRecipeService {

    private final ProductionRecipeRepository recipeRepository;
    private final ReadyItemRepository readyItemRepository;
    private final RawMaterialRepository rawMaterialRepository;

    @Transactional
    public ProductionRecipeDTO upsertRecipe(ProductionRecipeDTO dto) {
        ReadyItem readyItem = readyItemRepository.findById(dto.getReadyItemId())
                .orElseThrow(() -> new RuntimeException("Ready item not found with id: " + dto.getReadyItemId()));

        RawMaterial rawMaterial = rawMaterialRepository.findById(dto.getRawMaterialId())
                .orElseThrow(() -> new RuntimeException("Raw material not found with id: " + dto.getRawMaterialId()));

        ProductionRecipe recipe = recipeRepository
                .findByReadyItemIdAndRawMaterialIdAndQuality(dto.getReadyItemId(), dto.getRawMaterialId(), dto.getQuality())
                .orElse(new ProductionRecipe());

        recipe.setReadyItem(readyItem);
        recipe.setRawMaterial(rawMaterial);
        recipe.setQuality(dto.getQuality());
        recipe.setQuantityRequired(dto.getQuantityRequired());
        recipe.setUnit(dto.getUnit());

        recipe = recipeRepository.save(recipe);
        return convertToDTO(recipe);
    }

    public List<ProductionRecipeDTO> getRecipeByReadyItemAndQuality(Long readyItemId, String quality) {
        return recipeRepository.findByReadyItemIdAndQuality(readyItemId, quality).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Map<Long, BigDecimal> calculateRequiredMaterials(Long readyItemId, String quality, BigDecimal quantity) {
        List<ProductionRecipe> recipes = recipeRepository.findByReadyItemIdAndQuality(readyItemId, quality);
        
        Map<Long, BigDecimal> requiredMaterials = new HashMap<>();
        for (ProductionRecipe recipe : recipes) {
            BigDecimal totalRequired = recipe.getQuantityRequired().multiply(quantity);
            requiredMaterials.put(recipe.getRawMaterial().getId(), totalRequired);
        }
        
        return requiredMaterials;
    }

    public List<ProductionRecipeDTO> getAllRecipesByReadyItem(Long readyItemId) {
        return recipeRepository.findByReadyItemId(readyItemId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductionRecipeDTO> getAllRecipesByRawMaterial(Long rawMaterialId) {
        return recipeRepository.findByRawMaterialId(rawMaterialId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ProductionRecipeDTO convertToDTO(ProductionRecipe recipe) {
        ProductionRecipeDTO dto = new ProductionRecipeDTO();
        dto.setId(recipe.getId());
        dto.setReadyItemId(recipe.getReadyItem().getId());
        dto.setReadyItemName(recipe.getReadyItem().getName());
        dto.setRawMaterialId(recipe.getRawMaterial().getId());
        dto.setRawMaterialName(recipe.getRawMaterial().getName());
        dto.setQuality(recipe.getQuality());
        dto.setQuantityRequired(recipe.getQuantityRequired());
        dto.setUnit(recipe.getUnit());
        return dto;
    }
}

