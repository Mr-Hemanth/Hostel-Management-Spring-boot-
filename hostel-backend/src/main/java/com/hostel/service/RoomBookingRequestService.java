package com.hostel.service;

import com.hostel.dto.RoomBookingRequestDto;
import com.hostel.entity.Room;
import com.hostel.entity.RoomBookingRequest;
import com.hostel.entity.Student;
import com.hostel.repository.RoomBookingRequestRepository;
import com.hostel.repository.RoomRepository;
import com.hostel.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RoomBookingRequestService {

    @Autowired
    private RoomBookingRequestRepository roomBookingRequestRepository;
    
    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired
    private StudentRepository studentRepository;

    public List<RoomBookingRequestDto> getAllBookingRequests() {
        List<RoomBookingRequest> requests = roomBookingRequestRepository.findAll();
        List<RoomBookingRequestDto> requestDtos = new ArrayList<>();
        
        for (RoomBookingRequest request : requests) {
            requestDtos.add(mapToDto(request));
        }
        
        return requestDtos;
    }

    public List<RoomBookingRequestDto> getBookingRequestsByStudentId(Long studentId) {
        List<RoomBookingRequest> requests = roomBookingRequestRepository.findByStudentId(studentId);
        List<RoomBookingRequestDto> requestDtos = new ArrayList<>();
        
        for (RoomBookingRequest request : requests) {
            requestDtos.add(mapToDto(request));
        }
        
        return requestDtos;
    }

    public List<RoomBookingRequestDto> getBookingRequestsByStatus(RoomBookingRequest.Status status) {
        List<RoomBookingRequest> requests = roomBookingRequestRepository.findByStatusOrderByCreatedAtDesc(status);
        List<RoomBookingRequestDto> requestDtos = new ArrayList<>();
        
        for (RoomBookingRequest request : requests) {
            requestDtos.add(mapToDto(request));
        }
        
        return requestDtos;
    }

    public List<RoomBookingRequestDto> getBookingRequestsByRoomId(Long roomId) {
        List<RoomBookingRequest> requests = roomBookingRequestRepository.findByRoomId(roomId);
        List<RoomBookingRequestDto> requestDtos = new ArrayList<>();
        
        for (RoomBookingRequest request : requests) {
            requestDtos.add(mapToDto(request));
        }
        
        return requestDtos;
    }

    public RoomBookingRequestDto getBookingRequestById(Long id) {
        Optional<RoomBookingRequest> request = roomBookingRequestRepository.findById(id);
        if (request.isPresent()) {
            return mapToDto(request.get());
        }
        return null;
    }

    public RoomBookingRequestDto createBookingRequest(Long studentId, Long roomId) {
        // Get the student and room entities
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));
        
        // Check if student already has a room
        if (student.getRoom() != null) {
            throw new RuntimeException("Student is already assigned to a room");
        }
        
        // Check if room is available (not at capacity)
        List<Student> studentsInRoom = studentRepository.findStudentsByRoomId(roomId);
        if (studentsInRoom.size() >= room.getCapacity()) {
            throw new RuntimeException("Room is at full capacity");
        }
        
        // Check if student already has a pending request for this room
        List<RoomBookingRequest> existingRequests = roomBookingRequestRepository.findByStudentId(studentId);
        for (RoomBookingRequest existingRequest : existingRequests) {
            if (existingRequest.getRoom().getId().equals(roomId) && 
                existingRequest.getStatus() == RoomBookingRequest.Status.PENDING) {
                throw new RuntimeException("Student already has a pending request for this room");
            }
        }
        
        // Create new booking request
        RoomBookingRequest request = new RoomBookingRequest(student, room);
        RoomBookingRequest savedRequest = roomBookingRequestRepository.save(request);
        return mapToDto(savedRequest);
    }

    public RoomBookingRequestDto updateBookingRequest(Long id, RoomBookingRequest.Status newStatus, String adminRemarks) {
        Optional<RoomBookingRequest> existingRequest = roomBookingRequestRepository.findById(id);
        if (existingRequest.isPresent()) {
            RoomBookingRequest request = existingRequest.get();
            
            // Update status and remarks
            request.setStatus(newStatus);
            request.setAdminRemarks(adminRemarks);
            
            if (newStatus == RoomBookingRequest.Status.APPROVED || newStatus == RoomBookingRequest.Status.REJECTED) {
                request.setResolvedAt(java.time.LocalDateTime.now());
            }
            
            RoomBookingRequest updatedRequest = roomBookingRequestRepository.save(request);
            return mapToDto(updatedRequest);
        }
        return null;
    }

    public void deleteBookingRequest(Long id) {
        roomBookingRequestRepository.deleteById(id);
    }
    
    private RoomBookingRequestDto mapToDto(RoomBookingRequest request) {
        return new RoomBookingRequestDto(
            request.getId(),
            request.getStudent().getId(),
            request.getStudent().getUser().getName(),
            request.getStudent().getUser().getEmail(),
            request.getRoom().getId(),
            request.getRoom().getRoomNumber(),
            request.getRoom().getCapacity(),
            request.getStatus(),
            request.getCreatedAt(),
            request.getResolvedAt(),
            request.getAdminRemarks()
        );
    }
}