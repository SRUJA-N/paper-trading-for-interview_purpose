from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import auth, trade, portfolio, websocket

# App init
app = FastAPI()

# Create DB tables
models.Base.metadata.create_all(bind=engine)

# CORS
origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(trade.router)
app.include_router(portfolio.router)
app.include_router(websocket.router)
