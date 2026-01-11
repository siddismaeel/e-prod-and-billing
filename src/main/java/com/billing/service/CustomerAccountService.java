package com.billing.service;

import com.billing.dto.AccountStatementDTO;
import com.billing.dto.CustomerAccountDTO;
import com.billing.dto.StatementLineItemDTO;
import com.billing.entity.*;
import com.billing.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerAccountService {

    private final CustomerAccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;

    @Transactional
    public CustomerAccount getOrCreateAccount(Long customerId) {
        return accountRepository.findByCustomerIdWithCustomer(customerId)
                .orElseGet(() -> {
                    Customer customer = customerRepository.findById(customerId)
                            .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));
                    
                    CustomerAccount account = new CustomerAccount();
                    account.setCustomer(customer);
                    account.setOpeningBalance(BigDecimal.ZERO);
                    account.setCurrentBalance(BigDecimal.ZERO);
                    account.setTotalReceivable(BigDecimal.ZERO);
                    account.setTotalPayable(BigDecimal.ZERO);
                    account.setTotalPaid(BigDecimal.ZERO);
                    account.setTotalPaidOut(BigDecimal.ZERO);
                    
                    return accountRepository.save(account);
                });
    }

    @Transactional
    public void updateAccountFromSalesOrder(SalesOrder order) {
        CustomerAccount account = getOrCreateAccount(order.getCustomer().getId());
        
        // Recalculate total receivable from all non-deleted sales orders
        BigDecimal totalReceivable = salesOrderRepository.findByCustomerId(order.getCustomer().getId()).stream()
                .filter(o -> o.getDeletedAt() == null)
                .map(SalesOrder::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        account.setTotalReceivable(totalReceivable);
        account.setLastTransactionDate(order.getOrderDate());
        recalculateCurrentBalance(account);
        accountRepository.save(account);
    }

    @Transactional
    public void updateAccountFromPurchaseOrder(PurchaseOrder order) {
        CustomerAccount account = getOrCreateAccount(order.getCustomer().getId());
        
        // Recalculate total payable from all non-deleted purchase orders
        BigDecimal totalPayable = purchaseOrderRepository.findByCustomerId(order.getCustomer().getId()).stream()
                .filter(o -> o.getDeletedAt() == null)
                .map(PurchaseOrder::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        account.setTotalPayable(totalPayable);
        account.setLastTransactionDate(order.getOrderDate());
        recalculateCurrentBalance(account);
        accountRepository.save(account);
    }

    @Transactional
    public void updateAccountFromPayment(PaymentTransaction payment) {
        CustomerAccount account = getOrCreateAccount(payment.getCustomer().getId());
        
        // Recalculate total paid and paid out from all payment transactions
        List<PaymentTransaction> payments = paymentTransactionRepository.findByCustomerId(payment.getCustomer().getId());
        
        BigDecimal totalPaid = payments.stream()
                .filter(p -> "SALES_PAYMENT".equals(p.getTransactionType()))
                .map(PaymentTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalPaidOut = payments.stream()
                .filter(p -> "PURCHASE_PAYMENT".equals(p.getTransactionType()))
                .map(PaymentTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        account.setTotalPaid(totalPaid);
        account.setTotalPaidOut(totalPaidOut);
        account.setLastTransactionDate(payment.getTransactionDate());
        recalculateCurrentBalance(account);
        accountRepository.save(account);
    }

    public BigDecimal getAccountBalance(Long customerId) {
        CustomerAccount account = accountRepository.findByCustomerId(customerId)
                .orElse(null);
        return account != null ? account.getCurrentBalance() : BigDecimal.ZERO;
    }

    public CustomerAccountDTO getAccount(Long customerId) {
        CustomerAccount account = getOrCreateAccount(customerId);
        return convertToDTO(account);
    }

    public AccountStatementDTO getAccountStatement(Long customerId, LocalDate startDate, LocalDate endDate) {
        CustomerAccount account = getOrCreateAccount(customerId);
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Calculate opening balance from all transactions before start date
        BigDecimal openingBalance = calculateOpeningBalance(customerId, startDate);

        // Get all transactions in date range
        List<StatementLineItemDTO> transactions = new ArrayList<>();

        // Add sales orders
        List<SalesOrder> salesOrders = salesOrderRepository.findByCustomerId(customerId).stream()
                .filter(o -> o.getDeletedAt() == null && 
                        !o.getOrderDate().isBefore(startDate) && 
                        !o.getOrderDate().isAfter(endDate))
                .sorted(Comparator.comparing(SalesOrder::getOrderDate))
                .collect(Collectors.toList());

        for (SalesOrder order : salesOrders) {
            StatementLineItemDTO item = new StatementLineItemDTO();
            item.setDate(order.getOrderDate());
            item.setType("SALES_ORDER");
            item.setDescription("Sales Order #" + order.getId());
            item.setDebit(order.getTotalAmount());
            item.setCredit(BigDecimal.ZERO);
            item.setReferenceId(order.getId());
            transactions.add(item);
        }

        // Add purchase orders
        List<PurchaseOrder> purchaseOrders = purchaseOrderRepository.findByCustomerId(customerId).stream()
                .filter(o -> o.getDeletedAt() == null && 
                        !o.getOrderDate().isBefore(startDate) && 
                        !o.getOrderDate().isAfter(endDate))
                .sorted(Comparator.comparing(PurchaseOrder::getOrderDate))
                .collect(Collectors.toList());

        for (PurchaseOrder order : purchaseOrders) {
            StatementLineItemDTO item = new StatementLineItemDTO();
            item.setDate(order.getOrderDate());
            item.setType("PURCHASE_ORDER");
            item.setDescription("Purchase Order #" + order.getId());
            item.setDebit(BigDecimal.ZERO);
            item.setCredit(order.getTotalAmount());
            item.setReferenceId(order.getId());
            transactions.add(item);
        }

        // Add payment transactions
        List<PaymentTransaction> payments = paymentTransactionRepository
                .findByCustomerIdAndTransactionDateBetween(customerId, startDate, endDate);

        for (PaymentTransaction payment : payments) {
            StatementLineItemDTO item = new StatementLineItemDTO();
            item.setDate(payment.getTransactionDate());
            item.setType("PAYMENT");
            item.setDescription("Payment - " + payment.getPaymentMode() + 
                    (payment.getReferenceNumber() != null ? " #" + payment.getReferenceNumber() : ""));
            if ("SALES_PAYMENT".equals(payment.getTransactionType())) {
                item.setDebit(payment.getAmount());
                item.setCredit(BigDecimal.ZERO);
            } else {
                item.setDebit(BigDecimal.ZERO);
                item.setCredit(payment.getAmount());
            }
            item.setReferenceId(payment.getId());
            item.setReferenceNumber(payment.getReferenceNumber());
            transactions.add(item);
        }

        // Sort by date
        transactions.sort(Comparator.comparing(StatementLineItemDTO::getDate));

        // Calculate running balance
        BigDecimal runningBalance = openingBalance;
        for (StatementLineItemDTO item : transactions) {
            runningBalance = runningBalance.add(item.getDebit()).subtract(item.getCredit());
            item.setBalance(runningBalance);
        }

        // Calculate summary
        BigDecimal totalSales = salesOrders.stream()
                .map(SalesOrder::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPurchases = purchaseOrders.stream()
                .map(PurchaseOrder::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPaymentsReceived = payments.stream()
                .filter(p -> "SALES_PAYMENT".equals(p.getTransactionType()))
                .map(PaymentTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPaymentsMade = payments.stream()
                .filter(p -> "PURCHASE_PAYMENT".equals(p.getTransactionType()))
                .map(PaymentTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        AccountStatementDTO statement = new AccountStatementDTO();
        statement.setCustomerId(customerId);
        statement.setCustomerName(customer.getName());
        statement.setStartDate(startDate);
        statement.setEndDate(endDate);
        statement.setOpeningBalance(openingBalance);
        statement.setClosingBalance(runningBalance);
        statement.setTotalSales(totalSales);
        statement.setTotalPurchases(totalPurchases);
        statement.setTotalPaymentsReceived(totalPaymentsReceived);
        statement.setTotalPaymentsMade(totalPaymentsMade);
        
        // Calculate total credit and debit for the period
        BigDecimal totalCredit = totalSales.add(totalPaymentsReceived);  // Money coming in
        BigDecimal totalDebit = totalPurchases.add(totalPaymentsMade);   // Money going out
        statement.setTotalCredit(totalCredit);
        statement.setTotalDebit(totalDebit);
        
        statement.setTransactions(transactions);

        return statement;
    }

    @Transactional
    public CustomerAccountDTO recalculateBalance(Long customerId) {
        CustomerAccount account = getOrCreateAccount(customerId);
        
        // Recalculate from all orders
        BigDecimal totalReceivable = salesOrderRepository.findByCustomerId(customerId).stream()
                .filter(o -> o.getDeletedAt() == null)
                .map(SalesOrder::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalPayable = purchaseOrderRepository.findByCustomerId(customerId).stream()
                .filter(o -> o.getDeletedAt() == null)
                .map(PurchaseOrder::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Recalculate from all payments
        List<PaymentTransaction> payments = paymentTransactionRepository.findByCustomerId(customerId);
        BigDecimal totalPaid = payments.stream()
                .filter(p -> "SALES_PAYMENT".equals(p.getTransactionType()))
                .map(PaymentTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalPaidOut = payments.stream()
                .filter(p -> "PURCHASE_PAYMENT".equals(p.getTransactionType()))
                .map(PaymentTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        account.setTotalReceivable(totalReceivable);
        account.setTotalPayable(totalPayable);
        account.setTotalPaid(totalPaid);
        account.setTotalPaidOut(totalPaidOut);
        
        recalculateCurrentBalance(account);
        account = accountRepository.save(account);
        
        return convertToDTO(account);
    }

    private BigDecimal calculateOpeningBalance(Long customerId, LocalDate startDate) {
        BigDecimal openingBalance = BigDecimal.ZERO;
        
        // Get all sales orders before start date
        BigDecimal totalReceivableBefore = salesOrderRepository.findByCustomerId(customerId).stream()
                .filter(o -> o.getDeletedAt() == null && o.getOrderDate().isBefore(startDate))
                .map(SalesOrder::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Get all purchase orders before start date
        BigDecimal totalPayableBefore = purchaseOrderRepository.findByCustomerId(customerId).stream()
                .filter(o -> o.getDeletedAt() == null && o.getOrderDate().isBefore(startDate))
                .map(PurchaseOrder::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Get all payments before start date
        List<PaymentTransaction> paymentsBefore = paymentTransactionRepository.findByCustomerId(customerId).stream()
                .filter(p -> p.getTransactionDate().isBefore(startDate))
                .collect(Collectors.toList());
        
        BigDecimal totalPaidBefore = paymentsBefore.stream()
                .filter(p -> "SALES_PAYMENT".equals(p.getTransactionType()))
                .map(PaymentTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalPaidOutBefore = paymentsBefore.stream()
                .filter(p -> "PURCHASE_PAYMENT".equals(p.getTransactionType()))
                .map(PaymentTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Opening Balance = Base Opening Balance + Receivables - Payables - Paid + Paid Out
        CustomerAccount account = accountRepository.findByCustomerId(customerId).orElse(null);
        BigDecimal baseOpeningBalance = account != null && account.getOpeningBalance() != null 
                ? account.getOpeningBalance() 
                : BigDecimal.ZERO;
        
        openingBalance = baseOpeningBalance
                .add(totalReceivableBefore)
                .subtract(totalPayableBefore)
                .subtract(totalPaidBefore)
                .add(totalPaidOutBefore);
        
        return openingBalance;
    }

    private void recalculateCurrentBalance(CustomerAccount account) {
        // Current Balance = Opening Balance + Total Receivable - Total Payable - Total Paid + Total Paid Out
        BigDecimal balance = account.getOpeningBalance()
                .add(account.getTotalReceivable())
                .subtract(account.getTotalPayable())
                .subtract(account.getTotalPaid())
                .add(account.getTotalPaidOut());
        
        account.setCurrentBalance(balance);
    }

    private CustomerAccountDTO convertToDTO(CustomerAccount account) {
        CustomerAccountDTO dto = new CustomerAccountDTO();
        dto.setId(account.getId());
        
        if (account.getCustomer() != null) {
            dto.setCustomerId(account.getCustomer().getId());
            if (account.getCustomer().getName() != null) {
                dto.setCustomerName(account.getCustomer().getName());
            }
        }
        
        dto.setOpeningBalance(account.getOpeningBalance() != null ? account.getOpeningBalance() : BigDecimal.ZERO);
        dto.setCurrentBalance(account.getCurrentBalance() != null ? account.getCurrentBalance() : BigDecimal.ZERO);
        dto.setTotalReceivable(account.getTotalReceivable() != null ? account.getTotalReceivable() : BigDecimal.ZERO);
        dto.setTotalPayable(account.getTotalPayable() != null ? account.getTotalPayable() : BigDecimal.ZERO);
        dto.setTotalPaid(account.getTotalPaid() != null ? account.getTotalPaid() : BigDecimal.ZERO);
        dto.setTotalPaidOut(account.getTotalPaidOut() != null ? account.getTotalPaidOut() : BigDecimal.ZERO);
        dto.setLastTransactionDate(account.getLastTransactionDate());
        
        // Map convenience fields for frontend compatibility
        BigDecimal currentBalance = account.getCurrentBalance() != null ? account.getCurrentBalance() : BigDecimal.ZERO;
        BigDecimal totalReceivable = account.getTotalReceivable() != null ? account.getTotalReceivable() : BigDecimal.ZERO;
        BigDecimal totalPayable = account.getTotalPayable() != null ? account.getTotalPayable() : BigDecimal.ZERO;
        
        dto.setBalance(currentBalance);
        dto.setTotalCredit(totalReceivable);  // Money owed to you (credit)
        dto.setTotalDebit(totalPayable);      // Money you owe (debit)
        
        return dto;
    }
}

