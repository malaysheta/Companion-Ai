from typing import Any, Dict, List

from app.core.responce import ApiError
from app.services.embedding import embedding_service
from app.services.vector_db import vector_db_service


class RetrievalService:
    def retrieve_manual_context(
        self,
        query: str,
        company_name: str,
        product_name: str,
        product_code: str,
        top_k: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        Retrieves top-k relevant manual chunks for a given query and manual identifiers.
        """
        try:
            embeddings = embedding_service.generate_embeddings([query])
            if not embeddings or not embeddings[0]:
                raise ApiError(
                    message="Failed to generate query embedding",
                    status_code=500,
                    errors="Embedding Error",
                )

            query_embedding = embeddings[0]

            filters: Dict[str, Any] = {
                "company_name": company_name,
                "product_name": product_name,
                "product_code": product_code,
            }

            search_results = vector_db_service.search_vectors(
                query_vector=query_embedding,
                filters=filters,
                limit=top_k,
            )

            contexts: List[Dict[str, Any]] = []
            for point in search_results:
                payload = point.payload or {}
                contexts.append(
                    {
                        "text": payload.get("text", ""),
                        "score": point.score,
                        "metadata": {k: v for k, v in payload.items() if k != "text"},
                    }
                )

            return contexts
        except ApiError:
            raise
        except Exception as e:
            raise ApiError(
                message=f"Failed to retrieve relevant chunks: {str(e)}",
                status_code=500,
                errors="Retrieval Error",
            )


retrieval_service = RetrievalService()

