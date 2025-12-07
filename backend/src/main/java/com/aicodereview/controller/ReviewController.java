//This controller exposes the endpoints to the outside world. 
//I have added @CrossOrigin so your future Frontend (Next.js) can talk to it without security errors.

package com.aicodereview.controller;

import com.aicodereview.model.ReviewResult;
import com.aicodereview.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/review")
@CrossOrigin(origins = "http://localhost:3000") // Allows Next.js (port 3000) to access this API
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    /**
     * Endpoint to manually submit code for review.
     * Usage: POST /api/review/manual
     */
    @PostMapping("/manual")
    public String triggerManualReview(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        String language = request.get("language");
        String filename = request.getOrDefault("filename", "unknown.file");
        String prId = request.getOrDefault("prId", "manual-test"); // Default ID for testing

        return reviewService.triggerManualReview(filename, code, language, prId);
    }

    /**
     * Endpoint to fetch completed reviews.
     * Usage: GET /api/review/pr/{prId}
     */
    @GetMapping("/pr/{prId}")
    public List<ReviewResult> getReviews(@PathVariable String prId) {
        return reviewService.getReviewsByPrId(prId);
    }
}