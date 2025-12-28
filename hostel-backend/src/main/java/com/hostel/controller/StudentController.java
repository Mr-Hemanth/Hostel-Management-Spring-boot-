package com.hostel.controller;

import com.hostel.dto.StudentDto;
import com.hostel.entity.User;
import com.hostel.repository.UserRepository;
import com.hostel.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class StudentController {

    @Autowired
    private StudentService studentService;
    
    @Autowired
    private UserRepository userRepository;

    // Admin endpoints
    @GetMapping("/admin/students")
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        List<StudentDto> students = studentService.getAllStudentsWithUsers();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/admin/students/{id}")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable Long id) {
        StudentDto student = studentService.getStudentById(id);
        if (student != null) {
            return ResponseEntity.ok(student);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/admin/students/{userId}")
    public ResponseEntity<StudentDto> createStudent(@PathVariable Long userId) {
        StudentDto student = studentService.createStudent(userId);
        if (student != null) {
            return ResponseEntity.ok(student);
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/admin/students/{id}/{userId}")
    public ResponseEntity<StudentDto> updateStudent(@PathVariable Long id, @PathVariable Long userId) {
        StudentDto student = studentService.updateStudent(id, userId);
        if (student != null) {
            return ResponseEntity.ok(student);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/admin/students/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    // Student endpoints
    @GetMapping("/student/profile")
    public ResponseEntity<StudentDto> getStudentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                StudentDto student = studentService.getStudentDtoByUserId(user.getId());
                if (student != null) {
                    return ResponseEntity.ok(student);
                }
            }
        }
        return ResponseEntity.status(401).build();
    }
}