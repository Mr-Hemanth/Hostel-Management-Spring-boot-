package com.hostel.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_requests")
public class MaintenanceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @Column(nullable = false)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    private String remarks;
    
    public enum Status {
        PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    }

    public MaintenanceRequest() {}

    public MaintenanceRequest(Long id, Room room, Student student, String description, Status status, LocalDateTime createdAt, LocalDateTime resolvedAt, String remarks) {
        this.id = id;
        this.room = room;
        this.student = student;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
        this.remarks = remarks;
    }

    public static MaintenanceRequestBuilder builder() {
        return new MaintenanceRequestBuilder();
    }

    public static class MaintenanceRequestBuilder {
        private Long id;
        private Room room;
        private Student student;
        private String description;
        private Status status;
        private LocalDateTime createdAt;
        private LocalDateTime resolvedAt;
        private String remarks;

        public MaintenanceRequestBuilder id(Long id) { this.id = id; return this; }
        public MaintenanceRequestBuilder room(Room room) { this.room = room; return this; }
        public MaintenanceRequestBuilder student(Student student) { this.student = student; return this; }
        public MaintenanceRequestBuilder description(String description) { this.description = description; return this; }
        public MaintenanceRequestBuilder status(Status status) { this.status = status; return this; }
        public MaintenanceRequestBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public MaintenanceRequestBuilder resolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; return this; }
        public MaintenanceRequestBuilder remarks(String remarks) { this.remarks = remarks; return this; }
        public MaintenanceRequest build() { return new MaintenanceRequest(id, room, student, description, status, createdAt, resolvedAt, remarks); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}