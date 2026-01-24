package com.billing.service;

import com.billing.dto.ReadyItemDTO;
import com.billing.entity.GoodsType;
import com.billing.entity.ReadyItem;
import com.billing.repository.GoodsTypeRepository;
import com.billing.repository.ReadyItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReadyItemService {

    private final ReadyItemRepository readyItemRepository;
    private final GoodsTypeRepository goodsTypeRepository;
    private final ReadyItemStockService readyItemStockService;

    @Transactional
    public ReadyItemDTO upsertReadyItem(ReadyItemDTO dto) {
        ReadyItem readyItem;

        if (dto.getId() != null && readyItemRepository.existsById(dto.getId())) {
            readyItem = readyItemRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Ready item not found with id: " + dto.getId()));
        } else {
            readyItem = new ReadyItem();
        }

        readyItem.setName(dto.getName());
        readyItem.setCode(dto.getCode());
        readyItem.setUnit(dto.getUnit());
        readyItem.setDescription(dto.getDescription());

        if (dto.getGoodsTypeId() != null) {
            GoodsType goodsType = goodsTypeRepository.findById(dto.getGoodsTypeId())
                    .orElseThrow(() -> new RuntimeException("Goods type not found with id: " + dto.getGoodsTypeId()));
            readyItem.setGoodsType(goodsType);
        }

        readyItem = readyItemRepository.save(readyItem);
        
        // Create initial stock record if opening stock is provided and ready item is new
        if (dto.getOpeningStock() != null && dto.getId() == null && dto.getOpeningStock().compareTo(BigDecimal.ZERO) > 0) {
            String quality = dto.getOpeningStockQuality() != null && !dto.getOpeningStockQuality().trim().isEmpty()
                ? dto.getOpeningStockQuality()
                : "STANDARD";
            
            readyItemStockService.recordDailyStock(
                readyItem.getId(),
                LocalDate.now(),
                quality,
                dto.getOpeningStock(),  // openingStock
                BigDecimal.ZERO,        // quantityProduced
                BigDecimal.ZERO         // quantitySold
            );
        }
        
        return convertToDTO(readyItem);
    }

    public List<ReadyItemDTO> getAllReadyItems() {
        return readyItemRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ReadyItemDTO getReadyItemById(Long id) {
        ReadyItem readyItem = readyItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ready item not found with id: " + id));
        return convertToDTO(readyItem);
    }

    public java.math.BigDecimal getReadyItemStock(Long readyItemId) {
        // This will be implemented by ReadyItemStockService
        return java.math.BigDecimal.ZERO;
    }

    private ReadyItemDTO convertToDTO(ReadyItem readyItem) {
        ReadyItemDTO dto = new ReadyItemDTO();
        dto.setId(readyItem.getId());
        dto.setName(readyItem.getName());
        dto.setCode(readyItem.getCode());
        dto.setUnit(readyItem.getUnit());
        dto.setDescription(readyItem.getDescription());
        if (readyItem.getGoodsType() != null) {
            dto.setGoodsTypeId(readyItem.getGoodsType().getId());
        }
        dto.setQualityImpact(readyItem.getQualityImpact());
        dto.setCostImpact(readyItem.getCostImpact());
        dto.setExtraQuantityUsed(readyItem.getExtraQuantityUsed());
        dto.setLessQuantityUsed(readyItem.getLessQuantityUsed());
        dto.setPercentageDeviation(readyItem.getPercentageDeviation());
        dto.setLastPropositionCheck(readyItem.getLastPropositionCheck());
        return dto;
    }

    @Transactional
    public void updateStockFromSalesOrder(Long salesOrderId) {
        // This will be implemented when SalesOrder integration is added
        // For now, it's a placeholder
    }
}

