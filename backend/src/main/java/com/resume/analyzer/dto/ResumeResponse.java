package com.resume.analyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeResponse {

    private Long id;
    private String fileName;
    private String filePath;
    private LocalDateTime uploadDate;
    private Integer atsScore;
    private Long userId;
    private String parsedTextSnippet;
}
