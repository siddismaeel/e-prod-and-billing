package com.billing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReadyItemDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Unit is required")
    private String unit;

    private String description;

    private Long goodsTypeId;

    private String qualityImpact; // "NORMAL", "HIGH", "LOW", "NONE"

    private String costImpact; // "NORMAL", "HIGH", "LOW", "NONE"

    private BigDecimal extraQuantityUsed;

    private BigDecimal lessQuantityUsed;

    private BigDecimal percentageDeviation;

    private LocalDateTime lastPropositionCheck;
}

