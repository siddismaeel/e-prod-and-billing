package com.billing.repository;

import com.billing.entity.Cash;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.billing.util.RepositoryFilterSpecification;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CashRepository extends BaseRepository<Cash, Long> {
    default List<Cash> findByDate(LocalDate date) {
        Specification<Cash> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Cash> dateSpec = (root, query, cb) -> 
            cb.equal(root.get("date"), date);
        return findAll(Specification.where(filterSpec).and(dateSpec));
    }
    
    default List<Cash> findByDateBetween(LocalDate startDate, LocalDate endDate) {
        Specification<Cash> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<Cash> dateSpec = (root, query, cb) -> 
            cb.between(root.get("date"), startDate, endDate);
        return findAll(Specification.where(filterSpec).and(dateSpec));
    }
    
    default List<Cash> findAllByOrderByDateDesc() {
        Specification<Cash> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        return findAll(filterSpec, Sort.by(Sort.Direction.DESC, "date"));
    }
}

