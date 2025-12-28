package com.billing.controller;

import com.billing.dto.SalesOrderDTO;
import com.billing.service.SalesOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales-orders")
@RequiredArgsConstructor
public class SalesOrderController {

    private final SalesOrderService salesOrderService;

    @PostMapping
    public ResponseEntity<SalesOrderDTO> upsertSalesOrder(@Valid @RequestBody SalesOrderDTO dto) {
        SalesOrderDTO savedDto = salesOrderService.upsertSalesOrder(dto);
        HttpStatus status = (dto.getId() == null) ? HttpStatus.CREATED : HttpStatus.OK;
        return ResponseEntity.status(status).body(savedDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalesOrderDTO> getSalesOrder(@PathVariable Long id) {
        SalesOrderDTO dto = salesOrderService.getSalesOrder(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<SalesOrderDTO>> getAllSalesOrders() {
        List<SalesOrderDTO> orders = salesOrderService.getAllSalesOrders();
        return ResponseEntity.ok(orders);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSalesOrder(@PathVariable Long id) {
        salesOrderService.deleteSalesOrder(id);
        return ResponseEntity.noContent().build();
    }
}



