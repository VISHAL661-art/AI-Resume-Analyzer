package com.resume.analyzer.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resume.analyzer.dto.AnalysisRequest;
import com.resume.analyzer.dto.AnalysisResponse;
import com.resume.analyzer.exception.BadRequestException;
import com.resume.analyzer.exception.ResourceNotFoundException;
import com.resume.analyzer.model.Analysis;
import com.resume.analyzer.model.Resume;
import com.resume.analyzer.repository.AnalysisRepository;
import com.resume.analyzer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final AnalysisRepository analysisRepository;
    private final ResumeRepository resumeRepository;
    private final ResumeService resumeService;
    private final AtsScoringService atsScoringService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public AnalysisResponse analyzeResume(AnalysisRequest request, Long userId) {
        Resume resume = resumeService.getResumeEntity(request.getResumeId(), userId);

        if (resume.getParsedText() == null || resume.getParsedText().trim().isEmpty()) {
            throw new BadRequestException("Resume text is empty. Cannot perform ATS analysis.");
        }

        AtsScoringService.AtsAnalysisResult result = atsScoringService.evaluate(
                resume.getParsedText(),
                request.getJobDescription()
        );

        String matchedSkillsJson = toJson(result.getMatchedSkills());
        String missingSkillsJson = toJson(result.getMissingSkills());
        String strengthsJson = toJson(result.getStrengths());
        String improvementsJson = toJson(result.getImprovements());

        Analysis analysis = Analysis.builder()
                .resume(resume)
                .jobDescription(request.getJobDescription())
                .matchedSkills(matchedSkillsJson)
                .missingSkills(missingSkillsJson)
                .strengths(strengthsJson)
                .improvements(improvementsJson)
                .atsScore(result.getScore())
                .build();

        Analysis savedAnalysis = analysisRepository.save(analysis);

        // Update resume overall ATS Score with latest analysis result
        resume.setAtsScore(result.getScore());
        resumeRepository.save(resume);

        return mapToAnalysisResponse(savedAnalysis, result.getMatchedSkills(), result.getMissingSkills(), result.getStrengths(), result.getImprovements());
    }

    public AnalysisResponse getAnalysisById(Long analysisId, Long userId) {
        Analysis analysis = analysisRepository.findById(analysisId)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis", "id", analysisId));

        // Verify ownership
        if (!analysis.getResume().getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Analysis", "id", analysisId);
        }

        return mapToAnalysisResponse(
                analysis,
                fromJson(analysis.getMatchedSkills()),
                fromJson(analysis.getMissingSkills()),
                fromJson(analysis.getStrengths()),
                fromJson(analysis.getImprovements())
        );
    }

    public AnalysisResponse getLatestAnalysisByResume(Long resumeId, Long userId) {
        // Verify ownership
        resumeService.getResumeEntity(resumeId, userId);

        Analysis analysis = analysisRepository.findTopByResumeIdOrderByCreatedAtDesc(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis for resume", "resumeId", resumeId));

        return mapToAnalysisResponse(
                analysis,
                fromJson(analysis.getMatchedSkills()),
                fromJson(analysis.getMissingSkills()),
                fromJson(analysis.getStrengths()),
                fromJson(analysis.getImprovements())
        );
    }

    private AnalysisResponse mapToAnalysisResponse(Analysis analysis, List<String> matched, List<String> missing, List<String> strengths, List<String> improvements) {
        return AnalysisResponse.builder()
                .id(analysis.getId())
                .resumeId(analysis.getResume().getId())
                .fileName(analysis.getResume().getFileName())
                .jobDescription(analysis.getJobDescription())
                .matchedSkills(matched)
                .missingSkills(missing)
                .strengths(strengths)
                .improvements(improvements)
                .atsScore(analysis.getAtsScore())
                .createdAt(analysis.getCreatedAt())
                .build();
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }

    private List<String> fromJson(String json) {
        if (json == null || json.trim().isEmpty()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return Collections.emptyList();
        }
    }
}
