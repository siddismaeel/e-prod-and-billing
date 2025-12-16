package com.billing.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReadyItemStockDTO {

    private Long id;

    @NotNull(message = "Ready item ID is required")
    private Long readyItemId;

    @NotNull(message = "Stock date is required")
    private LocalDate stockDate;

    private String quality; // Nullable for backward compatibility

    @NotNull(message = "Opening stock is required")
    @PositiveOrZero(message = "Opening stock must be positive or zero")
    private BigDecimal openingStock;

    @NotNull(message = "Closing stock is required")
    @PositiveOrZero(message = "Closing stock must be positive or zero")
    private BigDecimal closingStock;

    @NotNull(message = "Quantity produced is required")
    @PositiveOrZero(message = "Quantity produced must be positive or zero")
    private BigDecimal quantityProduced;

    @NotNull(message = "Quantity sold is required")
    @PositiveOrZero(message = "Quantity sold must be positive or zero")
    private BigDecimal quantitySold;

    @NotNull(message = "Unit is required")
    private String unit;

    private String remarks;
}

