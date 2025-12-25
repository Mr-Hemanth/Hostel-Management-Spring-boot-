package com.hostel.service;

import com.hostel.dto.RoomDto;
import com.hostel.entity.Room;
import com.hostel.entity.Student;
import com.hostel.repository.RoomRepository;
import com.hostel.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    public Room createRoom(RoomDto roomDto) {
        if (roomRepository.existsByRoomNumber(roomDto.getRoomNumber())) {
            throw new RuntimeException("Room number already exists");
        }

        Room room = new Room();
        room.setRoomNumber(roomDto.getRoomNumber());
        room.setCapacity(roomDto.getCapacity());
        room.setOccupied(false);
        return roomRepository.save(room);
    }

    public Room updateRoom(Long id, RoomDto roomDto) {
        Room room = roomRepository.findById(id).orElse(null);
        if (room != null) {
            // Check if the new room number is already taken by another room
            if (!room.getRoomNumber().equals(roomDto.getRoomNumber()) && 
                roomRepository.existsByRoomNumber(roomDto.getRoomNumber())) {
                throw new RuntimeException("Room number already exists");
            }
            
            room.setRoomNumber(roomDto.getRoomNumber());
            room.setCapacity(roomDto.getCapacity());
            return roomRepository.save(room);
        }
        return null;
    }

    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id).orElse(null);
        if (room != null) {
            // If the room is occupied, we need to deallocate the student first
            if (room.getStudent() != null) {
                Student student = room.getStudent();
                student.setRoom(null);
                studentRepository.save(student);
            }
            roomRepository.deleteById(id);
        }
    }

    public Room allocateRoomToStudent(Long roomId, Long studentId) {
        Room room = roomRepository.findById(roomId).orElse(null);
        Student student = studentRepository.findById(studentId).orElse(null);
        
        if (room != null && student != null && !room.getOccupied()) {
            room.setOccupied(true);
            room.setStudent(student);
            student.setRoom(room);
            roomRepository.save(room);
            studentRepository.save(student);
            return room;
        }
        return null;
    }

    public Room deallocateRoom(Long roomId) {
        Room room = roomRepository.findById(roomId).orElse(null);
        if (room != null && room.getOccupied() && room.getStudent() != null) {
            Student student = room.getStudent();
            student.setRoom(null);
            room.setOccupied(false);
            room.setStudent(null);
            roomRepository.save(room);
            studentRepository.save(student);
            return room;
        }
        return null;
    }
}