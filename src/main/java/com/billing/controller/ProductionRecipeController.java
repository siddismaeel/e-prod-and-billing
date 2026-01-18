package com.billing.controller;

import com.billing.dto.ProductionRecipeDTO;
import com.billing.service.ProductionRecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/production-recipes")
@RequiredArgsConstructor
public class ProductionRecipeController {

    private final ProductionRecipeService recipeService;

    @PostMapping
    public ResponseEntity<ProductionRecipeDTO> upsertRecipe(@Valid @RequestBody ProductionRecipeDTO dto) {
        boolean isUpdate = dto.getId() != null;
        ProductionRecipeDTO saved = recipeService.upsertRecipe(dto);
        HttpStatus status = isUpdate ? HttpStatus.OK : HttpStatus.CREATED;
        return ResponseEntity.status(status).body(saved);
    }

    @GetMapping("/ready-item/{readyItemId}")
    public ResponseEntity<List<ProductionRecipeDTO>> getRecipesByReadyItem(@PathVariable Long readyItemId) {
        return ResponseEntity.ok(recipeService.getAllRecipesByReadyItem(readyItemId));
    }

    @GetMapping("/raw-material/{rawMaterialId}")
    public ResponseEntity<List<ProductionRecipeDTO>> getRecipesByRawMaterial(@PathVariable Long rawMaterialId) {
        return ResponseEntity.ok(recipeService.getAllRecipesByRawMaterial(rawMaterialId));
    }

    @GetMapping("/ready-item/{readyItemId}/quality/{quality}")
    public ResponseEntity<List<ProductionRecipeDTO>> getRecipesByQuality(
            @PathVariable Long readyItemId,
            @PathVariable String quality) {
        return ResponseEntity.ok(recipeService.getRecipeByReadyItemAndQuality(readyItemId, quality));
    }

    @GetMapping("/ready-item/{readyItemId}/quality/{quality}/calculate")
    public ResponseEntity<Map<Long, java.math.BigDecimal>> calculateRequiredMaterials(
            @PathVariable Long readyItemId,
            @PathVariable String quality,
            @RequestParam java.math.BigDecimal quantity) {
        return ResponseEntity.ok(recipeService.calculateRequiredMaterials(readyItemId, quality, quantity));
    }
}

