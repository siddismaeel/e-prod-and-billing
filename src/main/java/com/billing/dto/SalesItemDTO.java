package com.billing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesItemDTO {

    private Long id;

    private Long salesOrderId;

    @NotNull(message = "Ready Item ID is required")
    private Long readyItemId;

    @NotBlank(message = "Quality is required")
    private String quality;

    @NotNull(message = "Goods Type ID is required")
    private Long goodsTypeId;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity must be positive or zero")
    private BigDecimal quantity;

    @NotNull(message = "Unit price is required")
    @Min(value = 0, message = "Unit price must be positive or zero")
    private BigDecimal unitPrice;

    @NotNull(message = "Total price is required")
    @Min(value = 0, message = "Total price must be positive or zero")
    private BigDecimal totalPrice;

    @NotNull(message = "Rate is required")
    @Min(value = 0, message = "Rate must be positive or zero")
    private BigDecimal rate;

    @NotNull(message = "Report is required")
    @Min(value = 0, message = "Report must be positive or zero")
    private BigDecimal report;

    private String remarks;
}



