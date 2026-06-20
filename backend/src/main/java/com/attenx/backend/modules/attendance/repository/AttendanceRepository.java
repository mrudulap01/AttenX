package com.attenx.backend.modules.attendance.repository;

import com.attenx.backend.modules.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {
    Optional<Attendance> findBySessionIdAndStudentUserId(UUID sessionId, UUID studentId);
    
    @org.springframework.data.jpa.repository.Query("SELECT a FROM Attendance a WHERE a.createdAt >= :startDate AND a.createdAt <= :endDate")
    java.util.List<Attendance> findAttendancesWithinRange(@org.springframework.data.repository.query.Param("startDate") java.util.Date startDate, @org.springframework.data.repository.query.Param("endDate") java.util.Date endDate);
}
