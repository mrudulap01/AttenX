package com.attenx.backend.modules.attendance.dto;

import jakarta.validation.constraints.NotBlank;

public class QrScanRequest {
    @NotBlank(message = "QR Payload is required")
    private String qrPayload;

    public String getQrPayload() { return qrPayload; }
    public void setQrPayload(String qrPayload) { this.qrPayload = qrPayload; }
}
