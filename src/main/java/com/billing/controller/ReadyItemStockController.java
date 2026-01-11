package com.billing.controller;

import com.billing.dto.ReadyItemStockDTO;
import com.billing.dto.ReadyItemStockSummaryDTO;
import com.billing.service.ReadyItemStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/ready-items")
@RequiredArgsConstructor
public class ReadyItemStockController {

    private final ReadyItemStockService stockService;

    @GetMapping("/{id}/stock/current")
    public ResponseEntity<BigDecimal> getCurrentStock(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.getCurrentStock(id));
    }

    @GetMapping("/{id}/stock")
    public ResponseEntity<ReadyItemStockDTO> getStockByDate(
            @PathVariable Long id,
            @RequestParam LocalDate date) {
        return ResponseEntity.ok(stockService.getStockByDate(id, date));
    }

    @GetMapping("/{id}/stock/history")
    public ResponseEntity<List<ReadyItemStockDTO>> getStockHistory(
            @PathVariable Long id,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return ResponseEntity.ok(stockService.getStockHistory(id, startDate, endDate));
    }

    @GetMapping("/stock/all-current")
    public ResponseEntity<List<ReadyItemStockSummaryDTO>> getAllCurrentStocks() {
        return ResponseEntity.ok(stockService.getAllCurrentStocks());
    }
}

