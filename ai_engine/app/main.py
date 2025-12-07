from fastapi import FastAPI, HTTPException
from app.models import CodeRequest, AnalysisResponse
from app.services import analyze_code

app = FastAPI(
    title="AI Code Review Engine",
    version="1.0.0",
    description="Microservice powered by Grok & LangChain"
)

@app.get("/")
def health_check():
    return {"status": "AI Engine is Running", "model": "grok-beta"}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(request: CodeRequest):
    """
    Main entry point for code analysis.
    """
    if not request.content.strip():
        raise HTTPException(status_code=400, detail="Code content cannot be empty")
    
    try:
        # Calling the synchronous service. 
        # In high-load, we would run this in a threadpool or make services.py async.
        analysis = analyze_code(request.content, request.language)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))