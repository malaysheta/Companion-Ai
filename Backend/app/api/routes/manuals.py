from fastapi import APIRouter,Depends
from app.database.mongoDb import get_manual_collection
from app.utils.oauth2 import get_current_user
from app.core.responce import ApiError,ApiResponse

router = APIRouter(tags=["manuals"])


@router.get('/users_manual')
async def get_users_manual(curr_user:dict=Depends(get_current_user)):
    collection = get_manual_collection()

    if collection is None:
        raise ApiError(message="Manuals collection not found",status_code=500,errors="Internal server error")
    
    manuals = []
    manual = collection.find({"uploaded_by":curr_user},{
        "_id": 0,
        "company_name": 1,
        "product_name": 1,
        "file_name": 1})

    for x in manual:
        manuals.append(x)
    
    return ApiResponse.success(data=manuals,status_code=200,message="Manuals fetch successfully")
        
