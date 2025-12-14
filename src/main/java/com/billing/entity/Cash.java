package com.billing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cash")
@AttributeOverrides({
    @AttributeOverride(name = "createdAt", column = @Column(name = "createdAt")),
    @AttributeOverride(name = "updatedAt", column = @Column(name = "updatedAt"))
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Cash extends BaseModel {

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private BigDecimal debit;

    @Column(nullable = false)
    private BigDecimal credit;

    @Column(nullable = false)
    private BigDecimal balance;

    private String remarks;
}

