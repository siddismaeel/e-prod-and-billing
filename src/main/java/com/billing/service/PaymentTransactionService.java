package com.billing.service;

import com.billing.dto.PaymentTransactionDTO;
import com.billing.entity.*;
import com.billing.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentTransactionService {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final CustomerRepository customerRepository;
    private final CustomerAccountService customerAccountService;
    private final SalesOrderRepository salesOrderRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final CashService cashService;

    @Transactional
    public PaymentTransactionDTO recordPayment(PaymentTransactionDTO dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + dto.getCustomerId()));

        CustomerAccount account = customerAccountService.getOrCreateAccount(dto.getCustomerId());

        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setCustomer(customer);
        transaction.setCustomerAccount(account);
        transaction.setTransactionType(dto.getTransactionType());
        transaction.setAmount(dto.getAmount());
        transaction.setTransactionDate(dto.getTransactionDate());
        transaction.setPaymentMode(dto.getPaymentMode());
        transaction.setReferenceNumber(dto.getReferenceNumber());
        transaction.setRemarks(dto.getRemarks());

        // Link to order if provided
        if (dto.getSalesOrderId() != null) {
            SalesOrder salesOrder = salesOrderRepository.findById(dto.getSalesOrderId())
                    .orElseThrow(() -> new RuntimeException("Sales order not found with id: " + dto.getSalesOrderId()));
            transaction.setSalesOrder(salesOrder);
            
            // Update order's paid amount
            BigDecimal newPaidAmount = salesOrder.getPaidAmount().add(dto.getAmount());
            salesOrder.setPaidAmount(newPaidAmount);
            salesOrder.setBalancePayment(salesOrder.getTotalAmount().subtract(newPaidAmount));
            
            // Update payment status
            if (salesOrder.getBalancePayment().compareTo(BigDecimal.ZERO) <= 0) {
                salesOrder.setPaymentStatus("PAID");
            } else {
                salesOrder.setPaymentStatus("PARTIAL");
            }
            salesOrderRepository.save(salesOrder);
        }

        if (dto.getPurchaseOrderId() != null) {
            PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(dto.getPurchaseOrderId())
                    .orElseThrow(() -> new RuntimeException("Purchase order not found with id: " + dto.getPurchaseOrderId()));
            transaction.setPurchaseOrder(purchaseOrder);
            
            // Update order's paid amount
            BigDecimal newPaidAmount = purchaseOrder.getPaidAmount().add(dto.getAmount());
            purchaseOrder.setPaidAmount(newPaidAmount);
            purchaseOrder.setBalancePayment(purchaseOrder.getTotalAmount().subtract(newPaidAmount));
            
            // Update payment status
            if (purchaseOrder.getBalancePayment().compareTo(BigDecimal.ZERO) <= 0) {
                purchaseOrder.setPaymentStatus("PAID");
            } else {
                purchaseOrder.setPaymentStatus("PARTIAL");
            }
            purchaseOrderRepository.save(purchaseOrder);
        }

        transaction = paymentTransactionRepository.save(transaction);

        // Update customer account
        customerAccountService.updateAccountFromPayment(transaction);

        // Create cash entry
        Cash cash = cashService.createCashFromPayment(transaction);
        transaction.setCash(cash);
        transaction = paymentTransactionRepository.save(transaction);

        return convertToDTO(transaction);
    }

    @Transactional
    public PaymentTransactionDTO updatePayment(Long id, PaymentTransactionDTO dto) {
        PaymentTransaction transaction = paymentTransactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment transaction not found with id: " + id));

        // Reverse old payment impact
        reversePaymentImpact(transaction);

        // Update transaction
        transaction.setTransactionType(dto.getTransactionType());
        transaction.setAmount(dto.getAmount());
        transaction.setTransactionDate(dto.getTransactionDate());
        transaction.setPaymentMode(dto.getPaymentMode());
        transaction.setReferenceNumber(dto.getReferenceNumber());
        transaction.setRemarks(dto.getRemarks());

        // Update linked orders if changed
        if (dto.getSalesOrderId() != null && (transaction.getSalesOrder() == null || !transaction.getSalesOrder().getId().equals(dto.getSalesOrderId()))) {
            SalesOrder salesOrder = salesOrderRepository.findById(dto.getSalesOrderId())
                    .orElseThrow(() -> new RuntimeException("Sales order not found"));
            transaction.setSalesOrder(salesOrder);
        }

        if (dto.getPurchaseOrderId() != null && (transaction.getPurchaseOrder() == null || !transaction.getPurchaseOrder().getId().equals(dto.getPurchaseOrderId()))) {
            PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(dto.getPurchaseOrderId())
                    .orElseThrow(() -> new RuntimeException("Purchase order not found"));
            transaction.setPurchaseOrder(purchaseOrder);
        }

        transaction = paymentTransactionRepository.save(transaction);

        // Update customer account
        customerAccountService.updateAccountFromPayment(transaction);

        // Update cash entry
        if (transaction.getCash() != null) {
            cashService.updateCashFromPayment(transaction);
        } else {
            Cash cash = cashService.createCashFromPayment(transaction);
            transaction.setCash(cash);
            transaction = paymentTransactionRepository.save(transaction);
        }

        return convertToDTO(transaction);
    }

    @Transactional
    public void deletePayment(Long id) {
        PaymentTransaction transaction = paymentTransactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment transaction not found with id: " + id));

        // Reverse payment impact
        reversePaymentImpact(transaction);

        // Delete cash entry if exists
        if (transaction.getCash() != null) {
            cashService.deleteCashEntry(transaction.getCash().getId());
        }

        paymentTransactionRepository.delete(transaction);
    }

    public List<PaymentTransactionDTO> getPaymentHistory(Long customerId) {
        return paymentTransactionRepository.findByCustomerId(customerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentTransactionDTO> getPaymentsByOrder(Long orderId, String orderType) {
        if ("SALES".equalsIgnoreCase(orderType)) {
            return paymentTransactionRepository.findBySalesOrderId(orderId).stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } else if ("PURCHASE".equalsIgnoreCase(orderType)) {
            return paymentTransactionRepository.findByPurchaseOrderId(orderId).stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        throw new RuntimeException("Invalid order type: " + orderType);
    }

    public List<PaymentTransactionDTO> getAllPayments() {
        return paymentTransactionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PaymentTransactionDTO getPaymentById(Long id) {
        PaymentTransaction transaction = paymentTransactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment transaction not found with id: " + id));
        return convertToDTO(transaction);
    }

    private void reversePaymentImpact(PaymentTransaction transaction) {
        // Reverse order paid amounts
        if (transaction.getSalesOrder() != null) {
            SalesOrder order = transaction.getSalesOrder();
            BigDecimal newPaidAmount = order.getPaidAmount().subtract(transaction.getAmount());
            order.setPaidAmount(newPaidAmount.max(BigDecimal.ZERO));
            order.setBalancePayment(order.getTotalAmount().subtract(order.getPaidAmount()));
            if (order.getBalancePayment().compareTo(BigDecimal.ZERO) > 0) {
                order.setPaymentStatus("PARTIAL");
            } else {
                order.setPaymentStatus("UNPAID");
            }
            salesOrderRepository.save(order);
        }

        if (transaction.getPurchaseOrder() != null) {
            PurchaseOrder order = transaction.getPurchaseOrder();
            BigDecimal newPaidAmount = order.getPaidAmount().subtract(transaction.getAmount());
            order.setPaidAmount(newPaidAmount.max(BigDecimal.ZERO));
            order.setBalancePayment(order.getTotalAmount().subtract(order.getPaidAmount()));
            if (order.getBalancePayment().compareTo(BigDecimal.ZERO) > 0) {
                order.setPaymentStatus("PARTIAL");
            } else {
                order.setPaymentStatus("UNPAID");
            }
            purchaseOrderRepository.save(order);
        }
    }

    private PaymentTransactionDTO convertToDTO(PaymentTransaction transaction) {
        PaymentTransactionDTO dto = new PaymentTransactionDTO();
        dto.setId(transaction.getId());
        dto.setCustomerId(transaction.getCustomer().getId());
        dto.setCustomerName(transaction.getCustomer() != null ? transaction.getCustomer().getName() : null);
        dto.setCustomerAccountId(transaction.getCustomerAccount() != null ? transaction.getCustomerAccount().getId() : null);
        dto.setTransactionType(transaction.getTransactionType());
        dto.setAmount(transaction.getAmount());
        dto.setTransactionDate(transaction.getTransactionDate());
        dto.setPaymentMode(transaction.getPaymentMode());
        dto.setReferenceNumber(transaction.getReferenceNumber());
        dto.setSalesOrderId(transaction.getSalesOrder() != null ? transaction.getSalesOrder().getId() : null);
        dto.setPurchaseOrderId(transaction.getPurchaseOrder() != null ? transaction.getPurchaseOrder().getId() : null);
        dto.setCashId(transaction.getCash() != null ? transaction.getCash().getId() : null);
        dto.setRemarks(transaction.getRemarks());
        return dto;
    }
}

