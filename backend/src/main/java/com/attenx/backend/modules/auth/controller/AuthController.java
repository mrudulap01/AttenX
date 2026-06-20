package com.attenx.backend.modules.auth.controller;

import com.attenx.backend.modules.auth.dto.LoginRequest;
import com.attenx.backend.modules.auth.dto.MessageResponse;
import com.attenx.backend.modules.auth.dto.RegisterRequest;
import com.attenx.backend.modules.auth.dto.TokenResponse;
import com.attenx.backend.modules.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        StringBuilder refreshToken = new StringBuilder();
        TokenResponse response = authService.login(loginRequest, refreshToken);
        
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken.toString())
                .httpOnly(true)
                .secure(false) // Set to true in production with HTTPS
                .path("/api/v1/auth/refresh")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        authService.register(signUpRequest);
        return ResponseEntity.ok(new MessageResponse("User registered successfully. Please check your email to verify."));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(new MessageResponse("Email verified successfully. You can now login."));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken") String refreshToken) {
        if (refreshToken != null && !refreshToken.isEmpty()) {
            TokenResponse response = authService.refreshToken(refreshToken);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(new MessageResponse("Refresh Token is empty!"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody com.attenx.backend.modules.auth.dto.ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok(new MessageResponse("Password reset link sent to your email."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody com.attenx.backend.modules.auth.dto.ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(new MessageResponse("Password successfully reset. You can now login."));
    }
}
