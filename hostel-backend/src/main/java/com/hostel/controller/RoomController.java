package com.hostel.controller;

import com.hostel.dto.RoomDto;
import com.hostel.entity.Room;
import com.hostel.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/admin")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/rooms")
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        Room room = roomService.getRoomById(id);
        if (room != null) {
            return ResponseEntity.ok(room);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/rooms")
    public ResponseEntity<?> createRoom(@RequestBody RoomDto roomDto) {
        try {
            Room room = roomService.createRoom(roomDto);
            return ResponseEntity.ok(room);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @RequestBody RoomDto roomDto) {
        try {
            Room room = roomService.updateRoom(id, roomDto);
            if (room != null) {
                return ResponseEntity.ok(room);
            }
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/rooms/{roomId}/allocate/{studentId}")
    public ResponseEntity<Room> allocateRoomToStudent(@PathVariable Long roomId, @PathVariable Long studentId) {
        Room room = roomService.allocateRoomToStudent(roomId, studentId);
        if (room != null) {
            return ResponseEntity.ok(room);
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/rooms/{roomId}/deallocate")
    public ResponseEntity<Room> deallocateRoom(@PathVariable Long roomId) {
        Room room = roomService.deallocateRoom(roomId);
        if (room != null) {
            return ResponseEntity.ok(room);
        }
        return ResponseEntity.badRequest().build();
    }
}