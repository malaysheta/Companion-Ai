from fastapi import APIRouter, Depends

from app.core.responce import ApiError, ApiResponse
from app.database.mongoDb import get_manual_collection
from app.schema.manualSchema import ManualQueryRequest
from app.services.retrieval import retrieval_service
from app.utils.cloudinary_config import cloudinary
from app.utils.oauth2 import get_current_user
from cloudinary.uploader import destroy

# from cloudinary.api import resource

router = APIRouter(tags=["manuals"])


@router.get("/users_manual")
async def get_users_manual(curr_user: str = Depends(get_current_user)):
    collection = get_manual_collection()

    if collection is None:
        raise ApiError(
            message="Manuals collection not found",
            status_code=500,
            errors="Internal server error",
        )

    manuals = []
    if curr_user == "admin@gmail.com":
        manual = collection.find(
            {"uploaded_by": {"$ne": "admin@gmail.com"}},
            {
                "_id": 0,
                "company_name": 1,
                "product_name": 1,
                "file_name": 1,
                "uploaded_by": 1,
            },
        )
    else:
        manual = collection.find(
            {"uploaded_by": curr_user},
            {
                "_id": 0,
                "company_name": 1,
                "product_name": 1,
                "file_name": 1,
            },
        )

    for x in manual:
        manuals.append(x)

    return ApiResponse.success(
        data=manuals, status_code=200, message="Manuals fetch successfully"
    )


@router.get("/admins_manulas")
async def get_admins_manual(curr_user: str = Depends(get_current_user)):
    collection = get_manual_collection()

    if collection is None:
        raise ApiError(
            message="Manuals collection not found",
            status_code=500,
            errors="Internal server error",
        )

    manuals = []
    manual = collection.find(
        {"uploaded_by": "admin@gmail.com"},
        {
            "_id": 0,
            "company_name": 1,
            "product_name": 1,
            "file_name": 1,
        },
    )

    for x in manual:
        manuals.append(x)

    return ApiResponse.success(
        data=manuals, status_code=200, message="Admins Manuals fetch successfully"
    )


@router.delete("/manual/{company_name}/{product_name}")
async def delete_manual(
    company_name: str,
    product_name: str,
    curr_user: str = Depends(get_current_user),
):
    collection = get_manual_collection()
    if collection is None:
        raise ApiError(
            "Manual collection not found",
            status_code=500,
            errors="something went wrong on server",
        )
    manual = collection.find_one(
        {
            "company_name": company_name,
            "product_name": product_name,
        },
        {
            "cloudinary_file_public_id": 1,
            "cloudinary_qr_public_id": 1,
            "uploaded_by": 1,
        },
    )
    if manual is None:
        raise ApiError(status_code=404, message="manual not found")
    # qdrant embedings deletion code
    print(manual)
    if (curr_user != "admin@gmail.com") & (manual["uploaded_by"] != curr_user):
        raise ApiError(
            status_code=401,
            message="unauthorize access, you are not permited to delete this manual",
        )

    manual_public_id = manual["cloudinary_file_public_id"]
    manual_qr_public_id = manual["cloudinary_qr_public_id"]
    # deleting from cloudinary
    # this code is for fixing and detecting bugs if they comes again in future
    # print(resource(manual_public_id))
    # resource_type_manual_pdf=resource(manual_public_id).get("resource_type")
    # print(resource_type_manual_pdf)
    res = destroy(public_id=manual_public_id, resource_type="raw")
    print(res)
    res = destroy(public_id=manual_qr_public_id, resource_type="image")
    print(res)
    print("manual deleted successfully")
    collection.delete_one(
        {
            "_id": manual["_id"],
        }
    )

    return ApiResponse.success(
        message="collection deleted successfully", data={}, status_code=202
    )


@router.post("/manual_query", response_model=dict)
async def manual_query(
    request: ManualQueryRequest,
    curr_user: str = Depends(get_current_user),
):
    """
    Retrieve relevant manual chunks for a given query and manual identifiers.

    Uses Qdrant vector search filtered by company, product, and product code.
    """
    # Optionally, we could validate that the requested manual exists for this user.
    # For now, we trust the identifiers and rely on vector DB filters.
    contexts = retrieval_service.retrieve_manual_context(
        query=request.query,
        company_name=request.company_name,
        product_name=request.product_name,
        product_code=request.product_code,
        top_k=request.top_k,
    )

    return ApiResponse.success(
        data={"results": contexts},
        status_code=200,
        message="Retrieved relevant manual chunks successfully",
    )
