package com.billing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "ready_item_stocks", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"ready_item_id", "stock_date", "quality"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ReadyItemStock extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ready_item_id", nullable = false)
    private ReadyItem readyItem;

    @Column(name = "stock_date", nullable = false)
    private LocalDate stockDate;

    @Column(nullable = false)
    private String quality;

    @Column(name = "opening_stock", nullable = false)
    private BigDecimal openingStock;

    @Column(name = "closing_stock", nullable = false)
    private BigDecimal closingStock;

    @Column(name = "quantity_produced", nullable = false)
    private BigDecimal quantityProduced;

    @Column(name = "quantity_sold", nullable = false)
    private BigDecimal quantitySold;

    @Column(nullable = false)
    private String unit;

    private String remarks;
}

