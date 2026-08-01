package com.resume.analyzer.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AtsScoringService {

    private static final Set<String> KNOWN_SKILLS = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);

    static {
        // Technical & Domain Skills Dictionary
        KNOWN_SKILLS.addAll(Arrays.asList(
                "Java", "Spring", "Spring Boot", "Spring Security", "Spring Data JPA", "Hibernate",
                "React", "React.js", "Redux", "Vite", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind", "Tailwind CSS",
                "Node.js", "Express", "Python", "Django", "Flask", "C++", "C#", ".NET", "PHP", "Laravel", "Ruby", "Rails",
                "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Oracle", "SQLite", "NoSQL",
                "REST", "RESTful API", "GraphQL", "Microservices", "Kafka", "RabbitMQ", "gRPC",
                "Docker", "Kubernetes", "AWS", "Amazon Web Services", "Azure", "GCP", "Google Cloud",
                "Git", "GitHub", "GitLab", "CI/CD", "Jenkins", "Terraform", "Linux", "Unix", "Bash",
                "JUnit", "Mockito", "Selenium", "Jest", "Cypress", "Postman",
                "Data Structures", "Algorithms", "System Design", "Object Oriented Programming", "OOP",
                "Agile", "Scrum", "Jira", "Maven", "Gradle", "NPM", "Webpack",
                "JWT", "OAuth", "Security", "BCrypt", "JSON", "XML", "PDFBox"
        ));

        // Additional Soft Skills
        KNOWN_SKILLS.addAll(Arrays.asList(
                "Communication", "Leadership", "Problem Solving", "Teamwork", "Time Management",
                "Critical Thinking", "Adaptability", "Project Management", "Analytical", "Collaboration"
        ));
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AtsAnalysisResult {
        private int score;
        private List<String> matchedSkills;
        private List<String> missingSkills;
        private List<String> strengths;
        private List<String> improvements;
    }

    public AtsAnalysisResult evaluate(String resumeText, String jobDescription) {
        if (resumeText == null) resumeText = "";
        if (jobDescription == null) jobDescription = "";

        String normalizedResume = resumeText.toLowerCase();
        String normalizedJd = jobDescription.toLowerCase();

        // 1. Extract Skills required by Job Description
        Set<String> requiredSkillsInJd = extractSkillsFromText(jobDescription);
        
        // 2. Identify Matched and Missing Skills
        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        for (String skill : requiredSkillsInJd) {
            if (containsSkill(normalizedResume, skill)) {
                matchedSkills.add(skill);
            } else {
                missingSkills.add(skill);
            }
        }

        // Calculate Skill Match Score (50% weight)
        double skillMatchPercentage = requiredSkillsInJd.isEmpty() ? 70.0 :
                ((double) matchedSkills.size() / requiredSkillsInJd.size()) * 100.0;

        // 3. Section Analysis Score (30% weight)
        Map<String, Boolean> sectionsFound = checkResumeSections(normalizedResume);
        long sectionsCount = sectionsFound.values().stream().filter(Boolean::booleanValue).count();
        double sectionScore = (sectionsCount / 5.0) * 100.0; // 5 key sections evaluated

        // 4. Formatting & Word Count Score (20% weight)
        double lengthScore = evaluateWordCountAndDensity(resumeText);

        // Weighted Final ATS Score Calculation (0-100)
        int finalScore = (int) Math.round(
                (skillMatchPercentage * 0.50) +
                (sectionScore * 0.30) +
                (lengthScore * 0.20)
        );
        finalScore = Math.min(100, Math.max(0, finalScore));

        // 5. Generate Strengths
        List<String> strengths = generateStrengths(matchedSkills, sectionsFound, finalScore, resumeText);

        // 6. Generate Areas for Improvement
        List<String> improvements = generateImprovements(missingSkills, sectionsFound, finalScore, resumeText);

        return AtsAnalysisResult.builder()
                .score(finalScore)
                .matchedSkills(matchedSkills.stream().distinct().sorted().collect(Collectors.toList()))
                .missingSkills(missingSkills.stream().distinct().sorted().collect(Collectors.toList()))
                .strengths(strengths)
                .improvements(improvements)
                .build();
    }

    private Set<String> extractSkillsFromText(String text) {
        Set<String> found = new LinkedHashSet<>();
        String normalized = text.toLowerCase();

        for (String skill : KNOWN_SKILLS) {
            if (containsSkill(normalized, skill)) {
                found.add(skill);
            }
        }

        // Fallback: extract capitalized tech acronyms or keywords if dictionary matches < 3
        if (found.size() < 3) {
            Pattern pattern = Pattern.compile("\\b[A-Z][a-zA-Z0-9+#.]{1,15}\\b");
            Matcher matcher = pattern.matcher(text);
            while (matcher.find()) {
                String candidate = matcher.group();
                if (!isCommonEnglishWord(candidate)) {
                    found.add(candidate);
                }
            }
        }

        return found;
    }

    private boolean containsSkill(String text, String skill) {
        String regex = "(?i)\\b" + Pattern.quote(skill) + "\\b";
        return Pattern.compile(regex).matcher(text).find();
    }

    private Map<String, Boolean> checkResumeSections(String text) {
        Map<String, Boolean> sections = new HashMap<>();
        sections.put("Education", text.contains("education") || text.contains("university") || text.contains("bachelor") || text.contains("master") || text.contains("degree"));
        sections.put("Experience", text.contains("experience") || text.contains("employment") || text.contains("work history") || text.contains("career"));
        sections.put("Projects", text.contains("project") || text.contains("portfolio") || text.contains("key initiatives"));
        sections.put("Skills", text.contains("skill") || text.contains("technologies") || text.contains("competencies") || text.contains("proficiencies"));
        sections.put("Certifications", text.contains("certif") || text.contains("license") || text.contains("courses"));
        return sections;
    }

    private double evaluateWordCountAndDensity(String text) {
        if (text == null || text.trim().isEmpty()) return 0.0;
        String[] words = text.trim().split("\\s+");
        int count = words.length;

        if (count >= 250 && count <= 800) {
            return 100.0; // Optimal length for 1-2 page resume
        } else if (count >= 150 && count < 250) {
            return 75.0; // Slightly brief
        } else if (count > 800 && count <= 1200) {
            return 80.0; // Detailed
        } else if (count > 1200) {
            return 60.0; // Overly long
        } else {
            return 40.0; // Too short
        }
    }

    private List<String> generateStrengths(List<String> matchedSkills, Map<String, Boolean> sections, int score, String text) {
        List<String> strengths = new ArrayList<>();

        if (!matchedSkills.isEmpty()) {
            strengths.add("Strong skill alignment on key requirements: " +
                    matchedSkills.stream().limit(5).collect(Collectors.joining(", ")));
        }

        if (Boolean.TRUE.equals(sections.get("Experience"))) {
            strengths.add("Includes structured Work Experience / Career history section.");
        }

        if (Boolean.TRUE.equals(sections.get("Education"))) {
            strengths.add("Clearly outlines academic degree & educational qualifications.");
        }

        if (Boolean.TRUE.equals(sections.get("Projects"))) {
            strengths.add("Demonstrates practical application with documented Projects.");
        }

        if (score >= 75) {
            strengths.add("High overall ATS compatibility score for corporate screening filters.");
        }

        if (text.length() > 500 && text.contains("@")) {
            strengths.add("Professional contact information (email address) detected.");
        }

        if (strengths.isEmpty()) {
            strengths.add("Clean document formatting suitable for text extraction.");
        }

        return strengths;
    }

    private List<String> generateImprovements(List<String> missingSkills, Map<String, Boolean> sections, int score, String text) {
        List<String> improvements = new ArrayList<>();

        if (!missingSkills.isEmpty()) {
            improvements.add("Incorporate missing high-priority keywords from the job description: " +
                    missingSkills.stream().limit(6).collect(Collectors.joining(", ")));
        }

        if (Boolean.FALSE.equals(sections.get("Projects"))) {
            improvements.add("Add a dedicated 'Projects' section highlighting real-world technical builds.");
        }

        if (Boolean.FALSE.equals(sections.get("Certifications"))) {
            improvements.add("Consider adding relevant industry certifications or online course accreditations.");
        }

        String[] words = text.trim().split("\\s+");
        if (words.length < 250) {
            improvements.add("Expand resume content with quantifiable metrics and achievements (aim for 300+ words).");
        } else if (words.length > 1000) {
            improvements.add("Condense content to 1-2 pages to ensure recruiter readability.");
        }

        if (!text.toLowerCase().contains("github") && !text.toLowerCase().contains("linkedin")) {
            improvements.add("Include links to your LinkedIn profile and GitHub / online portfolio.");
        }

        if (score < 60) {
            improvements.add("Tailor your summary and bullet points directly using exact terminology from the target job post.");
        }

        return improvements;
    }

    private boolean isCommonEnglishWord(String word) {
        Set<String> stopWords = new HashSet<>(Arrays.asList(
                "The", "And", "For", "With", "That", "This", "From", "Your", "Have", "Will",
                "Must", "Role", "Job", "Work", "Team", "Company", "About", "Requirements", "Duties"
        ));
        return stopWords.contains(word);
    }
}
