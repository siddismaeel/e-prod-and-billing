package com.billing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatementLineItemDTO {

    private LocalDate date;
    private String type; // "SALES_ORDER", "PURCHASE_ORDER", "PAYMENT", "ADJUSTMENT"
    private String description;
    private BigDecimal debit; // Sales orders, payments received
    private BigDecimal credit; // Purchase orders, payments made
    private BigDecimal balance; // Running balance
    private Long referenceId; // Order ID or Payment ID
    private String referenceNumber; // Order number or payment reference
}

