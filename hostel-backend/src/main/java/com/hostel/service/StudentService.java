package com.hostel.service;

import com.hostel.entity.Role;
import com.hostel.entity.Student;
import com.hostel.entity.User;
import com.hostel.repository.StudentRepository;
import com.hostel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Student> getStudentsWithoutRooms() {
        return studentRepository.findStudentsWithoutRooms();
    }
    
    public List<Student> getAllStudentsWithUsers() {
        // Ensure all users with STUDENT role have corresponding student records
        List<User> studentUsers = userRepository.findByRole(Role.STUDENT);
        List<Student> students = new ArrayList<>();
        
        for (User user : studentUsers) {
            Student student = studentRepository.findByUserId(user.getId());
            if (student == null) {
                // Create student record if it doesn't exist
                student = new Student();
                student.setUser(user);
                student = studentRepository.save(student);
            }
            students.add(student);
        }
        
        return students;
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    public Student getStudentByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId);
        if (student == null) {
            // If no student exists for this user, create one
            User user = userRepository.findById(userId).orElse(null);
            if (user != null && user.getRole() == Role.STUDENT) {
                student = new Student();
                student.setUser(user);
                student = studentRepository.save(student);
            }
        }
        return student;
    }

    public Student createStudent(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            // Check if student already exists for this user
            Student existingStudent = studentRepository.findByUserId(userId);
            if (existingStudent != null) {
                return existingStudent; // Return existing student if already exists
            }
            
            Student student = new Student();
            student.setUser(user);
            return studentRepository.save(student);
        }
        return null;
    }

    public Student updateStudent(Long id, Long userId) {
        Student student = studentRepository.findById(id).orElse(null);
        User user = userRepository.findById(userId).orElse(null);
        
        if (student != null && user != null) {
            student.setUser(user);
            return studentRepository.save(student);
        }
        return null;
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}