package com.hostel.repository;

import com.hostel.entity.RoomBookingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomBookingRequestRepository extends JpaRepository<RoomBookingRequest, Long> {
    List<RoomBookingRequest> findByStudentId(Long studentId);
    
    List<RoomBookingRequest> findByStatus(RoomBookingRequest.Status status);
    
    @Query("SELECT r FROM RoomBookingRequest r WHERE r.room.id = :roomId")
    List<RoomBookingRequest> findByRoomId(@Param("roomId") Long roomId);
    
    @Query("SELECT r FROM RoomBookingRequest r JOIN r.student s JOIN s.user u WHERE u.id = :userId")
    List<RoomBookingRequest> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT r FROM RoomBookingRequest r WHERE r.status = :status ORDER BY r.createdAt DESC")
    List<RoomBookingRequest> findByStatusOrderByCreatedAtDesc(@Param("status") RoomBookingRequest.Status status);
}