package com.attenx.backend.modules.attendance.entity;

import com.attenx.backend.core.entity.BaseEntity;
import com.attenx.backend.core.enums.AttendanceStatus;
import com.attenx.backend.core.enums.AuthMethod;
import com.attenx.backend.modules.user.entity.Student;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "attendance", uniqueConstraints = {@UniqueConstraint(columnNames = {"session_id", "student_id"})})
public class Attendance extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private AttendanceSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthMethod authMethod;

    @Column(precision = 5, scale = 4)
    private BigDecimal confidenceScore;

    public AttendanceSession getSession() { return session; }
    public void setSession(AttendanceSession session) { this.session = session; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }
    public AuthMethod getAuthMethod() { return authMethod; }
    public void setAuthMethod(AuthMethod authMethod) { this.authMethod = authMethod; }
    public BigDecimal getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(BigDecimal confidenceScore) { this.confidenceScore = confidenceScore; }
}
