package com.billing.repository;

import com.billing.entity.Tenure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenureRepository extends JpaRepository<Tenure, Long> {
    List<Tenure> findByEmployeeId(Long employeeId);
    List<Tenure> findByIsActiveTrue();
}

