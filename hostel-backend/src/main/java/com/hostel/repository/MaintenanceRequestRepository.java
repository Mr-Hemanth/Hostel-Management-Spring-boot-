package com.hostel.repository;

import com.hostel.entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByStudentId(Long studentId);
    
    List<MaintenanceRequest> findByStatus(MaintenanceRequest.Status status);
    
    @Query("SELECT m FROM MaintenanceRequest m WHERE m.room.id = :roomId")
    List<MaintenanceRequest> findByRoomId(@Param("roomId") Long roomId);
    
    @Query("SELECT m FROM MaintenanceRequest m JOIN m.room r WHERE r.id = :roomId")
    List<MaintenanceRequest> findMaintenanceRequestsByRoomId(@Param("roomId") Long roomId);
    
    @Query("SELECT m FROM MaintenanceRequest m JOIN m.student s JOIN s.user u WHERE u.id = :userId")
    List<MaintenanceRequest> findByUserId(@Param("userId") Long userId);
}