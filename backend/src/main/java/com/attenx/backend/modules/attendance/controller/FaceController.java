package com.attenx.backend.modules.attendance.controller;

import com.attenx.backend.core.security.userdetail.CustomUserDetails;
import com.attenx.backend.modules.attendance.service.FaceService;
import com.attenx.backend.modules.auth.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/face")
public class FaceController {

    @Autowired
    private FaceService faceService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> registerFace(@AuthenticationPrincipal CustomUserDetails userDetails,
                                          @RequestParam("front") MultipartFile front,
                                          @RequestParam("left") MultipartFile left,
                                          @RequestParam("right") MultipartFile right) {
        try {
            faceService.registerFace(userDetails.getUsername(), front, left, right);
            return ResponseEntity.ok(new MessageResponse("Face embedding registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> verifyFace(@AuthenticationPrincipal CustomUserDetails userDetails,
                                        @RequestParam("sessionId") UUID sessionId,
                                        @RequestParam("live_image") MultipartFile liveImage,
                                        @RequestParam(value = "offlineTimestamp", required = false) Long offlineTimestamp) {
        try {
            faceService.verifyAndMarkAttendance(userDetails.getUsername(), sessionId, liveImage, offlineTimestamp);
            return ResponseEntity.ok(new MessageResponse("Attendance marked successfully via Face Recognition"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
