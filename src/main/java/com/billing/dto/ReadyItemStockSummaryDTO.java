package com.billing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReadyItemStockSummaryDTO {

    private Long readyItemId;
    private String readyItemName;
    private BigDecimal currentStock;
    private String unit;
}

