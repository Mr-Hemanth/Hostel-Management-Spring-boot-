package com.hostel.dto;

public class AuthResponse {

    private String token;
    private String message;
    private String role;

    public AuthResponse() {}

    public AuthResponse(String token, String message, String role) {
        this.token = token;
        this.message = message;
        this.role = role;
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
}