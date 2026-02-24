from typing import Any, Dict, List

from app.core.config import settings
from app.core.responce import ApiError
from langchain_nvidia_ai_endpoints import ChatNVIDIA


class NIMAPIService:
    def __init__(self) -> None:
        if not settings.NVIDIA_API_KEY:
            raise ApiError(
                message="NVIDIA_API_KEY not found in environment variables",
                status_code=500,
                errors="Configuration Error",
            )

        # General-purpose instruction-tuned model; adjust if needed.
        self.llm = ChatNVIDIA(
            model="meta/llama-3.1-70b-instruct",
            nvidia_api_key=settings.NVIDIA_API_KEY,
            temperature=0.2,
            max_completion_tokens=2048,
        )

    def refine_answer(self, query: str, contexts: List[Dict[str, Any]]) -> str:
        """
        Use NIM LLM to generate a concise answer using retrieved contexts.
        """
        if not contexts:
            return "I could not find any relevant information in the manual for this question."

        context_blocks: List[str] = []
        for ctx in contexts:
            text = ctx.get("text", "")
            meta = ctx.get("metadata", {}) or {}
            page_number = meta.get("page_number", "unknown")
            if not text:
                continue
            context_blocks.append(f"Page {page_number}:\n{text}")

        combined_context = "\n\n".join(context_blocks)

        prompt = (
            "You are an expert technical tutor.\n\n"
            
            "Your task is to provide a DETAILED, WELL-STRUCTURED, and IN-DEPTH explanation.\n"
            
            "STRICT INSTRUCTIONS:\n"
            "- Answer must be comprehensive and detailed.\n"
            "- Explain concepts step-by-step.\n"
            "- Include examples wherever possible.\n"
            "- If applicable, explain WHY and HOW, not just WHAT.\n"
            "- Use bullet points or sections for clarity.\n"
            "- Do NOT give short answers.\n"
            "- Expand the answer as much as needed for full understanding.\n\n"
            
            "Use the CONTEXT as your primary source, but you MAY expand using your own knowledge.\n"
            
            "QUESTION:\n"
            f"{query}\n\n"
            
            "CONTEXT:\n"
            f"{combined_context}\n\n"
            
            "Now generate a detailed answer:"
        )

        try:
            response = self.llm.invoke(prompt)
            # ChatNVIDIA returns an AIMessage with a `content` attribute.
            return getattr(response, "content", str(response)).strip()
        except Exception as e:
            raise ApiError(
                message=f"Failed to generate refined answer: {str(e)}",
                status_code=500,
                errors="NIM API Error",
            )


nim_api_service = NIMAPIService()

