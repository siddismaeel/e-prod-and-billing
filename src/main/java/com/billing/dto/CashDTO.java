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
public class CashDTO {

    private Long id;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Debit is required")
    @PositiveOrZero(message = "Debit must be positive or zero")
    private BigDecimal debit;

    @NotNull(message = "Credit is required")
    @PositiveOrZero(message = "Credit must be positive or zero")
    private BigDecimal credit;

    @NotNull(message = "Balance is required")
    private BigDecimal balance;

    private String transactionType; // "CUSTOMER_PAYMENT", "CUSTOMER_RECEIPT", "OTHER"

    private Long customerId;

    private Long paymentTransactionId;

    private String remarks;
}



