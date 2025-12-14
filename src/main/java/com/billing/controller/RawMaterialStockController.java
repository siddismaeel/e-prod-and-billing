package com.billing.controller;

import com.billing.dto.RawMaterialStockDTO;
import com.billing.dto.StockAdjustmentDTO;
import com.billing.service.RawMaterialStockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/raw-materials")
@RequiredArgsConstructor
public class RawMaterialStockController {

    private final RawMaterialStockService stockService;

    @GetMapping("/{id}/stock/current")
    public ResponseEntity<BigDecimal> getCurrentStock(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.getCurrentStock(id));
    }

    @GetMapping("/{id}/stock")
    public ResponseEntity<RawMaterialStockDTO> getStockByDate(
            @PathVariable Long id,
            @RequestParam LocalDate date) {
        return ResponseEntity.ok(stockService.getStockByDate(id, date));
    }

    @GetMapping("/{id}/stock/history")
    public ResponseEntity<List<RawMaterialStockDTO>> getStockHistory(
            @PathVariable Long id,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return ResponseEntity.ok(stockService.getStockHistory(id, startDate, endDate));
    }

    @PostMapping("/{id}/stock/adjust")
    public ResponseEntity<RawMaterialStockDTO> adjustStock(
            @PathVariable Long id,
            @Valid @RequestBody StockAdjustmentDTO adjustment) {
        return ResponseEntity.ok(stockService.adjustStock(id, adjustment));
    }
}

