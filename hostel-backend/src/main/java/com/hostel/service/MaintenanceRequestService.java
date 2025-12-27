package com.hostel.service;

import com.hostel.dto.MaintenanceRequestDto;
import com.hostel.entity.MaintenanceRequest;
import com.hostel.entity.Room;
import com.hostel.entity.Student;
import com.hostel.repository.MaintenanceRequestRepository;
import com.hostel.repository.RoomRepository;
import com.hostel.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceRequestService {

    @Autowired
    private MaintenanceRequestRepository maintenanceRequestRepository;
    
    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired
    private StudentRepository studentRepository;

    public List<MaintenanceRequestDto> getAllMaintenanceRequests() {
        List<MaintenanceRequest> requests = maintenanceRequestRepository.findAll();
        List<MaintenanceRequestDto> requestDtos = new ArrayList<>();
        
        for (MaintenanceRequest request : requests) {
            requestDtos.add(mapToDto(request));
        }
        
        return requestDtos;
    }

    public List<MaintenanceRequestDto> getMaintenanceRequestsByStudentId(Long studentId) {
        List<MaintenanceRequest> requests = maintenanceRequestRepository.findByStudentId(studentId);
        List<MaintenanceRequestDto> requestDtos = new ArrayList<>();
        
        for (MaintenanceRequest request : requests) {
            requestDtos.add(mapToDto(request));
        }
        
        return requestDtos;
    }

    public List<MaintenanceRequestDto> getMaintenanceRequestsByStatus(MaintenanceRequest.Status status) {
        List<MaintenanceRequest> requests = maintenanceRequestRepository.findByStatus(status);
        List<MaintenanceRequestDto> requestDtos = new ArrayList<>();
        
        for (MaintenanceRequest request : requests) {
            requestDtos.add(mapToDto(request));
        }
        
        return requestDtos;
    }

    public List<MaintenanceRequestDto> getMaintenanceRequestsByRoomId(Long roomId) {
        List<MaintenanceRequest> requests = maintenanceRequestRepository.findByRoomId(roomId);
        List<MaintenanceRequestDto> requestDtos = new ArrayList<>();
        
        for (MaintenanceRequest request : requests) {
            requestDtos.add(mapToDto(request));
        }
        
        return requestDtos;
    }

    public MaintenanceRequestDto getMaintenanceRequestById(Long id) {
        Optional<MaintenanceRequest> request = maintenanceRequestRepository.findById(id);
        if (request.isPresent()) {
            return mapToDto(request.get());
        }
        return null;
    }

    public MaintenanceRequestDto createMaintenanceRequest(MaintenanceRequestDto requestDto) {
        // Get the room and student entities
        Room room = roomRepository.findById(requestDto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + requestDto.getRoomId()));
        
        Student student = studentRepository.findById(requestDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + requestDto.getStudentId()));
        
        // Create new maintenance request
        MaintenanceRequest request = new MaintenanceRequest();
        request.setRoom(room);
        request.setStudent(student);
        request.setDescription(requestDto.getDescription());
        request.setStatus(MaintenanceRequest.Status.PENDING);
        
        MaintenanceRequest savedRequest = maintenanceRequestRepository.save(request);
        return mapToDto(savedRequest);
    }

    public MaintenanceRequestDto updateMaintenanceRequest(Long id, MaintenanceRequestDto requestDto) {
        Optional<MaintenanceRequest> existingRequest = maintenanceRequestRepository.findById(id);
        if (existingRequest.isPresent()) {
            MaintenanceRequest request = existingRequest.get();
            
            // Only update status and remarks for admin updates
            request.setStatus(requestDto.getStatus());
            request.setRemarks(requestDto.getRemarks());
            
            if (requestDto.getStatus() == MaintenanceRequest.Status.COMPLETED) {
                request.setResolvedAt(java.time.LocalDateTime.now());
            }
            
            MaintenanceRequest updatedRequest = maintenanceRequestRepository.save(request);
            return mapToDto(updatedRequest);
        }
        return null;
    }

    public void deleteMaintenanceRequest(Long id) {
        maintenanceRequestRepository.deleteById(id);
    }
    
    private MaintenanceRequestDto mapToDto(MaintenanceRequest request) {
        return new MaintenanceRequestDto(
            request.getId(),
            request.getRoom().getId(),
            request.getRoom().getRoomNumber(),
            request.getStudent().getId(),
            request.getStudent().getUser().getName(),
            request.getDescription(),
            request.getStatus(),
            request.getCreatedAt(),
            request.getResolvedAt(),
            request.getRemarks()
        );
    }
}