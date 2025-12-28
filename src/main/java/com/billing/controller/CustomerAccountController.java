package com.billing.controller;

import com.billing.dto.AccountStatementDTO;
import com.billing.dto.CustomerAccountDTO;
import com.billing.dto.PaymentTransactionDTO;
import com.billing.service.CustomerAccountService;
import com.billing.service.PaymentTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/customer-accounts")
@RequiredArgsConstructor
public class CustomerAccountController {

    private final CustomerAccountService customerAccountService;
    private final PaymentTransactionService paymentTransactionService;

    @GetMapping("/{customerId}")
    public ResponseEntity<CustomerAccountDTO> getAccount(@PathVariable Long customerId) {
        CustomerAccountDTO account = customerAccountService.getAccount(customerId);
        return ResponseEntity.ok(account);
    }

    @GetMapping("/{customerId}/statement")
    public ResponseEntity<AccountStatementDTO> getAccountStatement(
            @PathVariable Long customerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        // Default to last 30 days if not provided
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        
        AccountStatementDTO statement = customerAccountService.getAccountStatement(customerId, startDate, endDate);
        return ResponseEntity.ok(statement);
    }

    @PostMapping("/{customerId}/recalculate")
    public ResponseEntity<CustomerAccountDTO> recalculateBalance(@PathVariable Long customerId) {
        CustomerAccountDTO account = customerAccountService.recalculateBalance(customerId);
        return ResponseEntity.ok(account);
    }

    @GetMapping("/{customerId}/transactions")
    public ResponseEntity<List<PaymentTransactionDTO>> getPaymentHistory(@PathVariable Long customerId) {
        List<PaymentTransactionDTO> transactions = paymentTransactionService.getPaymentHistory(customerId);
        return ResponseEntity.ok(transactions);
    }
}



