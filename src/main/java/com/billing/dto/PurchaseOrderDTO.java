package com.billing.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderDTO {

    private Long id;

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    private String supplierName;

    @NotNull(message = "Order date is required")
    private LocalDate orderDate;

    @NotNull(message = "Total amount is required")
    @PositiveOrZero(message = "Total amount must be positive or zero")
    private BigDecimal totalAmount;

    @NotNull(message = "Paid amount is required")
    @PositiveOrZero(message = "Paid amount must be positive or zero")
    private BigDecimal paidAmount;

    @NotNull(message = "Balance payment is required")
    @PositiveOrZero(message = "Balance payment must be positive or zero")
    private BigDecimal balancePayment;

    @NotNull(message = "Payment status is required")
    private String paymentStatus;

    private String remarks;

    @Valid
    @NotNull(message = "Purchase items are required")
    private List<PurchaseItemDTO> purchaseItems;
}



