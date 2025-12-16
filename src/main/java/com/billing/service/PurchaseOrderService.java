package com.billing.service;

import com.billing.dto.PurchaseItemDTO;
import com.billing.dto.PurchaseOrderDTO;
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
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseItemRepository purchaseItemRepository;
    private final CustomerRepository customerRepository;
    private final RawMaterialRepository rawMaterialRepository;
    private final GoodsTypeRepository goodsTypeRepository;
    private final RawMaterialStockService rawMaterialStockService;

    @Transactional
    public PurchaseOrderDTO upsertPurchaseOrder(PurchaseOrderDTO dto) {
        PurchaseOrder purchaseOrder;
        boolean isUpdate = dto.getId() != null;

        if (isUpdate) {
            // Update existing order
            purchaseOrder = purchaseOrderRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Purchase order not found with id: " + dto.getId()));

            // Reverse stock from old items
            reverseStockFromOrder(purchaseOrder);

            // Delete old items
            List<PurchaseItem> oldItems = purchaseItemRepository.findByPurchaseOrderId(purchaseOrder.getId());
            purchaseItemRepository.deleteAll(oldItems);
        } else {
            // Create new order
            purchaseOrder = new PurchaseOrder();
        }

        // Update order fields
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + dto.getCustomerId()));

        purchaseOrder.setCustomer(customer);
        purchaseOrder.setOrderDate(dto.getOrderDate());
        purchaseOrder.setPaymentStatus(dto.getPaymentStatus());
        purchaseOrder.setRemarks(dto.getRemarks());

        // Calculate total amount from items
        BigDecimal totalAmount = dto.getPurchaseItems().stream()
                .map(PurchaseItemDTO::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        purchaseOrder.setTotalAmount(totalAmount);
        purchaseOrder.setPaidAmount(dto.getPaidAmount());
        purchaseOrder.setBalancePayment(totalAmount.subtract(dto.getPaidAmount()));

        // Save order
        purchaseOrder = purchaseOrderRepository.save(purchaseOrder);

        // Create and save items
        List<PurchaseItem> purchaseItems = new ArrayList<>();
        for (PurchaseItemDTO itemDto : dto.getPurchaseItems()) {
            PurchaseItem item = convertToEntity(itemDto, purchaseOrder);
            purchaseItems.add(purchaseItemRepository.save(item));
        }

        // Add stock for all items
        addStockFromOrder(purchaseItems, dto.getOrderDate());

        return convertToDTO(purchaseOrder, purchaseItems);
    }

    @Transactional
    public void deletePurchaseOrder(Long id) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found with id: " + id));

        // Reverse stock from all items
        reverseStockFromOrder(purchaseOrder);

        // Soft delete
        purchaseOrder.setDeletedAt(LocalDateTime.now());
        purchaseOrderRepository.save(purchaseOrder);
    }

    public PurchaseOrderDTO getPurchaseOrder(Long id) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found with id: " + id));

        List<PurchaseItem> purchaseItems = purchaseItemRepository.findByPurchaseOrderId(id);
        return convertToDTO(purchaseOrder, purchaseItems);
    }

    public List<PurchaseOrderDTO> getAllPurchaseOrders() {
        return purchaseOrderRepository.findByDeletedAtIsNull().stream()
                .map(order -> {
                    List<PurchaseItem> items = purchaseItemRepository.findByPurchaseOrderId(order.getId());
                    return convertToDTO(order, items);
                })
                .collect(Collectors.toList());
    }

    private void reverseStockFromOrder(PurchaseOrder order) {
        List<PurchaseItem> items = purchaseItemRepository.findByPurchaseOrderId(order.getId());
        for (PurchaseItem item : items) {
            if (item.getDeletedAt() == null) {
                // Use netQuantity if available, otherwise use quantity
                BigDecimal quantityToReverse = item.getNetQuantity() != null && item.getNetQuantity().compareTo(BigDecimal.ZERO) > 0
                        ? item.getNetQuantity()
                        : item.getQuantity();

                rawMaterialStockService.removeStock(
                        item.getRawMaterial().getId(),
                        quantityToReverse,
                        order.getOrderDate()
                );
            }
        }
    }

    private void addStockFromOrder(List<PurchaseItem> items, LocalDate orderDate) {
        for (PurchaseItem item : items) {
            // Use netQuantity if available, otherwise use quantity
            BigDecimal quantityToAdd = item.getNetQuantity() != null && item.getNetQuantity().compareTo(BigDecimal.ZERO) > 0
                    ? item.getNetQuantity()
                    : item.getQuantity();

            rawMaterialStockService.addStock(
                    item.getRawMaterial().getId(),
                    quantityToAdd,
                    orderDate
            );
        }
    }

    private PurchaseItem convertToEntity(PurchaseItemDTO dto, PurchaseOrder purchaseOrder) {
        PurchaseItem item = new PurchaseItem();
        if (dto.getId() != null) {
            item.setId(dto.getId());
        }

        RawMaterial rawMaterial = rawMaterialRepository.findById(dto.getRawMaterialId())
                .orElseThrow(() -> new RuntimeException("Raw material not found with id: " + dto.getRawMaterialId()));

        GoodsType goodsType = goodsTypeRepository.findById(dto.getGoodsTypeId())
                .orElseThrow(() -> new RuntimeException("Goods type not found with id: " + dto.getGoodsTypeId()));

        item.setPurchaseOrder(purchaseOrder);
        item.setRawMaterial(rawMaterial);
        item.setGoodsType(goodsType);
        item.setQuantity(dto.getQuantity());
        item.setNetQuantity(dto.getNetQuantity());
        item.setUnitPrice(dto.getUnitPrice());
        item.setTotalPrice(dto.getTotalPrice());
        item.setRate(dto.getRate());
        item.setReport(dto.getReport());
        item.setRemarks(dto.getRemarks());
        item.setFringeCost(dto.getFringeCost());

        return item;
    }

    private PurchaseOrderDTO convertToDTO(PurchaseOrder order, List<PurchaseItem> items) {
        PurchaseOrderDTO dto = new PurchaseOrderDTO();
        dto.setId(order.getId());
        dto.setCustomerId(order.getCustomer().getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setPaidAmount(order.getPaidAmount());
        dto.setBalancePayment(order.getBalancePayment());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setRemarks(order.getRemarks());

        List<PurchaseItemDTO> itemDtos = items.stream()
                .filter(item -> item.getDeletedAt() == null)
                .map(this::convertItemToDTO)
                .collect(Collectors.toList());
        dto.setPurchaseItems(itemDtos);

        return dto;
    }

    private PurchaseItemDTO convertItemToDTO(PurchaseItem item) {
        PurchaseItemDTO dto = new PurchaseItemDTO();
        dto.setId(item.getId());
        dto.setPurchaseOrderId(item.getPurchaseOrder().getId());
        dto.setRawMaterialId(item.getRawMaterial().getId());
        dto.setGoodsTypeId(item.getGoodsType().getId());
        dto.setQuantity(item.getQuantity());
        dto.setNetQuantity(item.getNetQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setTotalPrice(item.getTotalPrice());
        dto.setRate(item.getRate());
        dto.setReport(item.getReport());
        dto.setRemarks(item.getRemarks());
        dto.setFringeCost(item.getFringeCost());
        return dto;
    }
}

