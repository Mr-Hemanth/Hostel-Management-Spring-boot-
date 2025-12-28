package com.hostel.service;

import com.hostel.entity.Notice;
import com.hostel.repository.NoticeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {
    private final NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    public List<Notice> getAllNotices() {
        return noticeRepository.findAllByOrderByCreatedAtDesc();
    }

    public Notice createNotice(Notice notice) {
        return noticeRepository.save(notice);
    }

    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }
}
