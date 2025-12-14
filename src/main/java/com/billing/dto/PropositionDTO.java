package com.billing.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropositionDTO {

    private Long id;

    @NotNull(message = "Ready item ID is required")
    private Long readyItemId;

    @NotNull(message = "Raw material ID is required")
    private Long rawMaterialId;

    @NotNull(message = "Expected percentage is required")
    @PositiveOrZero(message = "Expected percentage must be positive or zero")
    private BigDecimal expectedPercentage;
}

