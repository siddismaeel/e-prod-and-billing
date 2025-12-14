package com.billing.controller;

import com.billing.dto.ReadyItemDTO;
import com.billing.service.ReadyItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ready-items")
@RequiredArgsConstructor
public class ReadyItemController {

    private final ReadyItemService readyItemService;

    @PostMapping
    public ResponseEntity<ReadyItemDTO> upsertReadyItem(@Valid @RequestBody ReadyItemDTO dto) {
        boolean isUpdate = dto.getId() != null;
        ReadyItemDTO saved = readyItemService.upsertReadyItem(dto);
        HttpStatus status = isUpdate ? HttpStatus.OK : HttpStatus.CREATED;
        return ResponseEntity.status(status).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<ReadyItemDTO>> getAllReadyItems() {
        return ResponseEntity.ok(readyItemService.getAllReadyItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReadyItemDTO> getReadyItemById(@PathVariable Long id) {
        return ResponseEntity.ok(readyItemService.getReadyItemById(id));
    }
}

