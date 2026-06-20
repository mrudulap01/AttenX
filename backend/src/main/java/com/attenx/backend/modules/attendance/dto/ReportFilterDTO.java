package com.attenx.backend.modules.attendance.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class ReportFilterDTO {
    private String timeframe; // "DAILY", "WEEKLY", "MONTHLY", "OVERALL"
    private String groupBy; // "DEPARTMENT", "SUBJECT", "TEACHER", "STUDENT"
    private UUID entityId; // Optional specific ID
}
