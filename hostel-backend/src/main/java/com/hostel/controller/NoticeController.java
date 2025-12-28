package com.hostel.controller;

import com.hostel.entity.Notice;
import com.hostel.entity.User;
import com.hostel.service.NoticeService;
import com.hostel.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {
    private final NoticeService noticeService;
    private final AuthService authService;

    public NoticeController(NoticeService noticeService, AuthService authService) {
        this.noticeService = noticeService;
        this.authService = authService;
    }

    @GetMapping("")
    public ResponseEntity<List<Notice>> getAllNotices() {
        System.out.println("GET /api/notices hit");
        try {
            List<Notice> notices = noticeService.getAllNotices();
            System.out.println("Fetched " + notices.size() + " notices");
            return ResponseEntity.ok(notices);
        } catch (Exception e) {
            System.err.println("Error fetching notices: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createNotice(@RequestBody Notice notice) {
        System.out.println("POST /api/notices hit with: " + notice.getTitle());
        
        if (notice.getTitle() == null || notice.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Title is required");
        }
        if (notice.getContent() == null || notice.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Content is required");
        }

        try {
            User currentUser = authService.getCurrentUser();
            if (currentUser == null) {
                System.out.println("No current user found for notice creation");
                return ResponseEntity.status(401).body("User not authenticated");
            }
            notice.setCreatedBy(currentUser);
            if (notice.getCreatedAt() == null) {
                notice.setCreatedAt(java.time.LocalDateTime.now());
            }
            
            Notice createdNotice = noticeService.createNotice(notice);
            System.out.println("Notice created with ID: " + createdNotice.getId());
            return ResponseEntity.ok(createdNotice);
        } catch (Exception e) {
            System.err.println("Error creating notice: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error creating notice: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok().build();
    }
}
