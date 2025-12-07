//Handles pushing and popping jobs from Redis.

package com.aicodereview.service;

import com.aicodereview.model.CodeReviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class QueueService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Value("${app.queue.name}")
    private String queueName;

    // Push a new job to Redis
    public void pushRequest(CodeReviewRequest request) {
        redisTemplate.opsForList().leftPush(queueName, request);
        System.out.println("Job pushed to queue for file: " + request.getFilename());
    }

    // Pop a job from Redis (Blocking pop is better, but simple pop works for now)
    public CodeReviewRequest popRequest() {
        return (CodeReviewRequest) redisTemplate.opsForList().rightPop(queueName);
    }
}