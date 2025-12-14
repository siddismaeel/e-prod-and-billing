package com.billing.repository;

import com.billing.entity.Cash;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CashRepository extends JpaRepository<Cash, Long> {
    List<Cash> findByDate(LocalDate date);
    List<Cash> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<Cash> findAllByOrderByDateDesc();
}

