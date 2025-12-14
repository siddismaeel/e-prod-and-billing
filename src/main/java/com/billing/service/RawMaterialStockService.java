package com.billing.service;

import com.billing.dto.RawMaterialStockDTO;
import com.billing.dto.StockAdjustmentDTO;
import com.billing.entity.RawMaterial;
import com.billing.entity.RawMaterialStock;
import com.billing.repository.RawMaterialRepository;
import com.billing.repository.RawMaterialStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RawMaterialStockService {

    private final RawMaterialStockRepository stockRepository;
    private final RawMaterialRepository rawMaterialRepository;

    @Transactional
    public RawMaterialStockDTO recordDailyStock(Long rawMaterialId, LocalDate date, BigDecimal openingStock, 
                                                BigDecimal quantityAdded, BigDecimal quantityConsumed) {
        RawMaterial rawMaterial = rawMaterialRepository.findById(rawMaterialId)
                .orElseThrow(() -> new RuntimeException("Raw material not found with id: " + rawMaterialId));

        RawMaterialStock stock = stockRepository.findByRawMaterialIdAndStockDate(rawMaterialId, date)
                .orElse(new RawMaterialStock());

        stock.setRawMaterial(rawMaterial);
        stock.setStockDate(date);
        stock.setOpeningStock(openingStock);
        stock.setQuantityAdded(quantityAdded);
        stock.setQuantityConsumed(quantityConsumed);
        stock.setClosingStock(calculateClosingStock(openingStock, quantityAdded, quantityConsumed));
        stock.setUnit(rawMaterial.getUnit());

        stock = stockRepository.save(stock);
        return convertToDTO(stock);
    }

    public BigDecimal getCurrentStock(Long rawMaterialId) {
        return stockRepository.findFirstByRawMaterialIdOrderByStockDateDesc(rawMaterialId)
                .map(RawMaterialStock::getClosingStock)
                .orElse(BigDecimal.ZERO);
    }

    public RawMaterialStockDTO getStockByDate(Long rawMaterialId, LocalDate date) {
        RawMaterialStock stock = stockRepository.findByRawMaterialIdAndStockDate(rawMaterialId, date)
                .orElseThrow(() -> new RuntimeException("Stock not found for raw material " + rawMaterialId + " on date " + date));
        return convertToDTO(stock);
    }

    public List<RawMaterialStockDTO> getStockHistory(Long rawMaterialId, LocalDate startDate, LocalDate endDate) {
        return stockRepository.findByRawMaterialIdAndStockDateBetween(rawMaterialId, startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public RawMaterialStockDTO adjustStock(Long rawMaterialId, StockAdjustmentDTO adjustment) {
        LocalDate date = adjustment.getDate();
        BigDecimal currentStock = getCurrentStock(rawMaterialId);
        
        BigDecimal openingStock = currentStock;
        BigDecimal quantityAdded = BigDecimal.ZERO;
        BigDecimal quantityConsumed = BigDecimal.ZERO;

        if ("ADD".equalsIgnoreCase(adjustment.getOperation())) {
            quantityAdded = adjustment.getQuantity();
        } else if ("SUBTRACT".equalsIgnoreCase(adjustment.getOperation())) {
            quantityConsumed = adjustment.getQuantity();
        } else {
            throw new RuntimeException("Invalid operation: " + adjustment.getOperation() + ". Use ADD or SUBTRACT");
        }

        return recordDailyStock(rawMaterialId, date, openingStock, quantityAdded, quantityConsumed);
    }

    @Transactional
    public void updateStockFromPurchaseOrder(Long purchaseOrderId) {
        // This will be implemented when PurchaseOrder integration is added
        // For now, it's a placeholder
    }

    private BigDecimal calculateClosingStock(BigDecimal openingStock, BigDecimal quantityAdded, BigDecimal quantityConsumed) {
        return openingStock.add(quantityAdded).subtract(quantityConsumed);
    }

    private RawMaterialStockDTO convertToDTO(RawMaterialStock stock) {
        RawMaterialStockDTO dto = new RawMaterialStockDTO();
        dto.setId(stock.getId());
        dto.setRawMaterialId(stock.getRawMaterial().getId());
        dto.setStockDate(stock.getStockDate());
        dto.setOpeningStock(stock.getOpeningStock());
        dto.setClosingStock(stock.getClosingStock());
        dto.setQuantityAdded(stock.getQuantityAdded());
        dto.setQuantityConsumed(stock.getQuantityConsumed());
        dto.setUnit(stock.getUnit());
        dto.setRemarks(stock.getRemarks());
        return dto;
    }
}

