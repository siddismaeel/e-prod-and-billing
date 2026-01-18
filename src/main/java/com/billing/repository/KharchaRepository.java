package com.billing.repository;

import com.billing.entity.Kharcha;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface KharchaRepository extends BaseRepository<Kharcha, Long> {
    default List<Kharcha> findByEmployeeId(Long employeeId) {
        Specification<Kharcha> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Kharcha> employeeSpec = (root, query, cb) -> 
            cb.equal(root.get("employee").get("id"), employeeId);
        return findAll(Specification.where(filterSpec).and(employeeSpec));
    }
    
    default List<Kharcha> findByTenureId(Long tenureId) {
        Specification<Kharcha> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Kharcha> tenureSpec = (root, query, cb) -> 
            cb.equal(root.get("tenure").get("id"), tenureId);
        return findAll(Specification.where(filterSpec).and(tenureSpec));
    }
    
    default List<Kharcha> findByDate(LocalDate date) {
        Specification<Kharcha> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Kharcha> dateSpec = (root, query, cb) -> 
            cb.equal(root.get("date"), date);
        return findAll(Specification.where(filterSpec).and(dateSpec));
    }
    
    default List<Kharcha> findByEmployeeIdAndDateBetween(Long employeeId, LocalDate startDate, LocalDate endDate) {
        Specification<Kharcha> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Kharcha> employeeSpec = (root, query, cb) -> 
            cb.equal(root.get("employee").get("id"), employeeId);
        Specification<Kharcha> dateSpec = (root, query, cb) -> 
            cb.between(root.get("date"), startDate, endDate);
        return findAll(Specification.where(filterSpec).and(employeeSpec).and(dateSpec));
    }
}

