package com.attenx.backend.modules.attendance.service;

import com.attenx.backend.core.enums.AttendanceStatus;
import com.attenx.backend.core.enums.AuthMethod;
import com.attenx.backend.core.exception.CustomException;
import com.attenx.backend.modules.academic.entity.Division;
import com.attenx.backend.modules.academic.entity.Subject;
import com.attenx.backend.modules.academic.repository.DivisionRepository;
import com.attenx.backend.modules.academic.repository.SubjectRepository;
import com.attenx.backend.modules.attendance.dto.QrGenerateRequest;
import com.attenx.backend.modules.attendance.dto.QrGenerateResponse;
import com.attenx.backend.modules.attendance.entity.Attendance;
import com.attenx.backend.modules.attendance.entity.AttendanceSession;
import com.attenx.backend.modules.attendance.entity.QrSession;
import com.attenx.backend.modules.attendance.repository.AttendanceRepository;
import com.attenx.backend.modules.attendance.repository.AttendanceSessionRepository;
import com.attenx.backend.modules.attendance.repository.QrSessionRepository;
import com.attenx.backend.modules.user.entity.Student;
import com.attenx.backend.modules.user.entity.Teacher;
import com.attenx.backend.modules.user.repository.StudentRepository;
import com.attenx.backend.modules.user.repository.TeacherRepository;
import com.attenx.backend.modules.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Service
public class AttendanceService {

    @Autowired private AttendanceSessionRepository sessionRepository;
    @Autowired private QrSessionRepository qrSessionRepository;
    @Autowired private AttendanceRepository attendanceRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TeacherRepository teacherRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private SubjectRepository subjectRepository;
    @Autowired private DivisionRepository divisionRepository;

    @Transactional
    public QrGenerateResponse startQrSession(String teacherEmail, QrGenerateRequest request) {
        Teacher teacher = teacherRepository.findByUserEmail(teacherEmail)
                .orElseThrow(() -> new CustomException("Teacher not found"));

        Subject subject = null;
        if (request.getSubjectId() != null && subjectRepository.existsById(request.getSubjectId())) {
            subject = subjectRepository.findById(request.getSubjectId()).get();
        } else {
            subject = subjectRepository.findAll().stream().findFirst().orElseThrow(() -> new CustomException("No Subject available. Please configure subjects."));
        }

        Division division = null;
        if (request.getDivisionId() != null && divisionRepository.existsById(request.getDivisionId())) {
            division = divisionRepository.findById(request.getDivisionId()).get();
        } else {
            division = divisionRepository.findAll().stream().findFirst().orElseThrow(() -> new CustomException("No Division available. Please configure divisions."));
        }

        AttendanceSession session = new AttendanceSession();
        session.setTeacher(teacher);
        session.setSubject(subject);
        session.setDivision(division);
        session.setSessionDate(LocalDate.now());
        session.setStartTime(LocalTime.now());
        session.setEndTime(LocalTime.now().plusMinutes(request.getDurationMinutes()));
        session.setActive(true);
        session = sessionRepository.save(session);

        QrSession qrSession = new QrSession();
        qrSession.setSession(session);
        qrSession.setQrPayload(UUID.randomUUID().toString() + "-" + System.currentTimeMillis());
        qrSession.setExpiresAt(LocalDateTime.now().plusMinutes(request.getDurationMinutes()));
        qrSession = qrSessionRepository.save(qrSession);

        return new QrGenerateResponse(session.getId(), qrSession.getQrPayload(), qrSession.getExpiresAt());
    }

    @Transactional
    public void scanQr(String studentEmail, String qrPayload) {
        Student student = studentRepository.findByUserEmail(studentEmail)
                .orElseThrow(() -> new CustomException("Student not found"));

        QrSession qrSession = qrSessionRepository.findByQrPayload(qrPayload)
                .orElseThrow(() -> new CustomException("Invalid or expired QR code"));

        if (qrSession.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new CustomException("QR Code has expired");
        }

        if (!qrSession.getSession().getActive()) {
            throw new CustomException("Attendance session is no longer active");
        }

        if (attendanceRepository.findBySessionIdAndStudentUserId(qrSession.getSession().getId(), student.getUserId()).isPresent()) {
            throw new CustomException("Attendance already marked for this session");
        }

        Attendance attendance = new Attendance();
        attendance.setSession(qrSession.getSession());
        attendance.setStudent(student);
        attendance.setStatus(AttendanceStatus.PRESENT);
        attendance.setAuthMethod(AuthMethod.QR);
        attendanceRepository.save(attendance);
    }
}
