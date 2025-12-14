package com.billing.repository;

import com.billing.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEmployeeId(Long employeeId);
    List<Attendance> findByTenureId(Long tenureId);
    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);
}

