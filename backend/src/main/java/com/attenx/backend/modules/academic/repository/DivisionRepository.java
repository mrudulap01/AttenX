package com.attenx.backend.modules.academic.repository;

import com.attenx.backend.modules.academic.entity.Division;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DivisionRepository extends JpaRepository<Division, UUID> {
}
