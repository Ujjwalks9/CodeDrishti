//This Java class will represent a row in your review_result table. 
// We use the PostgreSQL JSONB type to store the complex JSON output from the AI in a single, searchable column.


package com.aicodereview.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "review_results")
@Data
@NoArgsConstructor
public class ReviewResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Core data from the job
    private String prId; // Pull Request ID (for filtering)
    private String filename;
    private String language;
    private LocalDateTime reviewDate = LocalDateTime.now();

    // Store the raw JSON output from the AI in a JSONB column for flexibility
    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String aiResultJson; // Store the entire analysis as JSON string

    public ReviewResult(String prId, String filename, String language, String aiResultJson) {
        this.prId = prId;
        this.filename = filename;
        this.language = language;
        this.aiResultJson = aiResultJson;
    }
}