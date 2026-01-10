package com.billing.service;

import com.billing.dto.GoodsTypeDTO;
import com.billing.entity.GoodsType;
import com.billing.repository.GoodsTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoodsTypeService {

    private final GoodsTypeRepository goodsTypeRepository;

    public List<GoodsTypeDTO> getAllGoodsTypes() {
        return goodsTypeRepository.findByIsDeletedFalse().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public GoodsTypeDTO getGoodsTypeById(Long id) {
        GoodsType goodsType = goodsTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goods type not found with id: " + id));
        return convertToDTO(goodsType);
    }

    private GoodsTypeDTO convertToDTO(GoodsType goodsType) {
        GoodsTypeDTO dto = new GoodsTypeDTO();
        dto.setId(goodsType.getId());
        dto.setName(goodsType.getName());
        if (goodsType.getOrganization() != null && goodsType.getOrganization().getId() != null) {
            dto.setOrganizationId(goodsType.getOrganization().getId());
        }
        if (goodsType.getCompany() != null && goodsType.getCompany().getId() != null) {
            dto.setCompanyId(goodsType.getCompany().getId());
        }
        return dto;
    }
}

