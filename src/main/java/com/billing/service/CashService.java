package com.billing.service;

import com.billing.dto.CashDTO;
import com.billing.entity.Cash;
import com.billing.entity.PaymentTransaction;
import com.billing.repository.CashRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CashService {

    private final CashRepository cashRepository;

    @Transactional
    public Cash createCashFromPayment(PaymentTransaction payment) {
        Cash cash = new Cash();
        cash.setDate(payment.getTransactionDate());
        cash.setPaymentTransaction(payment);
        cash.setCustomer(payment.getCustomer());

        // Determine cashflow direction
        if ("SALES_PAYMENT".equals(payment.getTransactionType())) {
            // Customer pays us - money in (DEBIT)
            cash.setDebit(payment.getAmount());
            cash.setCredit(BigDecimal.ZERO);
            cash.setTransactionType("CUSTOMER_PAYMENT");
        } else if ("PURCHASE_PAYMENT".equals(payment.getTransactionType())) {
            // We pay customer - money out (CREDIT)
            cash.setDebit(BigDecimal.ZERO);
            cash.setCredit(payment.getAmount());
            cash.setTransactionType("CUSTOMER_RECEIPT");
        } else {
            // Adjustment
            cash.setDebit(BigDecimal.ZERO);
            cash.setCredit(BigDecimal.ZERO);
            cash.setTransactionType("OTHER");
        }

        // Calculate balance
        BigDecimal previousBalance = getLastBalanceBeforeDate(payment.getTransactionDate());
        cash.setBalance(previousBalance.add(cash.getDebit()).subtract(cash.getCredit()));
        cash.setRemarks("Payment: " + payment.getRemarks());

        return cashRepository.save(cash);
    }

    @Transactional
    public Cash updateCashFromPayment(PaymentTransaction payment) {
        Cash cash = payment.getCash();
        if (cash == null) {
            return createCashFromPayment(payment);
        }

        // Update amounts
        if ("SALES_PAYMENT".equals(payment.getTransactionType())) {
            cash.setDebit(payment.getAmount());
            cash.setCredit(BigDecimal.ZERO);
            cash.setTransactionType("CUSTOMER_PAYMENT");
        } else if ("PURCHASE_PAYMENT".equals(payment.getTransactionType())) {
            cash.setDebit(BigDecimal.ZERO);
            cash.setCredit(payment.getAmount());
            cash.setTransactionType("CUSTOMER_RECEIPT");
        }

        // Recalculate balance
        BigDecimal previousBalance = getLastBalanceBeforeDate(payment.getTransactionDate());
        cash.setBalance(previousBalance.add(cash.getDebit()).subtract(cash.getCredit()));
        cash.setRemarks("Payment: " + payment.getRemarks());

        return cashRepository.save(cash);
    }

    @Transactional
    public CashDTO recordCashEntry(CashDTO dto) {
        Cash cash = new Cash();
        cash.setDate(dto.getDate());
        cash.setDebit(dto.getDebit());
        cash.setCredit(dto.getCredit());
        cash.setTransactionType(dto.getTransactionType());
        cash.setRemarks(dto.getRemarks());

        // Calculate balance
        BigDecimal previousBalance = getLastBalanceBeforeDate(dto.getDate());
        cash.setBalance(previousBalance.add(dto.getDebit()).subtract(dto.getCredit()));

        cash = cashRepository.save(cash);
        return convertToDTO(cash);
    }

    public List<CashDTO> getCashFlow(LocalDate startDate, LocalDate endDate) {
        return cashRepository.findByDateBetween(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCashEntry(Long id) {
        cashRepository.deleteById(id);
    }

    private BigDecimal getLastBalanceBeforeDate(LocalDate date) {
        return cashRepository.findAllByOrderByDateDesc().stream()
                .filter(c -> c.getDate().isBefore(date) || c.getDate().equals(date))
                .findFirst()
                .map(Cash::getBalance)
                .orElse(BigDecimal.ZERO);
    }

    private CashDTO convertToDTO(Cash cash) {
        CashDTO dto = new CashDTO();
        dto.setId(cash.getId());
        dto.setDate(cash.getDate());
        dto.setDebit(cash.getDebit());
        dto.setCredit(cash.getCredit());
        dto.setBalance(cash.getBalance());
        dto.setTransactionType(cash.getTransactionType());
        dto.setCustomerId(cash.getCustomer() != null ? cash.getCustomer().getId() : null);
        dto.setPaymentTransactionId(cash.getPaymentTransaction() != null ? cash.getPaymentTransaction().getId() : null);
        dto.setRemarks(cash.getRemarks());
        return dto;
    }
}

