package com.resume.analyzer.service;

import com.resume.analyzer.dto.ResumeResponse;
import com.resume.analyzer.exception.BadRequestException;
import com.resume.analyzer.exception.FileStorageException;
import com.resume.analyzer.exception.ResourceNotFoundException;
import com.resume.analyzer.model.Resume;
import com.resume.analyzer.model.User;
import com.resume.analyzer.repository.ResumeRepository;
import com.resume.analyzer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final PdfParsingService pdfParsingService;

    @Transactional
    public ResumeResponse uploadResume(MultipartFile file, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file.");
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        if (originalFilename.contains("..")) {
            throw new BadRequestException("Filename contains invalid path sequence " + originalFilename);
        }

        if (!originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new BadRequestException("Only PDF files are supported");
        }

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String storedFileName = UUID.randomUUID() + "_" + originalFilename;
            Path targetLocation = uploadPath.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Extract text from PDF
            String parsedText = pdfParsingService.extractTextFromPdf(file);

            Resume resume = Resume.builder()
                    .fileName(originalFilename)
                    .filePath(targetLocation.toString())
                    .parsedText(parsedText)
                    .atsScore(0)
                    .user(user)
                    .build();

            Resume savedResume = resumeRepository.save(resume);
            return mapToResumeResponse(savedResume);

        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + originalFilename + ". Please try again!", ex);
        }
    }

    public List<ResumeResponse> getUserResumes(Long userId) {
        List<Resume> resumes = resumeRepository.findByUserIdOrderByUploadDateDesc(userId);
        return resumes.stream()
                .map(this::mapToResumeResponse)
                .collect(Collectors.toList());
    }

    public ResumeResponse getResumeById(Long id, Long userId) {
        Resume resume = resumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "id", id));
        return mapToResumeResponse(resume);
    }

    @Transactional
    public void deleteResume(Long id, Long userId) {
        Resume resume = resumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "id", id));

        // Delete file from local disk if it exists
        try {
            Path filePath = Paths.get(resume.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException ignored) {
        }

        resumeRepository.delete(resume);
    }

    public Resume getResumeEntity(Long id, Long userId) {
        return resumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "id", id));
    }

    public ResumeResponse mapToResumeResponse(Resume resume) {
        String textSnippet = "";
        if (resume.getParsedText() != null) {
            textSnippet = resume.getParsedText().substring(0, Math.min(250, resume.getParsedText().length())) + "...";
        }

        return ResumeResponse.builder()
                .id(resume.getId())
                .fileName(resume.getFileName())
                .filePath(resume.getFilePath())
                .uploadDate(resume.getUploadDate())
                .atsScore(resume.getAtsScore())
                .userId(resume.getUser().getId())
                .parsedTextSnippet(textSnippet)
                .build();
    }
}
