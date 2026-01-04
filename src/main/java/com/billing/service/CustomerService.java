package com.billing.service;

import com.billing.dto.CustomerDTO;
import com.billing.dto.CustomerDropdownDTO;
import com.billing.entity.Company;
import com.billing.entity.Customer;
import com.billing.entity.Organization;
import com.billing.repository.CompanyRepository;
import com.billing.repository.CustomerRepository;
import com.billing.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final OrganizationRepository organizationRepository;
    private final CompanyRepository companyRepository;

    @Transactional
    public CustomerDTO upsertCustomer(CustomerDTO dto) {
        Customer customer;

        if (dto.getId() != null && customerRepository.existsById(dto.getId())) {
            customer = customerRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Customer not found with id: " + dto.getId()));
        } else {
            customer = new Customer();
        }

        customer.setName(dto.getName());
        customer.setContact(dto.getContact());
        customer.setAddress(dto.getAddress());

        if (dto.getOrganizationId() != null) {
            Organization organization = organizationRepository.findById(dto.getOrganizationId())
                    .orElseThrow(() -> new RuntimeException("Organization not found with id: " + dto.getOrganizationId()));
            customer.setOrganization(organization);
        }

        if (dto.getCompanyId() != null) {
            Company company = companyRepository.findById(dto.getCompanyId())
                    .orElseThrow(() -> new RuntimeException("Company not found with id: " + dto.getCompanyId()));
            customer.setCompany(company);
        }

        customer = customerRepository.save(customer);
        return convertToDTO(customer);
    }

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return convertToDTO(customer);
    }

    public List<CustomerDropdownDTO> getCustomersForDropdown() {
        return customerRepository.findAll().stream()
                .map(this::convertToDropdownDTO)
                .collect(Collectors.toList());
    }

    private CustomerDTO convertToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setContact(customer.getContact());
        dto.setAddress(customer.getAddress());
        if (customer.getOrganization() != null) {
            dto.setOrganizationId(customer.getOrganization().getId());
        }
        if (customer.getCompany() != null) {
            dto.setCompanyId(customer.getCompany().getId());
        }
        return dto;
    }

    private CustomerDropdownDTO convertToDropdownDTO(Customer customer) {
        CustomerDropdownDTO dto = new CustomerDropdownDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        return dto;
    }
}


