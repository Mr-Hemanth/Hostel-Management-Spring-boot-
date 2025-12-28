package com.hostel.dto;

public class AuthResponse {

    private String token;
    private String message;
    private String role;
    private Long userId;
    private Long studentId;

    public AuthResponse() {}

    public AuthResponse(String token, String message, String role, Long userId, Long studentId) {
        this.token = token;
        this.message = message;
        this.role = role;
        this.userId = userId;
        this.studentId = studentId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
}