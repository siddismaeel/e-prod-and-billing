package com.billing.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialConsumptionDTO {

    private Long id;

    @NotNull(message = "Raw material ID is required")
    private Long rawMaterialId;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private BigDecimal quantity;

    @NotNull(message = "Consumption type is required")
    private String consumptionType; // PRODUCTION or MANUAL

    private Long readyItemId;

    private String quality; // Optional: for recipe creation

    private BigDecimal readyItemQuantity; // Optional: for recipe creation

    private String unit; // Optional: for recipe creation (usually from RawMaterial)

    private Long productionBatchId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private String remarks;
}

