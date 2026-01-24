package com.billing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RawMaterialDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Unit is required")
    private String unit;

    private String description;

    private Long goodsTypeId;

    @PositiveOrZero(message = "Opening stock must be positive or zero")
    private BigDecimal openingStock;
}

