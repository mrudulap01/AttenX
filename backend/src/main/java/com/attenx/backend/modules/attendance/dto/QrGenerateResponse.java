package com.attenx.backend.modules.attendance.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class QrGenerateResponse {
    private UUID sessionId;
    private String qrPayload;
    private LocalDateTime expiresAt;

    public QrGenerateResponse(UUID sessionId, String qrPayload, LocalDateTime expiresAt) {
        this.sessionId = sessionId;
        this.qrPayload = qrPayload;
        this.expiresAt = expiresAt;
    }

    public UUID getSessionId() { return sessionId; }
    public void setSessionId(UUID sessionId) { this.sessionId = sessionId; }
    public String getQrPayload() { return qrPayload; }
    public void setQrPayload(String qrPayload) { this.qrPayload = qrPayload; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}
