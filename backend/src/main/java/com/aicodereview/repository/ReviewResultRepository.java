//Create a new directory repository and the repository interface.

package com.aicodereview.repository;

import com.aicodereview.model.ReviewResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewResultRepository extends JpaRepository<ReviewResult, Long> {
    // Custom query to support the upcoming dashboard (Feature 8)
    List<ReviewResult> findAllByPrId(String prId);
}