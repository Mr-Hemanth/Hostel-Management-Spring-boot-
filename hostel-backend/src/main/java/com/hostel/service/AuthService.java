package com.hostel.service;

import com.hostel.dto.AuthRequest;
import com.hostel.dto.AuthResponse;
import com.hostel.dto.UserDto;
import com.hostel.entity.Role;
import com.hostel.entity.User;
import com.hostel.repository.UserRepository;
import com.hostel.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private StudentService studentService;

    public AuthResponse authenticateUser(AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getEmail(),
                            authRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            User user = (User) authentication.getPrincipal();
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
            
            return new AuthResponse(token, "Login successful", user.getRole().name());
        } catch (Exception e) {
            throw new RuntimeException("Invalid credentials");
        }
    }

    public User registerUser(UserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setRole(Role.valueOf(userDto.getRole()));
        
        User savedUser = userRepository.save(user);
        
        // If the user is a student, create a corresponding student record
        if (Role.STUDENT.equals(savedUser.getRole())) {
            studentService.createStudent(savedUser.getId());
        }
        
        return savedUser;
    }
}