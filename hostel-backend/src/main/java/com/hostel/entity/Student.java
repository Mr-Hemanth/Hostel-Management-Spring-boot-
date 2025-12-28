package com.hostel.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    public Student() {}

    public Student(Long id, User user, Room room) {
        this.id = id;
        this.user = user;
        this.room = room;
    }

    public static StudentBuilder builder() {
        return new StudentBuilder();
    }

    public static class StudentBuilder {
        private Long id;
        private User user;
        private Room room;

        public StudentBuilder id(Long id) { this.id = id; return this; }
        public StudentBuilder user(User user) { this.user = user; return this; }
        public StudentBuilder room(Room room) { this.room = room; return this; }
        public Student build() { return new Student(id, user, room); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }
}