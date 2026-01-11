package com.billing.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropositionBatchDTO {

    @NotNull(message = "Ready item ID is required")
    private Long readyItemId;

    @NotEmpty(message = "At least one raw material entry is required")
    @Valid
    private List<PropositionEntryDTO> rawMaterialEntries;
}

