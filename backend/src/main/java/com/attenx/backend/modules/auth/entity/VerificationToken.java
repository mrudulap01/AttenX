package com.attenx.backend.modules.auth.entity;

import com.attenx.backend.core.entity.BaseEntity;
import com.attenx.backend.modules.user.entity.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "verification_tokens")
public class VerificationToken extends BaseEntity {

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private Instant expiryDate;

    @Column(nullable = false)
    private String type; // e.g., "EMAIL_VERIFICATION", "PASSWORD_RESET"

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Instant getExpiryDate() { return expiryDate; }
    public void setExpiryDate(Instant expiryDate) { this.expiryDate = expiryDate; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
