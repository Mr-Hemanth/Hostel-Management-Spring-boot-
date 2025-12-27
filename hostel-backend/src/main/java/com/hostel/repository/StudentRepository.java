package com.hostel.repository;

import com.hostel.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    @Query("SELECT s FROM Student s JOIN FETCH s.user WHERE s.user.id = :userId")
    Student findByUserId(Long userId);
    
    @Query("SELECT s FROM Student s JOIN FETCH s.user WHERE s.room.id = :roomId")
    Student findStudentByRoomId(Long roomId);
    
    @Query("SELECT s FROM Student s JOIN FETCH s.user WHERE s.room.id = :roomId")
    List<Student> findStudentsByRoomId(Long roomId);
    
    @Query("SELECT s FROM Student s JOIN FETCH s.user WHERE s.room IS NULL")
    List<Student> findStudentsWithoutRooms();
    
    @Query("SELECT s FROM Student s JOIN FETCH s.user")
    List<Student> findAll();
}