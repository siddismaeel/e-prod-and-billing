package com.billing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "raw_material_stocks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RawMaterialStock extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raw_material_id", nullable = false)
    private RawMaterial rawMaterial;

    @Column(name = "stock_date", nullable = false)
    private LocalDate stockDate;

    @Column(name = "opening_stock", nullable = false)
    private BigDecimal openingStock;

    @Column(name = "closing_stock", nullable = false)
    private BigDecimal closingStock;

    @Column(name = "quantity_added", nullable = false)
    private BigDecimal quantityAdded;

    @Column(name = "quantity_consumed", nullable = false)
    private BigDecimal quantityConsumed;

    @Column(nullable = false)
    private String unit;

    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;
}

