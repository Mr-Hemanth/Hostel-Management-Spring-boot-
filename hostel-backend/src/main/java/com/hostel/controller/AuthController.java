package com.hostel.controller;

import com.hostel.dto.AuthRequest;
import com.hostel.dto.AuthResponse;
import com.hostel.dto.UserDto;
import com.hostel.entity.User;
import com.hostel.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticateUser(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto) {
        User user = authService.registerUser(userDto);
        return ResponseEntity.ok("User registered successfully");
    }
}