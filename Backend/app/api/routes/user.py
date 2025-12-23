from fastapi import APIRouter
from bson import ObjectId
from typing import List
from app.core.responce import ApiResponse
from app.schema import userSchema
from app.database import mongoDb
from app.utils.hashing import Hash


router = APIRouter(tags=["User"])


@router.post('/create_user',response_model=dict)
async def create_user(request : userSchema.CreateUser):
    collection = mongoDb.get_user_collection()

    if not collection:
        return ApiResponse.error(message="User collection not found",status_code=500,errors="Internal server error")

    hashed_pass = Hash.bcrypt(request.password)

    user_data = {
        "username" : request.username,
        "email" : request.email,
        "password" : hashed_pass,
    }

    user = collection.insert_one(user_data)

    if not user:
        return ApiResponse.error(message="User not created!",status_code=500,errors="Internal server error")
    
    return ApiResponse.success(message="User created successfully")
