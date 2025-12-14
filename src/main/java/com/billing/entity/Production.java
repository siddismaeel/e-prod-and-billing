package com.billing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "productions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Production extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ready_item_id", nullable = false)
    private ReadyItem readyItem;

    @Column(nullable = false)
    private String quality;

    @Column(name = "quantity_produced", nullable = false)
    private BigDecimal quantityProduced;

    @Column(name = "production_date", nullable = false)
    private LocalDate productionDate;

    @Column(name = "batch_number")
    private String batchNumber;

    private String remarks;
}

