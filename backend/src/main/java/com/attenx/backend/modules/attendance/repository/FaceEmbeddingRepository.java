package com.attenx.backend.modules.attendance.repository;

import com.attenx.backend.modules.attendance.entity.FaceEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FaceEmbeddingRepository extends JpaRepository<FaceEmbedding, UUID> {
    Optional<FaceEmbedding> findByStudentUserId(UUID studentId);
}
