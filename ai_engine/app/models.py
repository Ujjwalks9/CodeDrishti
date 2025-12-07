from pydantic import BaseModel, Field
from typing import List, Optional

class CodeRequest(BaseModel):
    filename: str
    content: str
    language: str

class ReviewIssue(BaseModel):
    type: str = Field(..., description="Category: Bug, Security, Performance, Style")
    line: int = Field(..., description="Line number where the issue occurs")
    description: str
    suggestion: str
    severity: str = Field(..., description="Severity level: LOW, MEDIUM, HIGH")

class Documentation(BaseModel):
    summary: str = Field(..., description="High-level summary of the code")
    function_docs: str = Field(..., description="Javadoc/Docstring for the functions")
    developer_notes: str = Field(..., description="Technical notes on patterns used")

class TestCases(BaseModel):
    unit_tests: str = Field(..., description="Actual code for unit tests (JUnit/PyTest)")
    edge_cases: List[str] = Field(..., description="List of edge cases to test")
    risk_assessment: str = Field(..., description="Risk analysis for QA")

class QualityScore(BaseModel):
    cyclomatic_complexity: str
    maintainability_index: int
    security_risk: str
    final_score: int = Field(..., description="Overall score 0-100")

class AnalysisResponse(BaseModel):
    review: List[ReviewIssue]
    documentation: Documentation
    test_cases: TestCases
    quality_score: QualityScore