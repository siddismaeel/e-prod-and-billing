package com.billing.controller;

import com.billing.dto.CustomerDTO;
import com.billing.dto.CustomerDropdownDTO;
import com.billing.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<CustomerDTO> upsertCustomer(@Valid @RequestBody CustomerDTO dto) {
        boolean isUpdate = dto.getId() != null;
        CustomerDTO saved = customerService.upsertCustomer(dto);
        HttpStatus status = isUpdate ? HttpStatus.OK : HttpStatus.CREATED;
        return ResponseEntity.status(status).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @GetMapping("/dropdown")
    public ResponseEntity<List<CustomerDropdownDTO>> getCustomersForDropdown() {
        return ResponseEntity.ok(customerService.getCustomersForDropdown());
    }
}


