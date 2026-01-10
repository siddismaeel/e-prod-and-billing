package com.billing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoodsTypeDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    private Long organizationId;

    private Long companyId;
}

