package com.billing.service;

import com.billing.dto.SalesItemDTO;
import com.billing.dto.SalesOrderDTO;
import com.billing.entity.*;
import com.billing.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalesOrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final SalesItemRepository salesItemRepository;
    private final CustomerRepository customerRepository;
    private final ReadyItemRepository readyItemRepository;
    private final GoodsTypeRepository goodsTypeRepository;
    private final ReadyItemStockService readyItemStockService;
    private final CustomerAccountService customerAccountService;

    @Transactional
    public SalesOrderDTO upsertSalesOrder(SalesOrderDTO dto) {
        SalesOrder salesOrder;

        if (dto.getId() != null && dto.getId() > 0 && salesOrderRepository.existsById(dto.getId())) {
            // Update existing order
            salesOrder = salesOrderRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Sales order not found with id: " + dto.getId()));

            // Reverse stock from old items
            reverseStockFromOrder(salesOrder);

            // Delete old items
            List<SalesItem> oldItems = salesItemRepository.findBySalesOrderId(salesOrder.getId());
            salesItemRepository.deleteAll(oldItems);
        } else {
            // Create new order
            salesOrder = new SalesOrder();
        }

        // Validate stock availability for new items
        validateStockAvailability(dto.getSalesItems(), dto.getOrderDate());

        // Update order fields
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + dto.getCustomerId()));

        salesOrder.setCustomer(customer);
        salesOrder.setOrderDate(dto.getOrderDate());
        salesOrder.setPaymentStatus(dto.getPaymentStatus());
        salesOrder.setRemarks(dto.getRemarks());
        salesOrder.setGst(dto.getGst() != null ? dto.getGst() : BigDecimal.ZERO);
        salesOrder.setGstAmount(dto.getGstAmount() != null ? dto.getGstAmount() : BigDecimal.ZERO);

        // Use totalAmount from DTO (which already includes GST if calculated on frontend)
        // If not provided, calculate from items (for backward compatibility)
        BigDecimal totalAmount = dto.getTotalAmount();
        if (totalAmount == null) {
            totalAmount = dto.getSalesItems().stream()
                    .map(SalesItemDTO::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            // Add GST if not already included
            if (dto.getGstAmount() != null) {
                totalAmount = totalAmount.add(dto.getGstAmount());
            }
        }

        salesOrder.setTotalAmount(totalAmount);
        salesOrder.setPaidAmount(dto.getPaidAmount());
        salesOrder.setBalancePayment(totalAmount.subtract(dto.getPaidAmount()));

        // Save order
        salesOrder = salesOrderRepository.save(salesOrder);

        // Create and save items
        List<SalesItem> salesItems = new ArrayList<>();
        for (SalesItemDTO itemDto : dto.getSalesItems()) {
            SalesItem item = convertToEntity(itemDto, salesOrder);
            salesItems.add(salesItemRepository.save(item));
        }

        // Deduct stock for all items
        deductStockFromOrder(salesItems, dto.getOrderDate());

        // Update customer account
        customerAccountService.updateAccountFromSalesOrder(salesOrder);

        return convertToDTO(salesOrder, salesItems);
    }

    @Transactional
    public void deleteSalesOrder(Long id) {
        SalesOrder salesOrder = salesOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sales order not found with id: " + id));

        // Reverse stock from all items
        reverseStockFromOrder(salesOrder);

        // Soft delete
        salesOrder.setDeletedAt(LocalDateTime.now());
        salesOrderRepository.save(salesOrder);

        // Update customer account (recalculate after deletion)
        customerAccountService.updateAccountFromSalesOrder(salesOrder);
    }

    public SalesOrderDTO getSalesOrder(Long id) {
        SalesOrder salesOrder = salesOrderRepository.findByIdWithCustomer(id)
                .orElseThrow(() -> new RuntimeException("Sales order not found with id: " + id));

        List<SalesItem> salesItems = salesItemRepository.findBySalesOrderId(id);
        return convertToDTO(salesOrder, salesItems);
    }

    public List<SalesOrderDTO> getAllSalesOrders() {
        return salesOrderRepository.findAllWithCustomer().stream()
                .map(order -> {
                    List<SalesItem> items = salesItemRepository.findBySalesOrderId(order.getId());
                    return convertToDTO(order, items);
                })
                .collect(Collectors.toList());
    }

    private void validateStockAvailability(List<SalesItemDTO> items, LocalDate orderDate) {
        for (SalesItemDTO item : items) {
            BigDecimal currentStock = readyItemStockService.getCurrentStock(
                    item.getReadyItemId(), item.getQuality());

            if (currentStock.compareTo(item.getQuantity()) < 0) {
                ReadyItem readyItem = readyItemRepository.findById(item.getReadyItemId())
                        .orElseThrow(() -> new RuntimeException("Ready item not found"));
                throw new RuntimeException("Insufficient stock for ReadyItem " + readyItem.getName() +
                        ", Quality " + item.getQuality() + ". Required: " + item.getQuantity() +
                        ", Available: " + currentStock);
            }
        }
    }

    private void reverseStockFromOrder(SalesOrder order) {
        List<SalesItem> items = salesItemRepository.findBySalesOrderId(order.getId());
        for (SalesItem item : items) {
            if (item.getDeletedAt() == null) {
                readyItemStockService.addStock(
                        item.getReadyItem().getId(),
                        item.getQuality(),
                        item.getQuantity(),
                        order.getOrderDate()
                );
            }
        }
    }

    private void deductStockFromOrder(List<SalesItem> items, LocalDate orderDate) {
        for (SalesItem item : items) {
            readyItemStockService.deductStock(
                    item.getReadyItem().getId(),
                    item.getQuality(),
                    item.getQuantity(),
                    orderDate
            );
        }
    }

    private SalesItem convertToEntity(SalesItemDTO dto, SalesOrder salesOrder) {
        SalesItem item = new SalesItem();
        // Only set ID if it's a valid existing ID (> 0)
        // For new items (id: 0 or null), let Hibernate generate the ID
        if (dto.getId() != null && dto.getId() > 0) {
            item.setId(dto.getId());
        }

        ReadyItem readyItem = readyItemRepository.findById(dto.getReadyItemId())
                .orElseThrow(() -> new RuntimeException("Ready item not found with id: " + dto.getReadyItemId()));

        GoodsType goodsType = goodsTypeRepository.findById(dto.getGoodsTypeId())
                .orElseThrow(() -> new RuntimeException("Goods type not found with id: " + dto.getGoodsTypeId()));

        item.setSalesOrder(salesOrder);
        item.setReadyItem(readyItem);
        item.setGoodsType(goodsType);
        item.setQuality(dto.getQuality());
        item.setQuantity(dto.getQuantity());
        item.setUnitPrice(dto.getUnitPrice());
        item.setTotalPrice(dto.getTotalPrice());
        item.setRate(dto.getRate());
        item.setReport(dto.getReport());
        item.setRemarks(dto.getRemarks());

        return item;
    }

    private SalesOrderDTO convertToDTO(SalesOrder order, List<SalesItem> items) {
        SalesOrderDTO dto = new SalesOrderDTO();
        dto.setId(order.getId());
        dto.setCustomerId(order.getCustomer().getId());
        if (order.getCustomer() != null && order.getCustomer().getName() != null) {
            dto.setCustomerName(order.getCustomer().getName());
        }
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setPaidAmount(order.getPaidAmount());
        dto.setBalancePayment(order.getBalancePayment());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setGst(order.getGst() != null ? order.getGst() : BigDecimal.ZERO);
        dto.setGstAmount(order.getGstAmount() != null ? order.getGstAmount() : BigDecimal.ZERO);
        dto.setRemarks(order.getRemarks());

        List<SalesItemDTO> itemDtos = items.stream()
                .filter(item -> item.getDeletedAt() == null)
                .map(this::convertItemToDTO)
                .collect(Collectors.toList());
        dto.setSalesItems(itemDtos);

        return dto;
    }

    private SalesItemDTO convertItemToDTO(SalesItem item) {
        SalesItemDTO dto = new SalesItemDTO();
        dto.setId(item.getId());
        dto.setSalesOrderId(item.getSalesOrder().getId());
        dto.setReadyItemId(item.getReadyItem().getId());
        dto.setQuality(item.getQuality());
        dto.setGoodsTypeId(item.getGoodsType().getId());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setTotalPrice(item.getTotalPrice());
        dto.setRate(item.getRate());
        dto.setReport(item.getReport());
        dto.setRemarks(item.getRemarks());
        return dto;
    }
}

