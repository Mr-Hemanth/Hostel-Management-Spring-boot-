package com.hostel.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class RoomDto {
    private Long id;
    
    @NotBlank(message = "Room number cannot be blank")
    @Size(min = 1, max = 50, message = "Room number must be between 1 and 50 characters")
    private String roomNumber;
    
    @NotNull(message = "Capacity cannot be null")
    @Min(value = 1, message = "Capacity must be at least 1")
    @Max(value = 100, message = "Capacity cannot exceed 100")
    private Integer capacity;
    
    private Boolean occupied;
    private List<StudentSummaryDto> students;
    
    public RoomDto() {}
    
    public RoomDto(Long id, String roomNumber, Integer capacity, Boolean occupied) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.capacity = capacity;
        this.occupied = occupied;
    }
    
    public RoomDto(Long id, String roomNumber, Integer capacity, Boolean occupied, List<StudentSummaryDto> students) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.capacity = capacity;
        this.occupied = occupied;
        this.students = students;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public Boolean getOccupied() { return occupied; }
    public void setOccupied(Boolean occupied) { this.occupied = occupied; }
    
    public List<StudentSummaryDto> getStudents() { return students; }
    public void setStudents(List<StudentSummaryDto> students) { this.students = students; }
}