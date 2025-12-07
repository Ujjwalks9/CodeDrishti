//This is Feature 6 (Distributed Worker). It runs in the background, checks Redis, and sends jobs to the AI.


package com.aicodereview.worker;

import com.aicodereview.model.CodeReviewRequest;
import com.aicodereview.model.ReviewResult;
import com.aicodereview.repository.ReviewResultRepository; // NEW IMPORT
import com.aicodereview.service.AIClientService;
import com.aicodereview.service.QueueService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ReviewWorker {

    private final QueueService queueService;
    private final AIClientService aiClientService;
    private final ReviewResultRepository reviewResultRepository; // NEW FIELD

    // Update Constructor
    public ReviewWorker(QueueService queueService, AIClientService aiClientService, ReviewResultRepository reviewResultRepository) {
        this.queueService = queueService;
        this.aiClientService = aiClientService;
        this.reviewResultRepository = reviewResultRepository;
    }

    @Scheduled(fixedDelay = 5000)
    public void processQueue() {
        CodeReviewRequest request = queueService.popRequest();

        if (request != null) {
            System.out.println("Worker: Processing " + request.getFilename());

            // 1. Call Phase 1 (Python Engine)
            String resultJson = aiClientService.sendToAI(request);

            if (resultJson != null) {
                // 2. Persist the result to PostgreSQL
                ReviewResult review = new ReviewResult(
                        request.getPrId(),
                        request.getFilename(),
                        request.getLanguage(),
                        resultJson // The raw JSON string from Python
                );
                reviewResultRepository.save(review);

                System.out.println("Worker: Review Completed & SAVED to DB for " + request.getFilename());
            }
        }
    }
}