package com.attenx.backend.modules.misc.entity;

import com.attenx.backend.core.entity.BaseEntity;
import com.attenx.backend.modules.user.entity.User;
import jakarta.persistence.*;

@Entity
@Table(name = "reports")
public class Report extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generated_by", nullable = false)
    private User generatedBy;

    @Column(nullable = false, length = 50)
    private String reportType;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String s3Url;

    public User getGeneratedBy() { return generatedBy; }
    public void setGeneratedBy(User generatedBy) { this.generatedBy = generatedBy; }
    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }
    public String getS3Url() { return s3Url; }
    public void setS3Url(String s3Url) { this.s3Url = s3Url; }
}
