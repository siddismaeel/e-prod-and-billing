package com.billing.controller;

import com.billing.dto.RawMaterialDTO;
import com.billing.service.RawMaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/raw-materials")
@RequiredArgsConstructor
public class RawMaterialController {

    private final RawMaterialService rawMaterialService;

    @PostMapping
    public ResponseEntity<RawMaterialDTO> upsertRawMaterial(@Valid @RequestBody RawMaterialDTO dto) {
        boolean isUpdate = dto.getId() != null;
        RawMaterialDTO saved = rawMaterialService.upsertRawMaterial(dto);
        HttpStatus status = isUpdate ? HttpStatus.OK : HttpStatus.CREATED;
        return ResponseEntity.status(status).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<RawMaterialDTO>> getAllRawMaterials() {
        return ResponseEntity.ok(rawMaterialService.getAllRawMaterials());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RawMaterialDTO> getRawMaterialById(@PathVariable Long id) {
        return ResponseEntity.ok(rawMaterialService.getRawMaterialById(id));
    }
}

