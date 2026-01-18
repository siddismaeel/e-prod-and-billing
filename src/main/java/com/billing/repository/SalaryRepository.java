package com.billing.repository;

import com.billing.entity.Salary;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalaryRepository extends BaseRepository<Salary, Long> {
    default List<Salary> findByEmployeeId(Long employeeId) {
        Specification<Salary> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Salary> employeeSpec = (root, query, cb) -> 
            cb.equal(root.get("employee").get("id"), employeeId);
        return findAll(Specification.where(filterSpec).and(employeeSpec));
    }
    
    default List<Salary> findByPayamentDateBetween(LocalDate startDate, LocalDate endDate) {
        Specification<Salary> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Salary> dateSpec = (root, query, cb) -> 
            cb.between(root.get("payamentDate"), startDate, endDate);
        return findAll(Specification.where(filterSpec).and(dateSpec));
    }
}

