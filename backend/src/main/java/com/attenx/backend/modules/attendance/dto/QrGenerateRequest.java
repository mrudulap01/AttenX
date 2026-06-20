package com.attenx.backend.modules.attendance.dto;

import java.util.UUID;

public class QrGenerateRequest {
    private UUID subjectId;
    private UUID divisionId;
    private Integer durationMinutes = 15; // default 15 minutes

    public UUID getSubjectId() { return subjectId; }
    public void setSubjectId(UUID subjectId) { this.subjectId = subjectId; }
    public UUID getDivisionId() { return divisionId; }
    public void setDivisionId(UUID divisionId) { this.divisionId = divisionId; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
}
