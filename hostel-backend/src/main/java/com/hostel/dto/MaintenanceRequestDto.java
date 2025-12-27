package com.hostel.dto;

import com.hostel.entity.MaintenanceRequest;
import java.time.LocalDateTime;

public class MaintenanceRequestDto {
    private Long id;
    private Long roomId;
    private String roomNumber;
    private Long studentId;
    private String studentName;
    private String description;
    private MaintenanceRequest.Status status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private String remarks;

    // Constructors
    public MaintenanceRequestDto() {}

    public MaintenanceRequestDto(Long id, Long roomId, String roomNumber, Long studentId, String studentName, 
                                String description, MaintenanceRequest.Status status, LocalDateTime createdAt, 
                                LocalDateTime resolvedAt, String remarks) {
        this.id = id;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.studentId = studentId;
        this.studentName = studentName;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
        this.remarks = remarks;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public MaintenanceRequest.Status getStatus() {
        return status;
    }

    public void setStatus(MaintenanceRequest.Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}