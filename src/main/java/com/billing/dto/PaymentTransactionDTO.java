package com.billing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTransactionDTO {

    private Long id;

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    private Long customerAccountId;

    @NotBlank(message = "Transaction type is required")
    private String transactionType; // "SALES_PAYMENT", "PURCHASE_PAYMENT", "ADJUSTMENT"

    @NotNull(message = "Amount is required")
    @Min(value = 0, message = "Amount must be positive or zero")
    private BigDecimal amount;

    @NotNull(message = "Transaction date is required")
    private LocalDate transactionDate;

    private String paymentMode; // "CASH", "CHEQUE", "BANK_TRANSFER", "OTHER"

    private String referenceNumber;

    private Long salesOrderId;

    private Long purchaseOrderId;

    private Long cashId;

    private String remarks;
}



