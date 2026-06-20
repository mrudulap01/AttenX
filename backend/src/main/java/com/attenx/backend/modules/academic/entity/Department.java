package com.attenx.backend.modules.academic.entity;

import com.attenx.backend.core.entity.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "departments")
public class Department extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @Column(nullable = false, length = 150)
    private String name;

    public College getCollege() { return college; }
    public void setCollege(College college) { this.college = college; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
