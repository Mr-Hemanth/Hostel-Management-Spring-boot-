package com.hostel.service;

import com.hostel.dto.RoomDto;
import com.hostel.dto.StudentSummaryDto;
import com.hostel.dto.UserDisplayDto;
import com.hostel.entity.Room;
import com.hostel.entity.Student;
import com.hostel.repository.RoomRepository;
import com.hostel.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<RoomDto> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        List<RoomDto> roomDtos = new ArrayList<>();
        
        for (Room room : rooms) {
            // Get students assigned to this room
            List<Student> studentsInRoom = studentRepository.findStudentsByRoomId(room.getId());
            List<StudentSummaryDto> studentSummaryDtos = new ArrayList<>();
            
            for (Student student : studentsInRoom) {
                if (student.getUser() != null) {
                    UserDisplayDto userDto = new UserDisplayDto(student.getUser().getId(), student.getUser().getName(), student.getUser().getEmail(), student.getUser().getRole().name());
                    studentSummaryDtos.add(new StudentSummaryDto(student.getId(), userDto));
                }
            }
            
            RoomDto roomDto = new RoomDto(room.getId(), room.getRoomNumber(), room.getCapacity(), room.getOccupied(), studentSummaryDtos);
            roomDtos.add(roomDto);
        }
        
        return roomDtos;
    }

    public RoomDto getRoomById(Long id) {
        Room room = roomRepository.findById(id).orElse(null);
        if (room != null) {
            // Get students assigned to this room
            List<Student> studentsInRoom = studentRepository.findStudentsByRoomId(id);
            List<StudentSummaryDto> studentSummaryDtos = new ArrayList<>();
            
            for (Student student : studentsInRoom) {
                if (student.getUser() != null) {
                    UserDisplayDto userDto = new UserDisplayDto(student.getUser().getId(), student.getUser().getName(), student.getUser().getEmail(), student.getUser().getRole().name());
                    studentSummaryDtos.add(new StudentSummaryDto(student.getId(), userDto));
                }
            }
            
            return new RoomDto(room.getId(), room.getRoomNumber(), room.getCapacity(), room.getOccupied(), studentSummaryDtos);
        }
        return null;
    }

    public RoomDto createRoom(RoomDto roomDto) {
        if (roomRepository.existsByRoomNumber(roomDto.getRoomNumber())) {
            throw new RuntimeException("Room number already exists");
        }

        Room room = new Room();
        room.setRoomNumber(roomDto.getRoomNumber());
        room.setCapacity(roomDto.getCapacity());
        // Occupancy is calculated automatically based on student count vs capacity
        Room savedRoom = roomRepository.save(room);
        
        return new RoomDto(savedRoom.getId(), savedRoom.getRoomNumber(), savedRoom.getCapacity(), savedRoom.getOccupied(), new ArrayList<>());
    }

    public RoomDto updateRoom(Long id, RoomDto roomDto) {
        Room room = roomRepository.findById(id).orElse(null);
        if (room != null) {
            // Check if the new room number is already taken by another room
            if (!room.getRoomNumber().equals(roomDto.getRoomNumber()) && 
                roomRepository.existsByRoomNumber(roomDto.getRoomNumber())) {
                throw new RuntimeException("Room number already exists");
            }
            
            room.setRoomNumber(roomDto.getRoomNumber());
            room.setCapacity(roomDto.getCapacity());
            // Occupancy is calculated automatically based on student count vs capacity
            Room updatedRoom = roomRepository.save(room);
            
            // Get students assigned to this room
            List<Student> studentsInRoom = studentRepository.findStudentsByRoomId(updatedRoom.getId());
            List<StudentSummaryDto> studentSummaryDtos = new ArrayList<>();
            
            for (Student student : studentsInRoom) {
                if (student.getUser() != null) {
                    UserDisplayDto userDto = new UserDisplayDto(student.getUser().getId(), student.getUser().getName(), student.getUser().getEmail(), student.getUser().getRole().name());
                    studentSummaryDtos.add(new StudentSummaryDto(student.getId(), userDto));
                }
            }
            
            return new RoomDto(updatedRoom.getId(), updatedRoom.getRoomNumber(), updatedRoom.getCapacity(), updatedRoom.getOccupied(), studentSummaryDtos);
        }
        return null;
    }
    
    public RoomDto deallocateStudentFromRoom(Long roomId, Long studentId) {
        Room room = roomRepository.findById(roomId).orElse(null);
        Student student = studentRepository.findById(studentId).orElse(null);
        
        if (room != null && student != null && student.getRoom() != null && student.getRoom().getId().equals(roomId)) {
            // Remove the student from the room
            student.setRoom(null);
            studentRepository.save(student);
            
            // Update room's occupied status
            room.updateOccupiedStatus();
            roomRepository.save(room);
            
            // Get updated list of students in room
            List<Student> studentsInRoom = studentRepository.findStudentsByRoomId(roomId);
            List<StudentSummaryDto> studentSummaryDtos = new ArrayList<>();
            
            for (Student s : studentsInRoom) {
                if (s.getUser() != null) {
                    UserDisplayDto userDto = new UserDisplayDto(s.getUser().getId(), s.getUser().getName(), s.getUser().getEmail(), s.getUser().getRole().name());
                    studentSummaryDtos.add(new StudentSummaryDto(s.getId(), userDto));
                }
            }
            
            return new RoomDto(room.getId(), room.getRoomNumber(), room.getCapacity(), room.getOccupied(), studentSummaryDtos);
        }
        return null;
    }

    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id).orElse(null);
        if (room != null) {
            // Find any student assigned to this room and remove the assignment
            List<Student> studentsInRoom = studentRepository.findStudentsByRoomId(id);
            for (Student student : studentsInRoom) {
                student.setRoom(null);
                studentRepository.save(student);
            }
            roomRepository.deleteById(id);
        }
    }

    public RoomDto allocateRoomToStudent(Long roomId, Long studentId) {
        Room room = roomRepository.findById(roomId).orElse(null);
        Student student = studentRepository.findById(studentId).orElse(null);
        
        if (room != null && student != null) {
            // Check if room has capacity before allocating
            List<Student> studentsInRoom = studentRepository.findStudentsByRoomId(roomId);
            if (studentsInRoom.size() < room.getCapacity()) {
                student.setRoom(room);
                roomRepository.save(room);
                studentRepository.save(student);
                
                // Get updated list of students in room
                studentsInRoom = studentRepository.findStudentsByRoomId(roomId);
                List<StudentSummaryDto> studentSummaryDtos = new ArrayList<>();
                
                for (Student s : studentsInRoom) {
                    if (s.getUser() != null) {
                        UserDisplayDto userDto = new UserDisplayDto(s.getUser().getId(), s.getUser().getName(), s.getUser().getEmail(), s.getUser().getRole().name());
                        studentSummaryDtos.add(new StudentSummaryDto(s.getId(), userDto));
                    }
                }
                
                return new RoomDto(room.getId(), room.getRoomNumber(), room.getCapacity(), room.getOccupied(), studentSummaryDtos);
            }
        }
        return null;
    }

    public RoomDto deallocateRoom(Long roomId) {
        Room room = roomRepository.findById(roomId).orElse(null);
        if (room != null) {
            // Find any student assigned to this room and remove the assignment
            List<Student> studentsInRoom = studentRepository.findStudentsByRoomId(roomId);
            for (Student student : studentsInRoom) {
                student.setRoom(null);
            }
            roomRepository.save(room);
            // Save all affected students
            for (Student student : studentsInRoom) {
                studentRepository.save(student);
            }
            
            // Get updated list of students in room (should be empty now)
            studentsInRoom = studentRepository.findStudentsByRoomId(roomId);
            List<StudentSummaryDto> studentSummaryDtos = new ArrayList<>();
            
            for (Student student : studentsInRoom) {
                if (student.getUser() != null) {
                    UserDisplayDto userDto = new UserDisplayDto(student.getUser().getId(), student.getUser().getName(), student.getUser().getEmail(), student.getUser().getRole().name());
                    studentSummaryDtos.add(new StudentSummaryDto(student.getId(), userDto));
                }
            }
            
            return new RoomDto(room.getId(), room.getRoomNumber(), room.getCapacity(), room.getOccupied(), studentSummaryDtos);
        }
        return null;
    }
}