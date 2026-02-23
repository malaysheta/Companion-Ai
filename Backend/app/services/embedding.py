from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
from app.core.config import settings
from typing import List
import time
from app.core.responce import ApiError

class EmbeddingService:
    def __init__(self):
        if not settings.NVIDIA_API_KEY:
             raise ApiError(message="NVIDIA_API_KEY not found in environment variables", status_code=500, errors="Configuration Error")
        
        self.embeddings = NVIDIAEmbeddings(
            nvidia_api_key=settings.NVIDIA_API_KEY,
            model="nvidia/nv-embedqa-e5-v5" # Using a standard vigorous model, can be configured
        )

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generates embeddings for a list of texts.
        Includes retry logic for transient failures.
        """
        max_retries = 3
        max_input_length = 512  # conservative character limit to respect model token cap

        # Ensure no individual text exceeds the model's maximum token size (approx via chars)
        safe_texts = [
            text[:max_input_length] if len(text) > max_input_length else text
            for text in texts
        ]

        for attempt in range(max_retries):
            try:
                # embeddings.embed_documents automatically handles batching to some extent, 
                # but for very large lists we might want to manually batch. 
                # For now, relying on LangChain's implementation.
                return self.embeddings.embed_documents(safe_texts)
            except Exception as e:
                print(f"Error generating embeddings (attempt {attempt+1}/{max_retries}): {str(e)}")
                if attempt == max_retries - 1:
                    raise ApiError(message=f"Failed to generate embeddings after {max_retries} attempts: {str(e)}", status_code=500, errors="Embedding Error")
                time.sleep(2 ** attempt) # Exponential backoff

embedding_service = EmbeddingService()
