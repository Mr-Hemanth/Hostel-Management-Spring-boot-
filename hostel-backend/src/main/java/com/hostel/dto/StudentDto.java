package com.hostel.dto;

public class StudentDto {
    private Long id;
    private UserDisplayDto user;
    private RoomDto room;

    public StudentDto() {}

    public StudentDto(Long id, UserDisplayDto user, RoomDto room) {
        this.id = id;
        this.user = user;
        this.room = room;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserDisplayDto getUser() {
        return user;
    }

    public void setUser(UserDisplayDto user) {
        this.user = user;
    }

    public RoomDto getRoom() {
        return room;
    }

    public void setRoom(RoomDto room) {
        this.room = room;
    }
}