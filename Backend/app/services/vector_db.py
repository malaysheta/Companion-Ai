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
            api_key=settings.QDRANT_API_KEY if settings.QDRANT_API_KEY else None,
            timeout=600.0,
        )
        self.collection_name = settings.QDRANT_COLLECTION
        self._ensure_collection_exists()
        self._ensure_payload_indexes()

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

    def _ensure_payload_indexes(self):
        """
        Ensures payload indexes exist for fields used in filters.
        """
        try:
            index_fields = ["company_name", "product_name", "product_code"]
            for field in index_fields:
                try:
                    self.client.create_payload_index(
                        collection_name=self.collection_name,
                        field_name=field,
                        field_schema=models.PayloadSchemaType.KEYWORD,
                    )
                    print(f"Created payload index for field '{field}'.")
                except Exception as e:
                    # Ignore errors like 'index already exists'
                    print(f"Warning: Could not create payload index for '{field}': {e}")
        except Exception as e:
            print(f"Warning: Failed to ensure payload indexes: {e}")

    def upsert_vectors(
        self,
        vectors: List[List[float]],
        metadata: List[Dict[str, Any]],
        ids: List[str] = None,
        batch_size: int = 64,
    ):
        """
        Upserts vectors into Qdrant in batches to avoid timeouts.
        """
        try:
            if not ids:
                ids = [str(uuid.uuid4()) for _ in range(len(vectors))]

            if len(vectors) != len(metadata) or len(vectors) != len(ids):
                raise ApiError(
                    message="Vectors, metadata, and ids length mismatch",
                    status_code=500,
                    errors="Vector DB Error",
                )

            total_points = len(vectors)
            for start in range(0, total_points, batch_size):
                end = min(start + batch_size, total_points)
                batch_points = [
                    models.PointStruct(
                        id=batch_id,
                        vector=batch_vector,
                        payload=batch_meta,
                    )
                    for batch_id, batch_vector, batch_meta in zip(
                        ids[start:end], vectors[start:end], metadata[start:end]
                    )
                ]

                self.client.upsert(
                    collection_name=self.collection_name,
                    points=batch_points,
                )
                print(
                    f"Upserted batch {start}-{end} "
                    f"({len(batch_points)} points) to '{self.collection_name}'."
                )

            print(f"Upserted {total_points} points to '{self.collection_name}'.")

        except Exception as e:
            raise ApiError(
                message=f"Failed to upsert vectors: {str(e)}",
                status_code=500,
                errors="Vector DB Error",
            )

    def search_vectors(
        self,
        query_vector: List[float],
        filters: Dict[str, Any] | None = None,
        limit: int = 5,
    ):
        """
        Searches vectors in Qdrant using a query vector and optional metadata filters.
        """
        try:
            qdrant_filter = None
            if filters:
                must_conditions = []
                for key, value in filters.items():
                    if value is None:
                        continue
                    must_conditions.append(
                        models.FieldCondition(
                            key=key,
                            match=models.MatchValue(value=value),
                        )
                    )

                if must_conditions:
                    qdrant_filter = models.Filter(must=must_conditions)

            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                query_filter=qdrant_filter,
                limit=limit,
                with_payload=True,
            )
            return results
        except Exception as e:
            raise ApiError(
                message=f"Failed to search vectors: {str(e)}",
                status_code=500,
                errors="Vector DB Error",
            )

vector_db_service = VectorDBService()
