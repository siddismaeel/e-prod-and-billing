package com.billing.controller;

import com.billing.dto.PaymentTransactionDTO;
import com.billing.service.PaymentTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentTransactionController {

    private final PaymentTransactionService paymentTransactionService;

    @PostMapping
    public ResponseEntity<PaymentTransactionDTO> recordPayment(@Valid @RequestBody PaymentTransactionDTO dto) {
        PaymentTransactionDTO saved = paymentTransactionService.recordPayment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentTransactionDTO> updatePayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentTransactionDTO dto) {
        PaymentTransactionDTO updated = paymentTransactionService.updatePayment(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentTransactionService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<PaymentTransactionDTO>> getPaymentsByCustomer(@PathVariable Long customerId) {
        List<PaymentTransactionDTO> payments = paymentTransactionService.getPaymentHistory(customerId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<PaymentTransactionDTO>> getPaymentsByOrder(
            @PathVariable Long orderId,
            @RequestParam String orderType) {
        List<PaymentTransactionDTO> payments = paymentTransactionService.getPaymentsByOrder(orderId, orderType);
        return ResponseEntity.ok(payments);
    }
}

