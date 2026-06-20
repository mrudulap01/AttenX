package com.attenx.backend.modules.academic.entity;

import com.attenx.backend.core.entity.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false)
    private Integer durationYears;

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getDurationYears() { return durationYears; }
    public void setDurationYears(Integer durationYears) { this.durationYears = durationYears; }
}
