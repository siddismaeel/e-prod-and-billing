package com.billing.controller;

import com.billing.dto.GoodsTypeDTO;
import com.billing.service.GoodsTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goods-types")
@RequiredArgsConstructor
public class GoodsTypeController {

    private final GoodsTypeService goodsTypeService;

    @GetMapping
    public ResponseEntity<List<GoodsTypeDTO>> getAllGoodsTypes() {
        return ResponseEntity.ok(goodsTypeService.getAllGoodsTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoodsTypeDTO> getGoodsTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(goodsTypeService.getGoodsTypeById(id));
    }
}

