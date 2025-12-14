package com.billing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "production_recipes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"ready_item_id", "raw_material_id", "quality"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ProductionRecipe extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ready_item_id", nullable = false)
    private ReadyItem readyItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raw_material_id", nullable = false)
    private RawMaterial rawMaterial;

    @Column(nullable = false)
    private String quality;

    @Column(name = "quantity_required", nullable = false)
    private BigDecimal quantityRequired;

    @Column(nullable = false)
    private String unit;
}

