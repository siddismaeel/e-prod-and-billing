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
public class CustomerDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Contact is required")
    private String contact;

    private String address;

    private Long organizationId;

    private Long companyId;

    @PositiveOrZero(message = "Opening debit balance must be positive or zero")
    private BigDecimal openingDebitBalance;

    @PositiveOrZero(message = "Opening credit balance must be positive or zero")
    private BigDecimal openingCreditBalance;
}



