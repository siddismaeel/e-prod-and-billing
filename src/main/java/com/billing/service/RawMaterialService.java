package com.billing.service;

import com.billing.dto.RawMaterialDTO;
import com.billing.entity.GoodsType;
import com.billing.entity.RawMaterial;
import com.billing.repository.GoodsTypeRepository;
import com.billing.repository.RawMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RawMaterialService {

    private final RawMaterialRepository rawMaterialRepository;
    private final GoodsTypeRepository goodsTypeRepository;

    @Transactional
    public RawMaterialDTO upsertRawMaterial(RawMaterialDTO dto) {
        RawMaterial rawMaterial;

        if (dto.getId() != null && rawMaterialRepository.existsById(dto.getId())) {
            rawMaterial = rawMaterialRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Raw material not found with id: " + dto.getId()));
        } else {
            rawMaterial = new RawMaterial();
        }

        rawMaterial.setName(dto.getName());
        rawMaterial.setCode(dto.getCode());
        rawMaterial.setUnit(dto.getUnit());
        rawMaterial.setDescription(dto.getDescription());

        if (dto.getGoodsTypeId() != null) {
            GoodsType goodsType = goodsTypeRepository.findById(dto.getGoodsTypeId())
                    .orElseThrow(() -> new RuntimeException("Goods type not found with id: " + dto.getGoodsTypeId()));
            rawMaterial.setGoodsType(goodsType);
        }

        rawMaterial = rawMaterialRepository.save(rawMaterial);
        return convertToDTO(rawMaterial);
    }

    public List<RawMaterialDTO> getAllRawMaterials() {
        return rawMaterialRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RawMaterialDTO getRawMaterialById(Long id) {
        RawMaterial rawMaterial = rawMaterialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Raw material not found with id: " + id));
        return convertToDTO(rawMaterial);
    }

    private RawMaterialDTO convertToDTO(RawMaterial rawMaterial) {
        RawMaterialDTO dto = new RawMaterialDTO();
        dto.setId(rawMaterial.getId());
        dto.setName(rawMaterial.getName());
        dto.setCode(rawMaterial.getCode());
        dto.setUnit(rawMaterial.getUnit());
        dto.setDescription(rawMaterial.getDescription());
        if (rawMaterial.getGoodsType() != null) {
            dto.setGoodsTypeId(rawMaterial.getGoodsType().getId());
        }
        return dto;
    }
}

