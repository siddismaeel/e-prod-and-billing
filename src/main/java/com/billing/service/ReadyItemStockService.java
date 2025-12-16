package com.billing.service;

import com.billing.dto.ReadyItemStockDTO;
import com.billing.entity.ReadyItem;
import com.billing.entity.ReadyItemStock;
import com.billing.repository.ReadyItemRepository;
import com.billing.repository.ReadyItemStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReadyItemStockService {

    private final ReadyItemStockRepository stockRepository;
    private final ReadyItemRepository readyItemRepository;

    @Transactional
    public ReadyItemStockDTO recordDailyStock(Long readyItemId, LocalDate date, BigDecimal openingStock,
                                              BigDecimal quantityProduced, BigDecimal quantitySold) {
        return recordDailyStock(readyItemId, date, null, openingStock, quantityProduced, quantitySold);
    }

    @Transactional
    public ReadyItemStockDTO recordDailyStock(Long readyItemId, LocalDate date, String quality,
                                              BigDecimal openingStock, BigDecimal quantityProduced, BigDecimal quantitySold) {
        ReadyItem readyItem = readyItemRepository.findById(readyItemId)
                .orElseThrow(() -> new RuntimeException("Ready item not found with id: " + readyItemId));

        ReadyItemStock stock;
        if (quality != null) {
            stock = stockRepository.findByReadyItemIdAndStockDateAndQuality(readyItemId, date, quality)
                    .orElse(new ReadyItemStock());
        } else {
            stock = stockRepository.findByReadyItemIdAndStockDate(readyItemId, date)
                    .orElse(new ReadyItemStock());
        }

        stock.setReadyItem(readyItem);
        stock.setStockDate(date);
        if (quality != null) {
            stock.setQuality(quality);
        }
        stock.setOpeningStock(openingStock);
        stock.setQuantityProduced(quantityProduced);
        stock.setQuantitySold(quantitySold);
        stock.setClosingStock(calculateClosingStock(openingStock, quantityProduced, quantitySold));
        stock.setUnit(readyItem.getUnit());

        stock = stockRepository.save(stock);
        return convertToDTO(stock);
    }

    public BigDecimal getCurrentStock(Long readyItemId) {
        return getCurrentStock(readyItemId, null);
    }

    public BigDecimal getCurrentStock(Long readyItemId, String quality) {
        if (quality != null) {
            return stockRepository.findFirstByReadyItemIdAndQualityOrderByStockDateDesc(readyItemId, quality)
                    .map(ReadyItemStock::getClosingStock)
                    .orElse(BigDecimal.ZERO);
        } else {
            return stockRepository.findFirstByReadyItemIdOrderByStockDateDesc(readyItemId)
                    .map(ReadyItemStock::getClosingStock)
                    .orElse(BigDecimal.ZERO);
        }
    }

    public ReadyItemStockDTO getStockByDate(Long readyItemId, LocalDate date) {
        ReadyItemStock stock = stockRepository.findByReadyItemIdAndStockDate(readyItemId, date)
                .orElseThrow(() -> new RuntimeException("Stock not found for ready item " + readyItemId + " on date " + date));
        return convertToDTO(stock);
    }

    public List<ReadyItemStockDTO> getStockHistory(Long readyItemId, LocalDate startDate, LocalDate endDate) {
        return stockRepository.findByReadyItemIdAndStockDateBetween(readyItemId, startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deductStock(Long readyItemId, String quality, BigDecimal quantity, LocalDate date) {
        if (quantity.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        BigDecimal currentStock = getCurrentStock(readyItemId, quality);
        if (currentStock.compareTo(quantity) < 0) {
            ReadyItem readyItem = readyItemRepository.findById(readyItemId)
                    .orElseThrow(() -> new RuntimeException("Ready item not found with id: " + readyItemId));
            throw new RuntimeException("Insufficient stock for ReadyItem " + readyItem.getName() +
                    ", Quality " + quality + ". Required: " + quantity + ", Available: " + currentStock);
        }

        ReadyItem readyItem = readyItemRepository.findById(readyItemId)
                .orElseThrow(() -> new RuntimeException("Ready item not found with id: " + readyItemId));

        ReadyItemStock stock = stockRepository.findByReadyItemIdAndStockDateAndQuality(readyItemId, date, quality)
                .orElse(new ReadyItemStock());

        if (stock.getId() == null) {
            // New stock record for this date/quality
            stock.setReadyItem(readyItem);
            stock.setStockDate(date);
            stock.setQuality(quality);
            stock.setOpeningStock(currentStock);
            stock.setQuantityProduced(BigDecimal.ZERO);
            stock.setQuantitySold(quantity);
            stock.setUnit(readyItem.getUnit());
        } else {
            // Update existing stock record
            stock.setQuantitySold(stock.getQuantitySold().add(quantity));
        }

        stock.setClosingStock(calculateClosingStock(stock.getOpeningStock(), stock.getQuantityProduced(), stock.getQuantitySold()));
        stockRepository.save(stock);
    }

    @Transactional
    public void addStock(Long readyItemId, String quality, BigDecimal quantity, LocalDate date) {
        if (quantity.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        ReadyItem readyItem = readyItemRepository.findById(readyItemId)
                .orElseThrow(() -> new RuntimeException("Ready item not found with id: " + readyItemId));

        ReadyItemStock stock = stockRepository.findByReadyItemIdAndStockDateAndQuality(readyItemId, date, quality)
                .orElse(new ReadyItemStock());

        if (stock.getId() == null) {
            // If no stock record exists for this date, get the latest stock as opening
            BigDecimal currentStock = getCurrentStock(readyItemId, quality);
            stock.setReadyItem(readyItem);
            stock.setStockDate(date);
            stock.setQuality(quality);
            stock.setOpeningStock(currentStock);
            stock.setQuantityProduced(BigDecimal.ZERO);
            // For reversal, reduce quantitySold (negative means we're returning stock)
            stock.setQuantitySold(quantity.negate());
            stock.setUnit(readyItem.getUnit());
        } else {
            // Update existing stock record - reduce quantity sold
            stock.setQuantitySold(stock.getQuantitySold().subtract(quantity));
        }

        stock.setClosingStock(calculateClosingStock(stock.getOpeningStock(), stock.getQuantityProduced(), stock.getQuantitySold()));
        stockRepository.save(stock);
    }

    private BigDecimal calculateClosingStock(BigDecimal openingStock, BigDecimal quantityProduced, BigDecimal quantitySold) {
        return openingStock.add(quantityProduced).subtract(quantitySold);
    }

    private ReadyItemStockDTO convertToDTO(ReadyItemStock stock) {
        ReadyItemStockDTO dto = new ReadyItemStockDTO();
        dto.setId(stock.getId());
        dto.setReadyItemId(stock.getReadyItem().getId());
        dto.setStockDate(stock.getStockDate());
        dto.setQuality(stock.getQuality());
        dto.setOpeningStock(stock.getOpeningStock());
        dto.setClosingStock(stock.getClosingStock());
        dto.setQuantityProduced(stock.getQuantityProduced());
        dto.setQuantitySold(stock.getQuantitySold());
        dto.setUnit(stock.getUnit());
        dto.setRemarks(stock.getRemarks());
        return dto;
    }
}
