//This matches the JSON expected by the Python AI Engine.

package com.aicodereview.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CodeReviewRequest implements Serializable {
    private String filename;
    private String content;
    private String language;
    private String prId; // Extra field to track which PR this belongs to
}