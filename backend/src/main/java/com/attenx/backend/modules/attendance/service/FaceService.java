package com.attenx.backend.modules.attendance.service;

import com.attenx.backend.core.enums.AttendanceStatus;
import com.attenx.backend.core.enums.AuthMethod;
import com.attenx.backend.core.exception.CustomException;
import com.attenx.backend.modules.attendance.entity.Attendance;
import com.attenx.backend.modules.attendance.entity.AttendanceSession;
import com.attenx.backend.modules.attendance.entity.FaceEmbedding;
import com.attenx.backend.modules.attendance.repository.AttendanceRepository;
import com.attenx.backend.modules.attendance.repository.AttendanceSessionRepository;
import com.attenx.backend.modules.attendance.repository.FaceEmbeddingRepository;
import com.attenx.backend.modules.user.entity.Student;
import com.attenx.backend.modules.user.repository.StudentRepository;
import com.attenx.backend.modules.user.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.FloatBuffer;
import java.util.List;
import java.util.UUID;

@Service
public class FaceService {

    @Autowired private UserRepository userRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private FaceEmbeddingRepository faceEmbeddingRepository;
    @Autowired private AttendanceSessionRepository sessionRepository;
    @Autowired private AttendanceRepository attendanceRepository;

    private final String AI_SERVICE_URL = "http://localhost:8000/api/v1/ai";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public byte[] floatArrayToByteArray(List<Double> floatList) {
        ByteBuffer buffer = ByteBuffer.allocate(floatList.size() * 4);
        for (Double val : floatList) {
            buffer.putFloat(val.floatValue());
        }
        return buffer.array();
    }

    public List<Double> byteArrayToFloatList(byte[] bytes) {
        FloatBuffer floatBuffer = ByteBuffer.wrap(bytes).asFloatBuffer();
        float[] floatArray = new float[floatBuffer.capacity()];
        floatBuffer.get(floatArray);
        List<Double> list = new java.util.ArrayList<>();
        for (float f : floatArray) {
            list.add((double) f);
        }
        return list;
    }

    @Transactional
    public void registerFace(String studentEmail, MultipartFile front, MultipartFile left, MultipartFile right) throws IOException {
        Student student = studentRepository.findByUserEmail(studentEmail)
                .orElseThrow(() -> new CustomException("Student not found"));

        if (faceEmbeddingRepository.findByStudentUserId(student.getUserId()).isPresent()) {
            throw new CustomException("Face embedding already registered for this student");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("front", new ByteArrayResource(front.getBytes()) {
            @Override public String getFilename() { return "front.jpg"; }
        });
        body.add("left", new ByteArrayResource(left.getBytes()) {
            @Override public String getFilename() { return "left.jpg"; }
        });
        body.add("right", new ByteArrayResource(right.getBytes()) {
            @Override public String getFilename() { return "right.jpg"; }
        });

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(AI_SERVICE_URL + "/register", requestEntity, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            List<Double> embeddingList = objectMapper.convertValue(root.get("embedding"), new TypeReference<List<Double>>() {});
            
            FaceEmbedding embedding = new FaceEmbedding();
            embedding.setStudent(student);
            embedding.setEmbeddingVector(floatArrayToByteArray(embeddingList));
            embedding.setImageUrl("local_storage"); // Mock storage
            faceEmbeddingRepository.save(embedding);
            
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            try {
                JsonNode errorNode = objectMapper.readTree(e.getResponseBodyAsString());
                throw new CustomException(errorNode.get("detail").asText());
            } catch(Exception ex) {
                throw new CustomException("AI Service Error: " + e.getMessage());
            }
        } catch (Exception e) {
            if (e instanceof CustomException) throw (CustomException) e;
            throw new CustomException("Failed to contact AI Service. Ensure it is running.");
        }
    }

    @Transactional
    public void verifyAndMarkAttendance(String studentEmail, UUID sessionId, MultipartFile liveImage, Long offlineTimestamp) throws IOException {
        Student student = studentRepository.findByUserEmail(studentEmail)
                .orElseThrow(() -> new CustomException("Student not found"));

        FaceEmbedding faceEmbedding = faceEmbeddingRepository.findByStudentUserId(student.getUserId())
                .orElseThrow(() -> new CustomException("No face registered for this student. Please register your face first."));

        AttendanceSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new CustomException("Session not found"));

        if (offlineTimestamp != null) {
            // Check if the offline scan timestamp is within the session start/end time.
            // A simple implementation: assume session is valid if timestamp is within 15 minutes of start.
            // Since we don't have exact end times stored dynamically yet, we just ensure it's not a future timestamp
            // and it was scanned after session creation.
            long sessionTimeMs = session.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli();
            if (offlineTimestamp < sessionTimeMs || offlineTimestamp > System.currentTimeMillis()) {
                throw new CustomException("Offline attendance timestamp is invalid or manipulated.");
            }
        } else {
            // Real-time check
            if (!session.getActive()) {
                throw new CustomException("Attendance session is no longer active");
            }
        }

        if (attendanceRepository.findBySessionIdAndStudentUserId(sessionId, student.getUserId()).isPresent()) {
            throw new CustomException("Attendance already marked for this session");
        }

        List<Double> storedEmbeddingList = byteArrayToFloatList(faceEmbedding.getEmbeddingVector());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("live_image", new ByteArrayResource(liveImage.getBytes()) {
            @Override public String getFilename() { return "live.jpg"; }
        });
        body.add("stored_embedding", objectMapper.writeValueAsString(storedEmbeddingList));

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(AI_SERVICE_URL + "/verify", requestEntity, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            boolean verified = root.get("verified").asBoolean();
            double similarity = root.get("similarity").asDouble();

            if (!verified) {
                throw new CustomException("Face verification failed. Similarity: " + Math.round(similarity * 100) + "%");
            }

            Attendance attendance = new Attendance();
            attendance.setSession(session);
            attendance.setStudent(student);
            attendance.setStatus(AttendanceStatus.PRESENT);
            attendance.setAuthMethod(AuthMethod.FACE);
            attendance.setConfidenceScore(java.math.BigDecimal.valueOf(similarity));
            attendanceRepository.save(attendance);

        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            try {
                JsonNode errorNode = objectMapper.readTree(e.getResponseBodyAsString());
                throw new CustomException(errorNode.get("detail").asText());
            } catch(Exception ex) {
                throw new CustomException("AI Service Error: " + e.getMessage());
            }
        } catch (Exception e) {
            if (e instanceof CustomException) throw (CustomException) e;
            throw new CustomException("Failed to contact AI Service. Ensure it is running.");
        }
    }
}
