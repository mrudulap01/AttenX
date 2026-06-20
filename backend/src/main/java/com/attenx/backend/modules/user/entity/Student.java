package com.attenx.backend.modules.user.entity;

import com.attenx.backend.modules.academic.entity.Division;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "students", uniqueConstraints = {@UniqueConstraint(columnNames = {"division_id", "enrollment_number"})})
public class Student {

    @Id
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "division_id", nullable = false)
    private Division division;

    @Column(nullable = false, length = 100)
    private String enrollmentNumber;

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Division getDivision() { return division; }
    public void setDivision(Division division) { this.division = division; }
    public String getEnrollmentNumber() { return enrollmentNumber; }
    public void setEnrollmentNumber(String enrollmentNumber) { this.enrollmentNumber = enrollmentNumber; }
}
