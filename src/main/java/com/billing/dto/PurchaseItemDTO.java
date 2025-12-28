package com.billing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseItemDTO {

    private Long id;

    private Long purchaseOrderId;

    @NotNull(message = "Raw Material ID is required")
    private Long rawMaterialId;

    @NotNull(message = "Goods Type ID is required")
    private Long goodsTypeId;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity must be positive or zero")
    private BigDecimal quantity;

    private BigDecimal netQuantity; // Used for stock if available, otherwise quantity is used

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

    private BigDecimal fringeCost;
}



