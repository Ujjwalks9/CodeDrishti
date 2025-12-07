//This service acts as the bridge. It handles writing jobs to the queue (for async processing) 
// and reading completed results from the database.

package com.aicodereview.service;

import com.aicodereview.model.CodeReviewRequest;
import com.aicodereview.model.ReviewResult;
import com.aicodereview.repository.ReviewResultRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final QueueService queueService;
    private final ReviewResultRepository reviewResultRepository;

    // Constructor Injection
    public ReviewService(QueueService queueService, ReviewResultRepository reviewResultRepository) {
        this.queueService = queueService;
        this.reviewResultRepository = reviewResultRepository;
    }

    /**
     * Feature 6: Distributed Job Queue
     * Pushes a manual review request to Redis. The Worker will pick this up later.
     */
    public String triggerManualReview(String filename, String code, String language, String prId) {
        // Create the request object
        CodeReviewRequest request = new CodeReviewRequest(filename, code, language, prId);
        
        // Push to Redis Queue
        queueService.pushRequest(request);
        
        return "Review queued successfully for file: " + filename;
    }

    /**
     * Feature 8: Backend Support for Dashboard
     * Fetches all completed reviews for a specific Pull Request ID.
     */
    public List<ReviewResult> getReviewsByPrId(String prId) {
        return reviewResultRepository.findAllByPrId(prId);
    }
}