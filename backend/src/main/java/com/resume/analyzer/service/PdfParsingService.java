package com.resume.analyzer.service;

import com.resume.analyzer.exception.BadRequestException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PdfParsingService {

    public String extractTextFromPdf(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty");
        }

        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".pdf")) {
            throw new BadRequestException("Only PDF files are supported");
        }

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            pdfStripper.setSortByPosition(true);
            String text = pdfStripper.getText(document);

            if (text == null || text.trim().isEmpty()) {
                throw new BadRequestException("Could not extract text from PDF. The file may be image-based or protected.");
            }

            return cleanExtractedText(text);
        } catch (IOException e) {
            throw new BadRequestException("Failed to parse PDF file: " + e.getMessage(), e);
        }
    }

    private String cleanExtractedText(String rawText) {
        return rawText.replaceAll("\\r\\n", "\n")
                .replaceAll("\\r", "\n")
                .replaceAll("[ \\t]+", " ")
                .replaceAll("\n{3,}", "\n\n")
                .trim();
    }
}
