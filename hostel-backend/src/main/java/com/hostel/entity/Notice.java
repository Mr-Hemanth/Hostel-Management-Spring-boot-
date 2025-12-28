package com.hostel.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notices")
public class Notice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at")
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"password", "students", "authorities", "enabled", "accountNonExpired", "accountNonLocked", "credentialsNonExpired"})
    private User createdBy;

    public Notice() {}

    public Notice(Long id, String title, String content, LocalDateTime createdAt, User createdBy) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
    }

    public static NoticeBuilder builder() {
        return new NoticeBuilder();
    }

    public static class NoticeBuilder {
        private Long id;
        private String title;
        private String content;
        private LocalDateTime createdAt;
        private User createdBy;

        public NoticeBuilder id(Long id) { this.id = id; return this; }
        public NoticeBuilder title(String title) { this.title = title; return this; }
        public NoticeBuilder content(String content) { this.content = content; return this; }
        public NoticeBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public NoticeBuilder createdBy(User createdBy) { this.createdBy = createdBy; return this; }
        public Notice build() { return new Notice(id, title, content, createdAt, createdBy); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
}
