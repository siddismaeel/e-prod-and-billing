package com.billing.dto;

import jakarta.validation.constraints.NotBlank;
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
public class ProductionDTO {

    private Long id;

    @NotNull(message = "Ready item ID is required")
    private Long readyItemId;

    private String readyItemName;

    private String unit;

    @NotBlank(message = "Quality is required")
    private String quality;

    @NotNull(message = "Quantity produced is required")
    @Positive(message = "Quantity produced must be positive")
    private BigDecimal quantityProduced;

    @NotNull(message = "Production date is required")
    private LocalDate productionDate;

    private String batchNumber;

    private String remarks;
}

