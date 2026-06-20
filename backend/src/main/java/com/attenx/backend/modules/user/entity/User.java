package com.attenx.backend.modules.user.entity;

import com.attenx.backend.core.entity.BaseEntity;
import com.attenx.backend.core.enums.UserRole;
import com.attenx.backend.modules.academic.entity.College;
import jakarta.persistence.*;

@Entity
@Table(name = "users", uniqueConstraints = {@UniqueConstraint(columnNames = {"college_id", "email"})})
public class User extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false)
    private Boolean isEmailVerified = false;

    public College getCollege() { return college; }
    public void setCollege(College college) { this.college = college; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public Boolean getActive() { return isActive; }
    public void setActive(Boolean active) { isActive = active; }
    public Boolean getEmailVerified() { return isEmailVerified; }
    public void setEmailVerified(Boolean emailVerified) { isEmailVerified = emailVerified; }
}
