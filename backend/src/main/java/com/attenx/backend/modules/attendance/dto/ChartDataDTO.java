package com.attenx.backend.modules.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChartDataDTO {
    private String label; // e.g., "Monday", "Week 1", "Computer Science"
    private Long presentCount;
    private Long absentCount;
    private Double averageSimilarity;
}
