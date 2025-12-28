package com.hostel.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "room_booking_requests")
public class RoomBookingRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    private String adminRemarks;

    public enum Status {
        PENDING, APPROVED, REJECTED, CANCELLED
    }

    public RoomBookingRequest() {}

    public RoomBookingRequest(Long id, Student student, Room room, Status status, LocalDateTime createdAt, LocalDateTime resolvedAt, String adminRemarks) {
        this.id = id;
        this.student = student;
        this.room = room;
        this.status = status;
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
        this.adminRemarks = adminRemarks;
    }

    public static RoomBookingRequestBuilder builder() {
        return new RoomBookingRequestBuilder();
    }

    public static class RoomBookingRequestBuilder {
        private Long id;
        private Student student;
        private Room room;
        private Status status;
        private LocalDateTime createdAt;
        private LocalDateTime resolvedAt;
        private String adminRemarks;

        public RoomBookingRequestBuilder id(Long id) { this.id = id; return this; }
        public RoomBookingRequestBuilder student(Student student) { this.student = student; return this; }
        public RoomBookingRequestBuilder room(Room room) { this.room = room; return this; }
        public RoomBookingRequestBuilder status(Status status) { this.status = status; return this; }
        public RoomBookingRequestBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public RoomBookingRequestBuilder resolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; return this; }
        public RoomBookingRequestBuilder adminRemarks(String adminRemarks) { this.adminRemarks = adminRemarks; return this; }
        public RoomBookingRequest build() { return new RoomBookingRequest(id, student, room, status, createdAt, resolvedAt, adminRemarks); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    public String getAdminRemarks() { return adminRemarks; }
    public void setAdminRemarks(String adminRemarks) { this.adminRemarks = adminRemarks; }
}