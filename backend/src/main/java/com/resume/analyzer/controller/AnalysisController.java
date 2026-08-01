package com.resume.analyzer.controller;

import com.resume.analyzer.dto.AnalysisRequest;
import com.resume.analyzer.dto.AnalysisResponse;
import com.resume.analyzer.dto.ApiResponse;
import com.resume.analyzer.security.UserPrincipal;
import com.resume.analyzer.service.AnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<AnalysisResponse>> analyzeResume(
            @Valid @RequestBody AnalysisRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        AnalysisResponse response = analysisService.analyzeResume(request, currentUser.getId());
        return new ResponseEntity<>(ApiResponse.success("Resume analyzed successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AnalysisResponse>> getAnalysisById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        AnalysisResponse response = analysisService.getAnalysisById(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Analysis retrieved successfully", response));
    }

    @GetMapping("/resume/{resumeId}")
    public ResponseEntity<ApiResponse<AnalysisResponse>> getLatestAnalysisByResume(
            @PathVariable Long resumeId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        AnalysisResponse response = analysisService.getLatestAnalysisByResume(resumeId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Latest analysis retrieved successfully", response));
    }
}
