package com.billing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "customer_accounts", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"customer_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CustomerAccount extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false, unique = true)
    private Customer customer;

    @Column(name = "opening_balance", nullable = false)
    private BigDecimal openingBalance;

    @Column(name = "current_balance", nullable = false)
    private BigDecimal currentBalance;

    @Column(name = "total_receivable", nullable = false)
    private BigDecimal totalReceivable;

    @Column(name = "total_payable", nullable = false)
    private BigDecimal totalPayable;

    @Column(name = "total_paid", nullable = false)
    private BigDecimal totalPaid;

    @Column(name = "total_paid_out", nullable = false)
    private BigDecimal totalPaidOut;

    @Column(name = "last_transaction_date")
    private LocalDate lastTransactionDate;
}

