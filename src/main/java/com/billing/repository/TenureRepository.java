package com.billing.repository;

import com.billing.entity.Tenure;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.util.List;

@Repository
public interface TenureRepository extends BaseRepository<Tenure, Long> {
    default List<Tenure> findByEmployeeId(Long employeeId) {
        Specification<Tenure> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Tenure> employeeSpec = (root, query, cb) -> 
            cb.equal(root.get("employee").get("id"), employeeId);
        return findAll(Specification.where(filterSpec).and(employeeSpec));
    }
    
    default List<Tenure> findByIsActiveTrue() {
        Specification<Tenure> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Tenure> activeSpec = (root, query, cb) -> 
            cb.equal(root.get("isActive"), true);
        return findAll(Specification.where(filterSpec).and(activeSpec));
    }
}

