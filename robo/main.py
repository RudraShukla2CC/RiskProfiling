from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import risk, portfolio  

app = FastAPI(title="Risk Profiling API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(risk.router, prefix="/risk", tags=["risk"])
app.include_router(portfolio.router, prefix="/portfolio", tags=["portfolio"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)