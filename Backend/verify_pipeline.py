import asyncio
from app.services.pipeline import pipeline_service
from app.services.pdf_processing import pdf_processor
from unittest.mock import MagicMock
import sys

# Mocking PDF extraction to avoid needing a real PDF file for this quick test
# We want to verify Chunking -> Embedding -> Vector DB flow
pdf_processor.extract_text = MagicMock(return_value=[
    {"text": "This is a comprehensive test of the Companion AI vector embedding pipeline. " * 10, "page_number": 1},
    {"text": "Refraction is the bending of light (it also happens with sound, water and other waves) as it passes from one transparent substance into another.", "page_number": 2}   
])

async def test_pipeline():
    print("Running Pipeline Verification...")
    
    metadata = {
        "user_id": "test_user_123",
        "email_id": "test@example.com",
        "company_name": "TestCorp",
        "product_name": "TestProduct",
        "product_code": "TP001"
    }
    
    try:
        # Pass dummy bytes since we mocked extract_text
        doc_id = await pipeline_service.process_document(b"dummy_pdf_content", metadata)
        print(f"\n✅ Pipeline completed successfully!")
        print(f"Document ID: {doc_id}")
    except Exception as e:
        print(f"\n❌ Pipeline failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Ensure env vars are loaded
    from app.core.config import settings
    print(f"Checking Config: QDRANT_URL={settings.QDRANT_URL}")
    if not settings.NVIDIA_API_KEY:
        print("⚠️ NVIDIA_API_KEY is missing. Embeddings will fail.")
    else:
        print("NVIDIA_API_KEY is present.")

    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(test_pipeline())
