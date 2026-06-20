package com.attenx.backend.modules.academic.entity;

import com.attenx.backend.core.entity.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "divisions")
public class Division extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false)
    private Integer academicYear;

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getAcademicYear() { return academicYear; }
    public void setAcademicYear(Integer academicYear) { this.academicYear = academicYear; }
}
