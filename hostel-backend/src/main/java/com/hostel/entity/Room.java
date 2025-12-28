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

    public Room() {}

    public Room(Long id, String roomNumber, Integer capacity, Boolean occupied) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.capacity = capacity;
        this.occupied = occupied;
    }

    public static RoomBuilder builder() {
        return new RoomBuilder();
    }

    public static class RoomBuilder {
        private Long id;
        private String roomNumber;
        private Integer capacity;
        private Boolean occupied;

        public RoomBuilder id(Long id) { this.id = id; return this; }
        public RoomBuilder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public RoomBuilder capacity(Integer capacity) { this.capacity = capacity; return this; }
        public RoomBuilder occupied(Boolean occupied) { this.occupied = occupied; return this; }
        public Room build() { return new Room(id, roomNumber, capacity, occupied); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setOccupied(Boolean occupied) { this.occupied = occupied; }
    public List<Student> getStudents() { return students; }
    public void setStudents(List<Student> students) { this.students = students; }

    public Boolean getOccupied() {
        if (students == null || students.isEmpty()) {
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
}