package com.hostel.repository;

import com.hostel.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Student findByUserId(Long userId);
    Student findByRoomId(Long roomId);
    
    @Query("SELECT s FROM Student s WHERE s.room IS NULL")
    List<Student> findStudentsWithoutRooms();
}