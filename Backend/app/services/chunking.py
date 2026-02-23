from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List, Dict, Any

class ChunkingService:
    def __init__(self, chunk_size: int = 2000, chunk_overlap: int = 800):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            is_separator_regex=False,
        )

    def create_chunks(self, text_data: List[Dict[str, Any]], base_metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Splits text into chunks and adds metadata.
        text_data: List of dicts with 'text' and 'page_number'
        base_metadata: Common metadata for all chunks (user_id, document_id, etc.)
        """
        chunks = []
        global_chunk_index = 0

        for page_data in text_data:
            page_text = page_data['text']
            page_number = page_data['page_number']
            
            # Split the text of the page
            split_texts = self.text_splitter.split_text(page_text)
            
            for split_text in split_texts:
                chunk_metadata = base_metadata.copy()
                chunk_metadata.update({
                    "page_number": page_number,
                    "chunk_index": global_chunk_index
                })
                
                chunks.append({
                    "text": split_text,
                    "metadata": chunk_metadata
                })
                global_chunk_index += 1
                
        return chunks

chunking_service = ChunkingService()
