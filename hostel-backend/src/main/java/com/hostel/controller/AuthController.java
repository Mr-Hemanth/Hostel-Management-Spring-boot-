package com.hostel.controller;

import com.hostel.dto.AuthRequest;
import com.hostel.dto.AuthResponse;
import com.hostel.dto.UserDto;
import com.hostel.entity.User;
import com.hostel.service.AuthService;
import com.hostel.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticateUser(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserDto userDto) {
        AuthResponse response = authService.register(userDto);
        return ResponseEntity.ok(response);
    }
}