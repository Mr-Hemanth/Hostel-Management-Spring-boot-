package com.hostel.controller;

import com.hostel.dto.RoomBookingRequestDto;
import com.hostel.entity.RoomBookingRequest;
import com.hostel.service.RoomBookingRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class RoomBookingRequestController {

    @Autowired
    private RoomBookingRequestService roomBookingRequestService;

    // Student endpoints
    @GetMapping("/student/room-booking-requests")
    public ResponseEntity<List<RoomBookingRequestDto>> getStudentBookingRequests(@RequestParam Long studentId) {
        List<RoomBookingRequestDto> requests = roomBookingRequestService.getBookingRequestsByStudentId(studentId);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/student/room-booking-requests")
    public ResponseEntity<RoomBookingRequestDto> createBookingRequest(
            @RequestParam Long studentId, 
            @RequestParam Long roomId) {
        try {
            RoomBookingRequestDto createdRequest = roomBookingRequestService.createBookingRequest(studentId, roomId);
            return ResponseEntity.ok(createdRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin endpoints
    @GetMapping("/admin/room-booking-requests")
    public ResponseEntity<List<RoomBookingRequestDto>> getAllBookingRequests() {
        List<RoomBookingRequestDto> requests = roomBookingRequestService.getAllBookingRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/admin/room-booking-requests/status/{status}")
    public ResponseEntity<List<RoomBookingRequestDto>> getBookingRequestsByStatus(
            @PathVariable RoomBookingRequest.Status status) {
        List<RoomBookingRequestDto> requests = roomBookingRequestService.getBookingRequestsByStatus(status);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/admin/room-booking-requests/room/{roomId}")
    public ResponseEntity<List<RoomBookingRequestDto>> getBookingRequestsByRoom(
            @PathVariable Long roomId) {
        List<RoomBookingRequestDto> requests = roomBookingRequestService.getBookingRequestsByRoomId(roomId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/admin/room-booking-requests/{id}")
    public ResponseEntity<RoomBookingRequestDto> getBookingRequestById(@PathVariable Long id) {
        RoomBookingRequestDto request = roomBookingRequestService.getBookingRequestById(id);
        if (request != null) {
            return ResponseEntity.ok(request);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/admin/room-booking-requests/{id}")
    public ResponseEntity<RoomBookingRequestDto> updateBookingRequest(
            @PathVariable Long id, 
            @RequestParam RoomBookingRequest.Status status,
            @RequestParam(required = false) String adminRemarks) {
        try {
            RoomBookingRequestDto updatedRequest = roomBookingRequestService.updateBookingRequest(id, status, adminRemarks);
            if (updatedRequest != null) {
                return ResponseEntity.ok(updatedRequest);
            }
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/admin/room-booking-requests/{id}")
    public ResponseEntity<Void> deleteBookingRequest(@PathVariable Long id) {
        roomBookingRequestService.deleteBookingRequest(id);
        return ResponseEntity.noContent().build();
    }
}