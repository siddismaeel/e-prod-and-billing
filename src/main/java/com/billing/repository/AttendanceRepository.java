package com.billing.repository;

import com.billing.entity.Attendance;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends BaseRepository<Attendance, Long> {
    default List<Attendance> findByEmployeeId(Long employeeId) {
        Specification<Attendance> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Attendance> employeeSpec = (root, query, cb) -> 
            cb.equal(root.get("employee").get("id"), employeeId);
        return findAll(Specification.where(filterSpec).and(employeeSpec));
    }
    
    default List<Attendance> findByTenureId(Long tenureId) {
        Specification<Attendance> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Attendance> tenureSpec = (root, query, cb) -> 
            cb.equal(root.get("tenure").get("id"), tenureId);
        return findAll(Specification.where(filterSpec).and(tenureSpec));
    }
    
    default List<Attendance> findByDate(LocalDate date) {
        Specification<Attendance> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Attendance> dateSpec = (root, query, cb) -> 
            cb.equal(root.get("date"), date);
        return findAll(Specification.where(filterSpec).and(dateSpec));
    }
    
    default List<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date) {
        Specification<Attendance> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Attendance> employeeSpec = (root, query, cb) -> 
            cb.equal(root.get("employee").get("id"), employeeId);
        Specification<Attendance> dateSpec = (root, query, cb) -> 
            cb.equal(root.get("date"), date);
        return findAll(Specification.where(filterSpec).and(employeeSpec).and(dateSpec));
    }
}

