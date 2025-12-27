package com.billing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ready_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ReadyItem extends BaseModel {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String unit;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goods_type_id")
    private GoodsType goodsType;

    @Column(name = "quality_impact")
    private String qualityImpact; // Values: "NORMAL", "HIGH", "LOW", "NONE"

    @Column(name = "cost_impact")
    private String costImpact; // Values: "NORMAL", "HIGH", "LOW", "NONE"

    @Column(name = "extra_quantity_used")
    private BigDecimal extraQuantityUsed;

    @Column(name = "less_quantity_used")
    private BigDecimal lessQuantityUsed;

    @Column(name = "percentage_deviation")
    private BigDecimal percentageDeviation;

    @Column(name = "last_proposition_check")
    private LocalDateTime lastPropositionCheck;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;
}


