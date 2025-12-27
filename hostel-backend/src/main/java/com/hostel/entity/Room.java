package com.hostel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.util.List;

@Entity
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_number", nullable = false, unique = true)
    @NotBlank(message = "Room number cannot be blank")
    @Size(min = 1, max = 50, message = "Room number must be between 1 and 50 characters")
    private String roomNumber;

    @Column(nullable = false)
    @NotNull(message = "Capacity cannot be null")
    @Min(value = 1, message = "Capacity must be at least 1")
    @Max(value = 100, message = "Capacity cannot exceed 100")
    private Integer capacity;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean occupied = false;

    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY)
    private List<Student> students;

    // Constructors
    public Room() {}

    public Room(String roomNumber, Integer capacity) {
        this.roomNumber = roomNumber;
        this.capacity = capacity;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Boolean getOccupied() {
        // Room is occupied if the number of students equals or exceeds the capacity
        if (students == null) {
            return false;
        }
        return students.size() >= capacity;
    }
    
    public void updateOccupiedStatus() {
        if (students == null) {
            this.occupied = false;
        } else {
            this.occupied = students.size() >= capacity;
        }
    }

    // Note: occupied is calculated based on student count vs capacity, so no setter needed
    // public void setOccupied(Boolean occupied) {
    //     this.occupied = occupied;
    // }

    // Note: This method is deprecated since Room now has a one-to-many relationship with Students
    // Use getStudents() instead to get all students in this room
    public Student getStudent() {
        // Return the first student if any exist
        if (students != null && !students.isEmpty()) {
            return students.get(0);
        }
        return null;
    }

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }
}