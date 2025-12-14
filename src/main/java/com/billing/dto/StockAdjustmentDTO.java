package com.billing.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockAdjustmentDTO {

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Quantity is required")
    private BigDecimal quantity;

    @NotNull(message = "Operation is required")
    private String operation; // ADD or SUBTRACT

    private String remarks;
}

