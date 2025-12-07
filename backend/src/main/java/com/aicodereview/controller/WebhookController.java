//The public door that receives data.

package com.aicodereview.controller;

import com.aicodereview.model.CodeReviewRequest;
import com.aicodereview.service.QueueService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhook")
public class WebhookController {

    private final QueueService queueService;

    public WebhookController(QueueService queueService) {
        this.queueService = queueService;
    }

    // This simulates receiving a file from GitHub
    @PostMapping("/submit")
    public String receiveRequest(@RequestBody CodeReviewRequest request) {
        queueService.pushRequest(request);
        return "Job received and queued for: " + request.getFilename();
    }
}