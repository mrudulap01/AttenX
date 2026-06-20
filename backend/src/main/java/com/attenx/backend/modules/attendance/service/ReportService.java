package com.attenx.backend.modules.attendance.service;

import com.attenx.backend.core.enums.AttendanceStatus;
import com.attenx.backend.modules.attendance.dto.ChartDataDTO;
import com.attenx.backend.modules.attendance.dto.ReportFilterDTO;
import com.attenx.backend.modules.attendance.entity.Attendance;
import com.attenx.backend.modules.attendance.repository.AttendanceRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    public List<ChartDataDTO> getChartData(ReportFilterDTO filter) {
        // Fetch all for now. In production, respect the timeframe filter using Dates.
        Calendar cal = Calendar.getInstance();
        Date endDate = cal.getTime();
        cal.add(Calendar.DAY_OF_YEAR, -30);
        Date startDate = cal.getTime();
        
        List<Attendance> records = attendanceRepository.findAttendancesWithinRange(startDate, endDate);
        
        // Grouping
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Map<String, List<Attendance>> grouped = new HashMap<>();

        for (Attendance a : records) {
            String key;
            if ("DEPARTMENT".equalsIgnoreCase(filter.getGroupBy())) {
                key = a.getStudent().getDivision().getCourse().getDepartment().getName();
            } else if ("STUDENT".equalsIgnoreCase(filter.getGroupBy())) {
                key = a.getStudent().getUser().getFirstName() + " " + a.getStudent().getUser().getLastName();
            } else {
                key = sdf.format(a.getCreatedAt()); // Default Daily
            }
            grouped.computeIfAbsent(key, k -> new ArrayList<>()).add(a);
        }

        List<ChartDataDTO> chartData = new ArrayList<>();
        for (Map.Entry<String, List<Attendance>> entry : grouped.entrySet()) {
            long present = entry.getValue().stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
            long absent = entry.getValue().stream().filter(a -> a.getStatus() == AttendanceStatus.ABSENT).count();
            
            double sumSim = entry.getValue().stream()
                .filter(a -> a.getConfidenceScore() != null)
                .mapToDouble(a -> a.getConfidenceScore().doubleValue())
                .sum();
            long simCount = entry.getValue().stream().filter(a -> a.getConfidenceScore() != null).count();
            double avgSim = simCount > 0 ? sumSim / simCount : 0.0;
            
            chartData.add(new ChartDataDTO(entry.getKey(), present, absent, avgSim));
        }

        // Sort if date
        if ("DAILY".equalsIgnoreCase(filter.getTimeframe()) || filter.getGroupBy() == null) {
            chartData.sort(Comparator.comparing(ChartDataDTO::getLabel));
        }

        return chartData;
    }

    public byte[] generateExcelReport(ReportFilterDTO filter) throws Exception {
        List<ChartDataDTO> data = getChartData(filter);
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Attendance Report");

            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Group");
            headerRow.createCell(1).setCellValue("Present");
            headerRow.createCell(2).setCellValue("Absent");
            headerRow.createCell(3).setCellValue("Avg AI Confidence");

            int rowIdx = 1;
            for (ChartDataDTO row : data) {
                Row dataRow = sheet.createRow(rowIdx++);
                dataRow.createCell(0).setCellValue(row.getLabel());
                dataRow.createCell(1).setCellValue(row.getPresentCount());
                dataRow.createCell(2).setCellValue(row.getAbsentCount());
                dataRow.createCell(3).setCellValue(row.getAverageSimilarity());
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] generatePdfReport(ReportFilterDTO filter) throws Exception {
        List<ChartDataDTO> data = getChartData(filter);
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            document.add(new Paragraph("AttenX Attendance Report"));
            document.add(new Paragraph("Group By: " + (filter.getGroupBy() != null ? filter.getGroupBy() : "DAILY")));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(4);
            table.addCell("Group");
            table.addCell("Present");
            table.addCell("Absent");
            table.addCell("Avg AI Confidence");

            for (ChartDataDTO row : data) {
                table.addCell(row.getLabel());
                table.addCell(String.valueOf(row.getPresentCount()));
                table.addCell(String.valueOf(row.getAbsentCount()));
                table.addCell(String.format("%.2f", row.getAverageSimilarity()));
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        }
    }
}
