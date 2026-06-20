package com.attenx.backend.modules.auth.service;

import com.attenx.backend.core.enums.UserRole;
import com.attenx.backend.core.exception.CustomException;
import com.attenx.backend.core.security.jwt.JwtUtils;
import com.attenx.backend.core.security.userdetail.CustomUserDetails;
import com.attenx.backend.modules.academic.entity.College;
import com.attenx.backend.modules.academic.repository.CollegeRepository;
import com.attenx.backend.modules.auth.dto.LoginRequest;
import com.attenx.backend.modules.auth.dto.RegisterRequest;
import com.attenx.backend.modules.auth.dto.TokenResponse;
import com.attenx.backend.modules.auth.entity.RefreshToken;
import com.attenx.backend.modules.auth.entity.VerificationToken;
import com.attenx.backend.modules.auth.repository.RefreshTokenRepository;
import com.attenx.backend.modules.auth.repository.VerificationTokenRepository;
import com.attenx.backend.modules.user.entity.User;
import com.attenx.backend.modules.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserRepository userRepository;
    @Autowired private CollegeRepository collegeRepository;
    @Autowired private PasswordEncoder encoder;
    @Autowired private JwtUtils jwtUtils;
    @Autowired private RefreshTokenRepository refreshTokenRepository;
    @Autowired private VerificationTokenRepository verificationTokenRepository;

    @Value("${jwt.refreshExpirationMs}")
    private Long refreshExpirationMs;

    @Transactional
    public TokenResponse login(LoginRequest request, StringBuilder outRefreshToken) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(auth);
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        String jwt = jwtUtils.generateJwtToken(userDetails.getUsername());
        
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        
        // Generate Refresh Token
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        long expiry = request.isRememberMe() ? refreshExpirationMs * 4 : refreshExpirationMs; // 1 month if remember me
        refreshToken.setExpiryDate(Instant.now().plusMillis(expiry));
        refreshTokenRepository.save(refreshToken);
        
        outRefreshToken.append(refreshToken.getToken());

        String role = userDetails.getAuthorities().stream().findFirst().get().getAuthority();
        return new TokenResponse(jwt, role, user.getEmail(), user.getFirstName());
    }

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException("Error: Email is already in use!");
        }

        College college;
        try {
            college = collegeRepository.findById(request.getCollegeId())
                    .orElseGet(() -> collegeRepository.findAll().stream().findFirst().orElse(null));
        } catch (Exception e) {
            college = null;
        }
        
        if (college == null) {
            College newCollege = new College();
            newCollege.setName("Demo University");
            newCollege.setAddress("123 Education Lane");
            newCollege.setContactEmail("admin@demo.edu");
            college = collegeRepository.save(newCollege);
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(encoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setCollege(college);
        user.setEmailVerified(false);

        userRepository.save(user);

        // Generate Verification Token
        VerificationToken token = new VerificationToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setType("EMAIL_VERIFICATION");
        token.setExpiryDate(Instant.now().plusSeconds(86400)); // 24 hours
        verificationTokenRepository.save(token);

        // MOCK EMAIL SENDING
        System.out.println("\n\n========================================");
        System.out.println("MOCK EMAIL SENT TO: " + user.getEmail());
        System.out.println("Subject: Verify your AttenX Account");
        System.out.println("Click link: http://localhost:8080/api/v1/auth/verify?token=" + token.getToken());
        System.out.println("========================================\n\n");
    }

    @Transactional
    public void verifyEmail(String token) {
        VerificationToken vToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new CustomException("Invalid verification token"));

        if (vToken.getExpiryDate().compareTo(Instant.now()) < 0) {
            throw new CustomException("Token has expired");
        }

        User user = vToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        verificationTokenRepository.delete(vToken);
    }

    @Transactional
    public TokenResponse refreshToken(String requestRefreshToken) {
        return refreshTokenRepository.findByToken(requestRefreshToken)
                .map(token -> {
                    if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
                        refreshTokenRepository.delete(token);
                        throw new CustomException("Refresh token was expired. Please make a new signin request");
                    }
                    return token;
                })
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtUtils.generateJwtToken(user.getEmail());
                    return new TokenResponse(token, "ROLE_" + user.getRole().name(), user.getEmail(), user.getFirstName());
                })
                .orElseThrow(() -> new CustomException("Refresh token is not in database!"));
    }

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("User not found"));

        VerificationToken token = new VerificationToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setType("PASSWORD_RESET");
        token.setExpiryDate(Instant.now().plusSeconds(900)); // 15 minutes
        verificationTokenRepository.save(token);

        System.out.println("\n\n========================================");
        System.out.println("MOCK EMAIL SENT TO: " + user.getEmail());
        System.out.println("Subject: Reset your AttenX Password");
        System.out.println("Reset Link: http://localhost:5173/reset-password?token=" + token.getToken());
        System.out.println("========================================\n\n");
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        VerificationToken vToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new CustomException("Invalid reset token"));

        if (vToken.getExpiryDate().compareTo(Instant.now()) < 0) {
            throw new CustomException("Token has expired");
        }
        if (!"PASSWORD_RESET".equals(vToken.getType())) {
            throw new CustomException("Invalid token type");
        }

        User user = vToken.getUser();
        user.setPasswordHash(encoder.encode(newPassword));
        userRepository.save(user);
        verificationTokenRepository.delete(vToken);
    }
}
