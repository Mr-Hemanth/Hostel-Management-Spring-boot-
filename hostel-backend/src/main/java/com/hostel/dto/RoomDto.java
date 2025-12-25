package com.hostel.dto;

public class RoomDto {
    private String roomNumber;
    private Integer capacity;
    private Boolean occupied;

    // Constructors
    public RoomDto() {}

    public RoomDto(String roomNumber, Integer capacity) {
        this.roomNumber = roomNumber;
        this.capacity = capacity;
        this.occupied = false;
    }

    // Getters and Setters
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
        return occupied;
    }

    public void setOccupied(Boolean occupied) {
        this.occupied = occupied;
    }
}