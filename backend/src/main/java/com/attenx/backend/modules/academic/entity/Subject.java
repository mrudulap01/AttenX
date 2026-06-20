package com.attenx.backend.modules.academic.entity;

import com.attenx.backend.core.entity.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "subjects")
public class Subject extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 50)
    private String code;

    @Column(nullable = false)
    private Integer credits = 3;

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }
}
