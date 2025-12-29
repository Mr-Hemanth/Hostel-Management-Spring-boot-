package com.hostel.config;

import com.hostel.entity.Role;
import com.hostel.entity.User;
import com.hostel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.hostel.service.StudentService studentService;

    @Override
    public void run(String... args) throws Exception {
        // Ensure Admin exists with correct password
        if (!userRepository.existsByEmail("admin@hostel.com")) {
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@hostel.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Default admin user created: admin@hostel.com / admin123");
        } else {
            // Update existing admin password to ensure it's hashed correctly
            User admin = userRepository.findByEmail("admin@hostel.com").get();
            admin.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
            System.out.println("Admin user password reset to 'admin123' to ensure correct hashing");
        }

        // Ensure sample Student exists
        if (!userRepository.existsByEmail("john@example.com")) {
            User studentUser = User.builder()
                    .name("John Doe")
                    .email("john@example.com")
                    .password(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .build();
            User savedStudent = userRepository.save(studentUser);
            studentService.createStudent(savedStudent.getId());
            System.out.println("Default student user created: john@example.com / student123");
        }
    }
}
