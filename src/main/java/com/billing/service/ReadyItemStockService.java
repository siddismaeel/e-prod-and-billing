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
        ReadyItem readyItem = readyItemRepository.findById(readyItemId)
                .orElseThrow(() -> new RuntimeException("Ready item not found with id: " + readyItemId));

        ReadyItemStock stock = stockRepository.findByReadyItemIdAndStockDate(readyItemId, date)
                .orElse(new ReadyItemStock());

        stock.setReadyItem(readyItem);
        stock.setStockDate(date);
        stock.setOpeningStock(openingStock);
        stock.setQuantityProduced(quantityProduced);
        stock.setQuantitySold(quantitySold);
        stock.setClosingStock(calculateClosingStock(openingStock, quantityProduced, quantitySold));
        stock.setUnit(readyItem.getUnit());

        stock = stockRepository.save(stock);
        return convertToDTO(stock);
    }

    public BigDecimal getCurrentStock(Long readyItemId) {
        return stockRepository.findFirstByReadyItemIdOrderByStockDateDesc(readyItemId)
                .map(ReadyItemStock::getClosingStock)
                .orElse(BigDecimal.ZERO);
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

    private BigDecimal calculateClosingStock(BigDecimal openingStock, BigDecimal quantityProduced, BigDecimal quantitySold) {
        return openingStock.add(quantityProduced).subtract(quantitySold);
    }

    private ReadyItemStockDTO convertToDTO(ReadyItemStock stock) {
        ReadyItemStockDTO dto = new ReadyItemStockDTO();
        dto.setId(stock.getId());
        dto.setReadyItemId(stock.getReadyItem().getId());
        dto.setStockDate(stock.getStockDate());
        dto.setOpeningStock(stock.getOpeningStock());
        dto.setClosingStock(stock.getClosingStock());
        dto.setQuantityProduced(stock.getQuantityProduced());
        dto.setQuantitySold(stock.getQuantitySold());
        dto.setUnit(stock.getUnit());
        dto.setRemarks(stock.getRemarks());
        return dto;
    }
}
