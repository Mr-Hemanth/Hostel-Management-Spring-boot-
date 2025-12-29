package com.hostel.service;

import com.hostel.dto.AuthRequest;
import com.hostel.dto.AuthResponse;
import com.hostel.dto.UserDto;
import com.hostel.entity.Role;
import com.hostel.entity.User;
import com.hostel.repository.UserRepository;
import com.hostel.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;
    private final StudentService studentService;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder, StudentService studentService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.studentService = studentService;
    }

    public AuthResponse authenticateUser(AuthRequest authRequest) {
        System.out.println("Attempting login for email: " + authRequest.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getEmail(),
                            authRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            User user = (User) authentication.getPrincipal();
            System.out.println("User authenticated: " + user.getEmail() + " with role: " + user.getRole());
            
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
            
            Long studentId = null;
            if (Role.STUDENT.equals(user.getRole())) {
                com.hostel.entity.Student student = studentService.getStudentByUserId(user.getId());
                if (student != null) {
                    studentId = student.getId();
                }
            }
            
            return new AuthResponse(token, "Login successful", user.getRole().name(), user.getId(), studentId);
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            System.err.println("Invalid credentials for: " + authRequest.getEmail());
            throw e;
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    public AuthResponse register(UserDto userDto) {
        User savedUser = registerUser(userDto);
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole().name());
        
        Long studentId = null;
        if (Role.STUDENT.equals(savedUser.getRole())) {
            com.hostel.entity.Student student = studentService.getStudentByUserId(savedUser.getId());
            if (student != null) {
                studentId = student.getId();
            }
        }
        
        return new AuthResponse(token, "User registered successfully", savedUser.getRole().name(), savedUser.getId(), studentId);
    }

    public User registerUser(UserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(userDto.getName())
                .email(userDto.getEmail())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .role(Role.valueOf(userDto.getRole()))
                .build();
        
        User savedUser = userRepository.save(user);
        
        // If the user is a student, create a corresponding student record
        if (Role.STUDENT.equals(savedUser.getRole())) {
            studentService.createStudent(savedUser.getId());
        }
        
        return savedUser;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}