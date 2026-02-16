from qdrant_client import QdrantClient
from qdrant_client.http import models
from app.core.config import settings
from typing import List, Dict, Any
from app.core.responce import ApiError
import uuid

class VectorDBService:
    def __init__(self):
        self.client = QdrantClient(
            url=settings.QDRANT_URL, 
            api_key=settings.QDRANT_API_KEY if settings.QDRANT_API_KEY else None
        )
        self.collection_name = settings.QDRANT_COLLECTION
        self._ensure_collection_exists()

    def _ensure_collection_exists(self):
        """
        Checks if the collection exists, creating it if not.
        """
        try:
            collections = self.client.get_collections()
            collection_names = [c.name for c in collections.collections]
            
            if self.collection_name not in collection_names:
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=1024, # NVIDIA nv-embedqa-e5-v5 dimension is 1024
                        distance=models.Distance.COSINE
                    )
                )
                print(f"Collection '{self.collection_name}' created.")
        except Exception as e:
             # Log warning but don't crash init, might allow read-only or deferred creation
             print(f"Warning: Could not check/create collection: {e}")

    def upsert_vectors(self, vectors: List[List[float]], metadata: List[Dict[str, Any]], ids: List[str] = None):
        """
        Upserts vectors into Qdrant.
        """
        try:
            if not ids:
                ids = [str(uuid.uuid4()) for _ in range(len(vectors))]
            
            points = [
                models.PointStruct(
                    id=id,
                    vector=vector,
                    payload=meta
                )
                for id, vector, meta in zip(ids, vectors, metadata)
            ]
            
            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )
            print(f"Upserted {len(points)} points to '{self.collection_name}'.")
            
        except Exception as e:
            raise ApiError(message=f"Failed to upsert vectors: {str(e)}", status_code=500, errors="Vector DB Error")

vector_db_service = VectorDBService()
