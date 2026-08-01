package com.resume.analyzer.controller;

import com.resume.analyzer.dto.ApiResponse;
import com.resume.analyzer.dto.ResumeResponse;
import com.resume.analyzer.security.UserPrincipal;
import com.resume.analyzer.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<ResumeResponse>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ResumeResponse response = resumeService.uploadResume(file, currentUser.getId());
        return new ResponseEntity<>(ApiResponse.success("Resume uploaded successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResumeResponse>>> getUserResumes(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<ResumeResponse> responses = resumeService.getUserResumes(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Resumes retrieved successfully", responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResumeResponse>> getResumeById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ResumeResponse response = resumeService.getResumeById(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Resume retrieved successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResume(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        resumeService.deleteResume(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Resume deleted successfully", null));
    }
}
