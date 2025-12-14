package com.billing.controller;

import com.billing.dto.PropositionDTO;
import com.billing.service.PropositionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/propositions")
@RequiredArgsConstructor
public class PropositionController {

    private final PropositionService propositionService;

    @PostMapping
    public ResponseEntity<PropositionDTO> upsertProposition(@Valid @RequestBody PropositionDTO dto) {
        boolean isUpdate = dto.getId() != null;
        PropositionDTO saved = propositionService.upsertProposition(dto);
        HttpStatus status = isUpdate ? HttpStatus.OK : HttpStatus.CREATED;
        return ResponseEntity.status(status).body(saved);
    }

    @GetMapping("/ready-item/{readyItemId}")
    public ResponseEntity<List<PropositionDTO>> getPropositionsByReadyItem(@PathVariable Long readyItemId) {
        return ResponseEntity.ok(propositionService.getPropositionsByReadyItem(readyItemId));
    }

    @GetMapping("/ready-item/{readyItemId}/validate")
    public ResponseEntity<Map<String, Boolean>> validatePropositions(@PathVariable Long readyItemId) {
        boolean isValid = propositionService.validatePropositions(readyItemId);
        return ResponseEntity.ok(Map.of("isValid", isValid));
    }
}

