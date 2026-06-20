package com.attenx.backend.modules.attendance.controller;

import com.attenx.backend.modules.attendance.dto.ReportFilterDTO;
import com.attenx.backend.modules.attendance.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping("/stats")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> getChartData(@RequestBody ReportFilterDTO filter) {
        return ResponseEntity.ok(reportService.getChartData(filter));
    }

    @PostMapping("/export/excel")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<byte[]> exportExcel(@RequestBody ReportFilterDTO filter) throws Exception {
        byte[] excelBytes = reportService.generateExcelReport(filter);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=attendance_report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }

    @PostMapping("/export/pdf")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<byte[]> exportPdf(@RequestBody ReportFilterDTO filter) throws Exception {
        byte[] pdfBytes = reportService.generatePdfReport(filter);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=attendance_report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
