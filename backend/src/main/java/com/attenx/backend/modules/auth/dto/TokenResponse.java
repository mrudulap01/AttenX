package com.attenx.backend.modules.auth.dto;

public class TokenResponse {
    private String accessToken;
    private String role;
    private String email;
    private String firstName;

    public TokenResponse(String accessToken, String role, String email, String firstName) {
        this.accessToken = accessToken;
        this.role = role;
        this.email = email;
        this.firstName = firstName;
    }

    public String getAccessToken() { return accessToken; }
    public String getRole() { return role; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
}
