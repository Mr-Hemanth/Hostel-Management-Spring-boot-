package com.hostel.dto;

public class StudentSummaryDto {
    private Long id;
    private UserDisplayDto user;

    public StudentSummaryDto() {}

    public StudentSummaryDto(Long id, UserDisplayDto user) {
        this.id = id;
        this.user = user;
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
}