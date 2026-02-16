from app.services.pdf_processing import pdf_processor
from app.services.chunking import chunking_service
from app.services.embedding import embedding_service
from app.services.vector_db import vector_db_service
from typing import Dict, Any
from app.core.responce import ApiError
import uuid

class PipelineService:
    async def process_document(self, file_content: bytes, metadata: Dict[str, Any]):
        """
        Orchestrates the PDF processing pipeline.
        1. Extract text
        2. Chunk text
        3. Generate embeddings
        4. Store in Vector DB
        """
        try:
            # 1. Extract Text
            print("Starting text extraction...")
            extraction_result = pdf_processor.extract_text(file_content)
            if not extraction_result:
                raise ApiError(message="No text extracted from PDF", status_code=400, errors="Empty PDF")

            # 2. Chunk Text
            print("Starting chunking...")
            # Ensure document_id is present
            if "document_id" not in metadata:
                metadata["document_id"] = str(uuid.uuid4())
            
            chunks = chunking_service.create_chunks(extraction_result, metadata)
            if not chunks:
                 raise ApiError(message="No chunks created", status_code=500, errors="Chunking Error")
            
            # 3. Generate Embeddings
            print(f"Generating embeddings for {len(chunks)} chunks...")
            texts_to_embed = [chunk['text'] for chunk in chunks]
            embeddings = embedding_service.generate_embeddings(texts_to_embed)
            
            if len(embeddings) != len(chunks):
                 raise ApiError(message="Mismatch between chunks and embeddings count", status_code=500, errors="Embedding Error")

            # 4. Store in Vector DB
            print("Storing in Vector DB...")
            # Prepare metadata for each point (chunk-specific + document-global)
            vectors_metadata = [chunk['metadata'].copy() for chunk in chunks]
            # Add text to metadata for retrieval context (optional but recommended)
            for i, meta in enumerate(vectors_metadata):
                meta['text'] = chunks[i]['text']

            vector_db_service.upsert_vectors(vectors=embeddings, metadata=vectors_metadata)
            
            print("Pipeline completed successfully.")
            return metadata["document_id"]

        except Exception as e:
            # Log the specific error and re-raise or wrap
            print(f"Pipeline failed: {str(e)}")
            raise e

pipeline_service = PipelineService()
