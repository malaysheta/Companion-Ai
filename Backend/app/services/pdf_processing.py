import io
import re
from pypdf import PdfReader
from typing import List, Dict, Any
from app.core.responce import ApiError

class PDFProcessor:
    def extract_text(self, file_content: bytes) -> List[Dict[str, Any]]:
        """
        Extracts text from a PDF file content.
        Returns a list of dictionaries containing page content and metadata.
        """
        try:
            pdf_reader = PdfReader(io.BytesIO(file_content))
            extracted_data = []

            for i, page in enumerate(pdf_reader.pages):
                text = page.extract_text()
                if text:
                    cleaned_text = self._clean_text(text)
                    if cleaned_text:
                        extracted_data.append({
                            "text": cleaned_text,
                            "page_number": i + 1
                        })
            
            return extracted_data
        except Exception as e:
            raise ApiError(message=f"Failed to process PDF: {str(e)}", status_code=400, errors="PDF Processing Error")

    def _clean_text(self, text: str) -> str:
        """
        Cleans the extracted text by removing extra whitespace and non-printable characters.
        """
        # Replace multiple newlines with a single newline
        text = re.sub(r'\n+', '\n', text)
        # Replace multiple spaces with a single space
        text = re.sub(r'\s+', ' ', text)
        # Remove non-printable characters (keep basic printable + common symbols)
        text = "".join(ch for ch in text if ch.isprintable() or ch == '\n')
        return text.strip()

pdf_processor = PDFProcessor()
