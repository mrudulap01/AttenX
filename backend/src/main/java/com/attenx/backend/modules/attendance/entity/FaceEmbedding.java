package com.attenx.backend.modules.attendance.entity;

import com.attenx.backend.core.entity.BaseEntity;
import com.attenx.backend.modules.user.entity.Student;
import jakarta.persistence.*;

@Entity
@Table(name = "face_embeddings")
public class FaceEmbedding extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private Student student;

    @Column(nullable = false)
    private byte[] embeddingVector;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String imageUrl;

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public byte[] getEmbeddingVector() { return embeddingVector; }
    public void setEmbeddingVector(byte[] embeddingVector) { this.embeddingVector = embeddingVector; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
