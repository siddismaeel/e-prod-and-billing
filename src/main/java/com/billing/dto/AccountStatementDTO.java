package com.billing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountStatementDTO {

    private Long customerId;
    private String customerName;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal openingBalance;
    private BigDecimal closingBalance;
    
    // Summary
    private BigDecimal totalSales;
    private BigDecimal totalPurchases;
    private BigDecimal totalPaymentsReceived;
    private BigDecimal totalPaymentsMade;
    
    // Transaction details
    private List<StatementLineItemDTO> transactions;
}



