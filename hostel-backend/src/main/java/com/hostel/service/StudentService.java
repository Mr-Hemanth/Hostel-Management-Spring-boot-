package com.hostel.service;

import com.hostel.dto.RoomDto;
import com.hostel.dto.StudentDto;
import com.hostel.dto.UserDisplayDto;
import com.hostel.entity.Role;
import com.hostel.entity.Room;
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

    public List<StudentDto> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        List<StudentDto> studentDtos = new ArrayList<>();
        
        for (Student student : students) {
            User user = student.getUser();
            if (user == null) continue;
            UserDisplayDto userDto = new UserDisplayDto(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
            RoomDto roomDto = null;
            if (student.getRoom() != null) {
                Room room = student.getRoom();
                // We need to know the actual occupancy of the room
                List<Student> studentsInRoom = studentRepository.findStudentsByRoomId(room.getId());
                boolean isOccupied = studentsInRoom.size() >= room.getCapacity();
                roomDto = new RoomDto(room.getId(), room.getRoomNumber(), room.getCapacity(), isOccupied);
            }
            
            studentDtos.add(new StudentDto(student.getId(), userDto, roomDto));
        }
        
        return studentDtos;
    }

    public List<StudentDto> getStudentsWithoutRooms() {
        List<Student> students = studentRepository.findStudentsWithoutRooms();
        List<StudentDto> studentDtos = new ArrayList<>();
        
        for (Student student : students) {
            User user = student.getUser();
            if (user == null) continue;
            UserDisplayDto userDto = new UserDisplayDto(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
            
            studentDtos.add(new StudentDto(student.getId(), userDto, null));
        }
        
        return studentDtos;
    }
    
    public List<StudentDto> getAllStudentsWithUsers() {
        // Ensure all users with STUDENT role have corresponding student records
        List<User> studentUsers = userRepository.findByRole(Role.STUDENT);
        List<StudentDto> studentDtos = new ArrayList<>();
        
        for (User user : studentUsers) {
            Student student = studentRepository.findByUserId(user.getId());
            if (student == null) {
                // Create student record if it doesn't exist
                student = new Student();
                student.setUser(user);
                student = studentRepository.save(student);
            }
            
            // Create DTO with proper user and room data
            UserDisplayDto userDto = new UserDisplayDto(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
            RoomDto roomDto = null;
            if (student.getRoom() != null) {
                Room room = student.getRoom();
                List<Student> studentsInRoom = studentRepository.findStudentsByRoomId(room.getId());
                boolean isOccupied = studentsInRoom.size() >= room.getCapacity();
                roomDto = new RoomDto(room.getId(), room.getRoomNumber(), room.getCapacity(), isOccupied);
            }
            
            StudentDto studentDto = new StudentDto(student.getId(), userDto, roomDto);
            studentDtos.add(studentDto);
        }
        
        return studentDtos;
    }

    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student != null) {
            User user = student.getUser();
            UserDisplayDto userDto = new UserDisplayDto(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
            RoomDto roomDto = null;
            if (student.getRoom() != null) {
                Room room = student.getRoom();
                List<Student> studentsInRoom = studentRepository.findStudentsByRoomId(room.getId());
                boolean isOccupied = studentsInRoom.size() >= room.getCapacity();
                roomDto = new RoomDto(room.getId(), room.getRoomNumber(), room.getCapacity(), isOccupied);
            }
            
            return new StudentDto(student.getId(), userDto, roomDto);
        }
        return null;
    }

    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId);
    }

    public StudentDto getStudentDtoByUserId(Long userId) {
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
        
        if (student != null) {
            // Create DTO with proper user and room data
            User user = student.getUser();
            UserDisplayDto userDto = new UserDisplayDto(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
            RoomDto roomDto = null;
            if (student.getRoom() != null) {
                Room room = student.getRoom();
                List<Student> studentsInRoom = studentRepository.findStudentsByRoomId(room.getId());
                boolean isOccupied = studentsInRoom.size() >= room.getCapacity();
                roomDto = new RoomDto(room.getId(), room.getRoomNumber(), room.getCapacity(), isOccupied);
            }
            
            return new StudentDto(student.getId(), userDto, roomDto);
        }
        return null;
    }

    public StudentDto createStudent(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            // Check if student already exists for this user
            Student existingStudent = studentRepository.findByUserId(userId);
            if (existingStudent != null) {
                // Return existing student as DTO if already exists
                UserDisplayDto userDto = new UserDisplayDto(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
                RoomDto roomDto = null;
                if (existingStudent.getRoom() != null) {
                    Room room = existingStudent.getRoom();
                    List<Student> studentsInRoom = studentRepository.findStudentsByRoomId(room.getId());
                    boolean isOccupied = studentsInRoom.size() >= room.getCapacity();
                    roomDto = new RoomDto(room.getId(), room.getRoomNumber(), room.getCapacity(), isOccupied);
                }
                            
                return new StudentDto(existingStudent.getId(), userDto, roomDto);
            }
            
            Student student = new Student();
            student.setUser(user);
            Student savedStudent = studentRepository.save(student);
            
            // Create and return DTO
            UserDisplayDto userDto = new UserDisplayDto(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
            return new StudentDto(savedStudent.getId(), userDto, null);
        }
        return null;
    }

    public StudentDto updateStudent(Long id, Long userId) {
        Student student = studentRepository.findById(id).orElse(null);
        User user = userRepository.findById(userId).orElse(null);
        
        if (student != null && user != null) {
            student.setUser(user);
            Student updatedStudent = studentRepository.save(student);
            
            // Create and return DTO
            UserDisplayDto userDto = new UserDisplayDto(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
            RoomDto roomDto = null;
            if (updatedStudent.getRoom() != null) {
                Room room = updatedStudent.getRoom();
                List<Student> studentsInRoom = studentRepository.findStudentsByRoomId(room.getId());
                boolean isOccupied = studentsInRoom.size() >= room.getCapacity();
                roomDto = new RoomDto(room.getId(), room.getRoomNumber(), room.getCapacity(), isOccupied);
            }
            
            return new StudentDto(updatedStudent.getId(), userDto, roomDto);
        }
        return null;
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}