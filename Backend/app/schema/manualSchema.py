from pydantic import BaseModel


# this is what my schema looks like in database
class manual(BaseModel):
    company_name:str
    product_name:str
    file_name:str
    claudinary_file_url:str
    cloudinary_file_public_id:str
    claudinary_qr_url:str
    cloudinary_qr_public_id:str
    uploaded_by:str


class uploadManual(BaseModel):
    company_name:str
    product_name:str
    file_name:str