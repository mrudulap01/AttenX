package com.attenx.backend.modules.attendance.controller;

import com.attenx.backend.core.security.userdetail.CustomUserDetails;
import com.attenx.backend.modules.attendance.dto.QrGenerateRequest;
import com.attenx.backend.modules.attendance.dto.QrScanRequest;
import com.attenx.backend.modules.attendance.service.AttendanceService;
import com.attenx.backend.modules.auth.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/qr/start")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> startQrSession(@AuthenticationPrincipal CustomUserDetails userDetails,
                                            @RequestBody QrGenerateRequest request) {
        return ResponseEntity.ok(attendanceService.startQrSession(userDetails.getUsername(), request));
    }

    @PostMapping("/qr/scan")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> scanQr(@AuthenticationPrincipal CustomUserDetails userDetails,
                                    @RequestBody QrScanRequest request) {
        attendanceService.scanQr(userDetails.getUsername(), request.getQrPayload());
        return ResponseEntity.ok(new MessageResponse("Attendance marked successfully via QR"));
    }
}
