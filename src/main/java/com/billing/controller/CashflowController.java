package com.billing.controller;

import com.billing.dto.CashDTO;
import com.billing.service.CashService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/cashflow")
@RequiredArgsConstructor
public class CashflowController {

    private final CashService cashService;

    @GetMapping
    public ResponseEntity<List<CashDTO>> getCashFlow(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        // Default to last 30 days if not provided
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        
        List<CashDTO> cashFlow = cashService.getCashFlow(startDate, endDate);
        return ResponseEntity.ok(cashFlow);
    }

    @PostMapping
    public ResponseEntity<CashDTO> recordCashEntry(@Valid @RequestBody CashDTO dto) {
        CashDTO saved = cashService.recordCashEntry(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}



