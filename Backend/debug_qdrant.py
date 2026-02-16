import sys
import os

# Ensure the current directory is in sys.path
sys.path.append(os.getcwd())

from app.core.config import settings
from qdrant_client import QdrantClient

print(f"QDRANT_URL: '{settings.QDRANT_URL}'")
print(f"QDRANT_API_KEY: '{settings.QDRANT_API_KEY}'")
print(f"QDRANT_COLLECTION: '{settings.QDRANT_COLLECTION}'")

try:
    client = QdrantClient(
        url=settings.QDRANT_URL,
        api_key=settings.QDRANT_API_KEY
    )
    print("Client initialized.")
    
    print("Attempting to get collections...")
    collections = client.get_collections()
    print(f"Collections: {collections}")
    
    # Check if collection exists
    exists = any(c.name == settings.QDRANT_COLLECTION for c in collections.collections)
    print(f"Collection '{settings.QDRANT_COLLECTION}' exists: {exists}")
    
    if not exists:
         print("Attempting to create collection...")
         # Try creating (dummy params for test)
         from qdrant_client.http import models
         client.create_collection(
            collection_name=settings.QDRANT_COLLECTION,
            vectors_config=models.VectorParams(size=1024, distance=models.Distance.COSINE)
         )
         print("Collection created.")

except Exception as e:
    print(f"Error: {e}")
