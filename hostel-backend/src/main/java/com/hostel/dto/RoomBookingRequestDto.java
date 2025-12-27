package com.hostel.dto;

import com.hostel.entity.RoomBookingRequest;
import java.time.LocalDateTime;

public class RoomBookingRequestDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private Long roomId;
    private String roomNumber;
    private Integer roomCapacity;
    private RoomBookingRequest.Status status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private String adminRemarks;

    // Constructors
    public RoomBookingRequestDto() {}

    public RoomBookingRequestDto(Long id, Long studentId, String studentName, String studentEmail, 
                                Long roomId, String roomNumber, Integer roomCapacity, 
                                RoomBookingRequest.Status status, LocalDateTime createdAt, 
                                LocalDateTime resolvedAt, String adminRemarks) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.roomCapacity = roomCapacity;
        this.status = status;
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
        this.adminRemarks = adminRemarks;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
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

    public Integer getRoomCapacity() {
        return roomCapacity;
    }

    public void setRoomCapacity(Integer roomCapacity) {
        this.roomCapacity = roomCapacity;
    }

    public RoomBookingRequest.Status getStatus() {
        return status;
    }

    public void setStatus(RoomBookingRequest.Status status) {
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

    public String getAdminRemarks() {
        return adminRemarks;
    }

    public void setAdminRemarks(String adminRemarks) {
        this.adminRemarks = adminRemarks;
    }
}