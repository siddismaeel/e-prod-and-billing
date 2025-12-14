package com.billing.repository;

import com.billing.entity.ProductionRecipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductionRecipeRepository extends JpaRepository<ProductionRecipe, Long> {
    List<ProductionRecipe> findByReadyItemId(Long readyItemId);
    List<ProductionRecipe> findByReadyItemIdAndQuality(Long readyItemId, String quality);
    Optional<ProductionRecipe> findByReadyItemIdAndRawMaterialIdAndQuality(Long readyItemId, Long rawMaterialId, String quality);
    List<ProductionRecipe> findByRawMaterialId(Long rawMaterialId);
}

