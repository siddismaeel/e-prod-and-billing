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
public class RawMaterialStockDTO {

    private Long id;

    @NotNull(message = "Raw material ID is required")
    private Long rawMaterialId;

    @NotNull(message = "Stock date is required")
    private LocalDate stockDate;

    @NotNull(message = "Opening stock is required")
    @PositiveOrZero(message = "Opening stock must be positive or zero")
    private BigDecimal openingStock;

    @NotNull(message = "Closing stock is required")
    @PositiveOrZero(message = "Closing stock must be positive or zero")
    private BigDecimal closingStock;

    @NotNull(message = "Quantity added is required")
    @PositiveOrZero(message = "Quantity added must be positive or zero")
    private BigDecimal quantityAdded;

    @NotNull(message = "Quantity consumed is required")
    @PositiveOrZero(message = "Quantity consumed must be positive or zero")
    private BigDecimal quantityConsumed;

    @NotNull(message = "Unit is required")
    private String unit;

    private String remarks;
}

