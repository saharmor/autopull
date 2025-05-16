from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import repositories, auth

app = FastAPI(
    title="Viral Devin",
    description="A platform that helps users find and implement 'low-hanging fruit' issues in GitHub repositories using coding agents.",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # Include both ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(repositories.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Viral Devin API",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 