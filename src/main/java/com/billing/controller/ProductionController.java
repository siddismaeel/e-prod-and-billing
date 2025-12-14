package com.billing.controller;

import com.billing.dto.ProductionDTO;
import com.billing.service.ProductionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productions")
@RequiredArgsConstructor
public class ProductionController {

    private final ProductionService productionService;

    @PostMapping
    public ResponseEntity<ProductionDTO> produceReadyItem(@Valid @RequestBody ProductionDTO dto) {
        ProductionDTO saved = productionService.produceReadyItem(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<ProductionDTO>> getAllProductions() {
        return ResponseEntity.ok(productionService.getAllProductions());
    }
}

