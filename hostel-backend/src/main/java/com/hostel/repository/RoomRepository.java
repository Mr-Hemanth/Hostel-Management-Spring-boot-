package com.hostel.repository;

import com.hostel.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Boolean existsByRoomNumber(String roomNumber);
}