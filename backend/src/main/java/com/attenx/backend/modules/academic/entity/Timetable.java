package com.attenx.backend.modules.academic.entity;

import com.attenx.backend.core.entity.BaseEntity;
import com.attenx.backend.core.enums.DayOfWeek;
import com.attenx.backend.modules.user.entity.Teacher;
import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "timetable")
public class Timetable extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "division_id", nullable = false)
    private Division division;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek day;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    public Division getDivision() { return division; }
    public void setDivision(Division division) { this.division = division; }
    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }
    public Teacher getTeacher() { return teacher; }
    public void setTeacher(Teacher teacher) { this.teacher = teacher; }
    public DayOfWeek getDay() { return day; }
    public void setDay(DayOfWeek day) { this.day = day; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
}
