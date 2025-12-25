package com.hostel.controller;

import com.hostel.entity.Student;
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
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/admin/students/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        if (student != null) {
            return ResponseEntity.ok(student);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/admin/students/{userId}")
    public ResponseEntity<Student> createStudent(@PathVariable Long userId) {
        Student student = studentService.createStudent(userId);
        if (student != null) {
            return ResponseEntity.ok(student);
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/admin/students/{id}/{userId}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @PathVariable Long userId) {
        Student student = studentService.updateStudent(id, userId);
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
    public ResponseEntity<Student> getStudentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                Student student = studentService.getStudentByUserId(user.getId());
                if (student != null) {
                    return ResponseEntity.ok(student);
                }
            }
        }
        return ResponseEntity.status(401).build();
    }
}