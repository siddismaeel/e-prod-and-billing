package com.billing.repository;

import com.billing.entity.Kharcha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface KharchaRepository extends JpaRepository<Kharcha, Long> {
    List<Kharcha> findByEmployeeId(Long employeeId);
    List<Kharcha> findByTenureId(Long tenureId);
    List<Kharcha> findByDate(LocalDate date);
    List<Kharcha> findByEmployeeIdAndDateBetween(Long employeeId, LocalDate startDate, LocalDate endDate);
}

