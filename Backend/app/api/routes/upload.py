from fastapi import APIRouter,Depends,File,UploadFile,Form
from app.utils.oauth2 import get_current_user
from app.core.responce import ApiResponse
from app.database.mongoDb import get_manual_collection
from cloudinary.uploader import upload
from app.core.responce import ApiError
from app.utils.cloudinary_config import cloudinary
from app.utils.qr import generate_qr_code,upload_qr_to_cloudinary
from app.services.pipeline import pipeline_service
import io

router = APIRouter(tags=["Upload manual"])


@router.post('/upload_file',response_model=dict)
async def uploadfile(company_name: str = Form(...),
    product_name: str = Form(...),
    product_code: str = Form(...),
    file: UploadFile = File(...),
    curr_user:str=Depends(get_current_user)):

    if file.content_type != "application/pdf":
        raise ApiError(message="Invalid file type. Only PDF allowed.", status_code=400, errors="File Type Error")

    collection = get_manual_collection()
    # print(curr_user)
    if collection is None:
        raise ApiError(message="Manual Collection not found",status_code=500,errors="Internal servererror")
    
    # Read file content for processing
    file_content = await file.read()

    # Metadata for vector DB
    metadata = {
        "company_name": company_name,
        "product_name": product_name,
        "product_code": product_code,
        "email_id": curr_user, # Assuming curr_user is the identifier/email
        "original_filename": file.filename
    }

    # Process Document (Vector Pipeline)
    try:
        document_id = await pipeline_service.process_document(file_content, metadata)
    except Exception as e:
        raise ApiError(message=f"Pipeline processing failed: {str(e)}", status_code=500, errors="Pipeline Error")

    # Upload to Cloudinary
    # Reset file cursor or use bytes
    result = upload(io.BytesIO(file_content), folder=f"manual/{company_name}", resource_type="raw")
    # print(result)

    if result is None:
        raise ApiError(message="Unable to upload in claudinary",status_code=500,errors="Claudinary error")
    
    image_stream=generate_qr_code(company_name=company_name,product_name=product_name,product_code=product_code)

    qr=upload_qr_to_cloudinary(qr_buffer=image_stream,public_id=f"{company_name}_{product_name}")
    
    file_object = {
        "document_id": document_id, # vector db ref
        "company_name":company_name,
        "product_name":product_name,
        "product_code":product_code,
        "file_name":file.filename,
        "claudinary_file_url":result['url'],
        "cloudinary_file_public_id":result['public_id'],
        "claudinary_qr_url":qr['url'],
        "cloudinary_qr_public_id":qr['public_id'],
        "uploaded_by": curr_user,
        "processed": True
    }
    responce=collection.insert_one(file_object)
    file_object["_id"] = str(responce.inserted_id)
    if responce is None:
        raise ApiError(message="Unable to store in mongodb",status_code=500,errors="MongoDB error")
    
    return ApiResponse.success(data=file_object,status_code=200,message="Successfully stored and processed the file")