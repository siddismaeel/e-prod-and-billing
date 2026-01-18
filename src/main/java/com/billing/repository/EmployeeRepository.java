package com.billing.repository;

import com.billing.entity.Employee;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.util.List;

@Repository
public interface EmployeeRepository extends BaseRepository<Employee, Long> {
    default List<Employee> findByIsActiveTrue() {
        Specification<Employee> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Employee> activeSpec = (root, query, cb) -> 
            cb.equal(root.get("isActive"), true);
        return findAll(Specification.where(filterSpec).and(activeSpec));
    }
}

