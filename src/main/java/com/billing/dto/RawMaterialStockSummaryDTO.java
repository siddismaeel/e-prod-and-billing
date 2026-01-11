package com.billing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RawMaterialStockSummaryDTO {

    private Long rawMaterialId;
    private String rawMaterialName;
    private BigDecimal currentStock;
    private String unit;
}

