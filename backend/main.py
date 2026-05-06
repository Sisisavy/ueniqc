import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from typing import List, Any

# 1. Initialize the App
app = FastAPI()

# 2. IMPORTANT: Fixes the CORS blockage (Frontend talking to Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Your Vite frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Setup OpenAI
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# Data Models
class QCRequest(BaseModel):
    transcript: str
    guidelines: List[Any]

# --- ROUTES ---

@app.get("/tickets")
async def get_tickets():
    # Return mock data for now. 
    # Replace this with your actual database call later.
    return [
        {"id": "1", "qc_status": "pending", "qc_score": None, "created_date": "2026-05-06"},
        {"id": "2", "qc_status": "passed", "qc_score": 95, "created_date": "2026-05-05"}
    ]

@app.get("/qcguidelines")
async def get_qc_guidelines():
    return [{"id": "1", "name": "Friendly Greeting"}, {"id": "2", "name": "Resolution Provided"}]

@app.post("/run-qc")
async def run_qc(req: QCRequest):
    try:
        prompt = f"Evaluate this transcript: {req.transcript}. Guidelines: {req.guidelines}. Return JSON: {{'score': number, 'status': 'passed'|'failed', 'summary': 'text'}}"
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)