package com.billing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductionRecipeDTO {

    private Long id;

    @NotNull(message = "Ready item ID is required")
    private Long readyItemId;

    @NotNull(message = "Raw material ID is required")
    private Long rawMaterialId;

    @NotBlank(message = "Quality is required")
    private String quality;

    @NotNull(message = "Quantity required is required")
    @Positive(message = "Quantity required must be positive")
    private BigDecimal quantityRequired;

    @NotBlank(message = "Unit is required")
    private String unit;
}

