from fastapi import APIRouter,Depends,File,UploadFile,Form
from app.utils.oauth2 import get_current_user
from app.core.responce import ApiResponse
from app.database.mongoDb import get_manual_collection
from cloudinary.uploader import upload
from app.utils.cloudinary_config import cloudinary

router = APIRouter(tags=["Upload manual"])

@router.post('/upload_file',response_model=dict)
async def uploadfile(company_name: str = Form(...),
    product_name: str = Form(...),
    file: UploadFile = File(...),
    curr_user:dict=Depends(get_current_user)):

    collection = get_manual_collection()

    if not collection:
        raise ApiResponse.error(message="Manual Collection not found",status_code=500,errors="Internal servererror")
    
    print(file.file)
    result = upload(file.file , folder=f"manual/{company_name}",resource_type="auto")
    print(result)

    if not result:
        raise ApiResponse.error(message="Unable to upload in claudinary",status_code=500,errors="Claudinary error")
    
    file_object = {
        "company_name":company_name,
        "product_name":product_name,
        "file_name":file.filename,
        "claudinary_file_url":result['url'],
        "cloudinary_file_public_id":result['public_id'],
        "claudinary_qr_url":"We will get back to you soon!" ,
        "cloudinary_qr_public_id":"We will get back to you soon!",
        "uploaded_by": curr_user
    }
    responce=collection.insert_one(file_object)

    if not responce:
        raise ApiResponse.error(message="Unable to store in mongodb",status_code=500,errors="MongoDB error")

    return ApiResponse.success(data=str(file_object),status_code=200,message="Successfully stored and upload the file") 