package com.hostel.controller;

import com.hostel.dto.MaintenanceRequestDto;
import com.hostel.entity.MaintenanceRequest;
import com.hostel.service.MaintenanceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class MaintenanceRequestController {

    @Autowired
    private MaintenanceRequestService maintenanceRequestService;

    // Student endpoints
    @GetMapping("/student/maintenance-requests")
    public ResponseEntity<List<MaintenanceRequestDto>> getStudentMaintenanceRequests(@RequestParam Long studentId) {
        List<MaintenanceRequestDto> requests = maintenanceRequestService.getMaintenanceRequestsByStudentId(studentId);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/student/maintenance-requests")
    public ResponseEntity<MaintenanceRequestDto> createMaintenanceRequest(@RequestBody MaintenanceRequestDto requestDto) {
        try {
            MaintenanceRequestDto createdRequest = maintenanceRequestService.createMaintenanceRequest(requestDto);
            return ResponseEntity.ok(createdRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin endpoints
    @GetMapping("/admin/maintenance-requests")
    public ResponseEntity<List<MaintenanceRequestDto>> getAllMaintenanceRequests() {
        List<MaintenanceRequestDto> requests = maintenanceRequestService.getAllMaintenanceRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/admin/maintenance-requests/status/{status}")
    public ResponseEntity<List<MaintenanceRequestDto>> getMaintenanceRequestsByStatus(
            @PathVariable MaintenanceRequest.Status status) {
        List<MaintenanceRequestDto> requests = maintenanceRequestService.getMaintenanceRequestsByStatus(status);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/admin/maintenance-requests/room/{roomId}")
    public ResponseEntity<List<MaintenanceRequestDto>> getMaintenanceRequestsByRoom(
            @PathVariable Long roomId) {
        List<MaintenanceRequestDto> requests = maintenanceRequestService.getMaintenanceRequestsByRoomId(roomId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/admin/maintenance-requests/{id}")
    public ResponseEntity<MaintenanceRequestDto> getMaintenanceRequestById(@PathVariable Long id) {
        MaintenanceRequestDto request = maintenanceRequestService.getMaintenanceRequestById(id);
        if (request != null) {
            return ResponseEntity.ok(request);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/admin/maintenance-requests/{id}")
    public ResponseEntity<MaintenanceRequestDto> updateMaintenanceRequest(
            @PathVariable Long id, @RequestBody MaintenanceRequestDto requestDto) {
        try {
            MaintenanceRequestDto updatedRequest = maintenanceRequestService.updateMaintenanceRequest(id, requestDto);
            if (updatedRequest != null) {
                return ResponseEntity.ok(updatedRequest);
            }
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/admin/maintenance-requests/{id}")
    public ResponseEntity<Void> deleteMaintenanceRequest(@PathVariable Long id) {
        maintenanceRequestService.deleteMaintenanceRequest(id);
        return ResponseEntity.noContent().build();
    }
}