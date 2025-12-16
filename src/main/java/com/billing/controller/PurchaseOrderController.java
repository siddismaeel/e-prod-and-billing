package com.billing.controller;

import com.billing.dto.PurchaseOrderDTO;
import com.billing.service.PurchaseOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @PostMapping
    public ResponseEntity<PurchaseOrderDTO> upsertPurchaseOrder(@Valid @RequestBody PurchaseOrderDTO dto) {
        PurchaseOrderDTO savedDto = purchaseOrderService.upsertPurchaseOrder(dto);
        HttpStatus status = (dto.getId() == null) ? HttpStatus.CREATED : HttpStatus.OK;
        return ResponseEntity.status(status).body(savedDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderDTO> getPurchaseOrder(@PathVariable Long id) {
        PurchaseOrderDTO dto = purchaseOrderService.getPurchaseOrder(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<PurchaseOrderDTO>> getAllPurchaseOrders() {
        List<PurchaseOrderDTO> orders = purchaseOrderService.getAllPurchaseOrders();
        return ResponseEntity.ok(orders);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchaseOrder(@PathVariable Long id) {
        purchaseOrderService.deletePurchaseOrder(id);
        return ResponseEntity.noContent().build();
    }
}

