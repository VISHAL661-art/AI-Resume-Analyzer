package com.resume.analyzer.repository;

import com.resume.analyzer.model.Analysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, Long> {

    List<Analysis> findByResumeIdOrderByCreatedAtDesc(Long resumeId);

    Optional<Analysis> findTopByResumeIdOrderByCreatedAtDesc(Long resumeId);
}
