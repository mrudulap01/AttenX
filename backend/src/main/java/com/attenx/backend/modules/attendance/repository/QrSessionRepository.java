package com.attenx.backend.modules.attendance.repository;

import com.attenx.backend.modules.attendance.entity.QrSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface QrSessionRepository extends JpaRepository<QrSession, UUID> {
    Optional<QrSession> findByQrPayload(String qrPayload);
}
