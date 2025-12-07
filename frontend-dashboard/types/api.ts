// The structure of data we send to the backend
export interface ReviewRequest {
  filename: string;
  language: string;
  code: string;
  prId: string;
}

// The structure of data we receive back (Matches Python Pydantic models)
export interface ReviewIssue {
  type: string;
  line:number;
  description: string;
  suggestion: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

export interface Documentation {
  summary: string;
  function_docs: string;
  developer_notes: string;
}

export interface TestCases {
  unit_tests: string;
  edge_cases: string[];
  risk_assessment: string;
}

export interface QualityScore {
  cyclomatic_complexity: string;
  maintainability_index: number;
  security_risk: string;
  final_score: number;
}

// The main response object stored in Postgres JSONB column
export interface AIAnalysisResult {
  review: ReviewIssue[];
  documentation: Documentation;
  test_cases: TestCases;
  quality_score: QualityScore;
}

// The wrapper object coming from Spring Boot Entity
export interface BackendReviewResponse {
  id: number;
  prId: string;
  filename: string;
  language: string;
  reviewDate: string;
  // Important: Spring Boot sends the JSON string, we need to parse it on frontend
  aiResultJson: string; 
}