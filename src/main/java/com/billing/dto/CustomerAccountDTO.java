package com.billing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerAccountDTO {

    private Long id;
    private Long customerId;
    private String customerName;
    private BigDecimal openingBalance;
    private BigDecimal currentBalance;
    private BigDecimal totalReceivable;
    private BigDecimal totalPayable;
    private BigDecimal totalPaid;
    private BigDecimal totalPaidOut;
    private LocalDate lastTransactionDate;
    
    // Convenience fields for frontend compatibility
    private BigDecimal balance;      // Maps to currentBalance
    private BigDecimal totalCredit;  // Maps to totalReceivable (money owed to you)
    private BigDecimal totalDebit;   // Maps to totalPayable (money you owe)
}



