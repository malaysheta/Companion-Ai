from fastapi import FastAPI,Request
from app.database.mongoDb import connect_to_mongo, close_mongo_connection
from fastapi.responses import JSONResponse
from app.api.routes.user import router as user_router
from app.api.routes.upload import router as manual_router
from app.api.routes.manuals import router as manual_retrival_router
from app.core.responce import ApiError
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Companion AI Backend")

# Define allowed origins for CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://companion-ai-iota.vercel.app",
    "https://companion-ai.vercel.app",
]

# Add CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(ApiError)
async def api_error_handler(request: Request, exc: ApiError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message,
            "errors": "internal server errors"
        }
    )
@app.on_event("startup")
def startup():
    connect_to_mongo()

@app.on_event("shutdown")
def shutdown():
    close_mongo_connection()

# routers
app.include_router(user_router)
app.include_router(manual_router)
app.include_router(manual_retrival_router)

@app.get("/")
def root():
    return {"message": "Companion AI API is running"}



@app.get("/health")
def abc():
    return {"status": "healthy"}


