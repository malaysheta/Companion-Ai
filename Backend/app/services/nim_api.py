"""
NIM API Service — Refactored & Enhanced
Provides LLM-powered answer refinement using NVIDIA NIM endpoints via LangChain.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from langchain_core.messages import AIMessage
from langchain_nvidia_ai_endpoints import ChatNVIDIA

from app.core.config import settings
from app.core.responce import ApiError

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class NIMConfig:
    """Immutable configuration for the NIM LLM client."""

    model: str = "meta/llama-3.1-70b-instruct"
    temperature: float = 0.2
    max_completion_tokens: int = 2048

    # Prompt behaviour
    no_context_reply: str = (
        "I could not find any relevant information in the manual for this question."
    )

    # System prompt injected for every call
    system_prompt: str = (
        "You are an expert technical tutor and manual retriever. "
        "Your answers are detailed, accurate, well-structured, and strictly grounded "
        "in the provided context. You never hallucinate."
    )

    # User-turn prompt template — placeholders: {query}, {context}
    user_prompt_template: str = (
        "## Task\n"
        "Provide a **comprehensive, step-by-step explanation** that answers the question below.\n\n"
        "## Rules\n"
        "- Base your answer **only** on the CONTEXT provided. Do NOT add external knowledge.\n"
        "- Number every step and cite the exact page that supports it, e.g. *(Page 12)*.\n"
        "- Include relevant examples drawn from the context.\n"
        "- Explain **why** and **how**, not just *what*.\n"
        "- Bold important terms. Highlight warnings or notes with a `> **Note:**` blockquote.\n"
        "- Do not truncate — expand until the concept is fully understood.\n\n"
        "## Question\n"
        "{query}\n\n"
        "## Context\n"
        "{context}\n\n"
        "---\n"
        "Respond in Markdown with proper page citations:"
    )


# ---------------------------------------------------------------------------
# Data helpers
# ---------------------------------------------------------------------------

@dataclass
class ContextBlock:
    """A single retrieved chunk with its metadata."""

    text: str
    page_number: int | str = "unknown"
    extra_metadata: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, raw: dict[str, Any]) -> ContextBlock | None:
        """
        Parse a context dictionary into a ContextBlock.
        Returns *None* when the text payload is empty so callers can filter
        invalid entries without boilerplate.
        """
        text = (raw.get("text") or "").strip()
        if not text:
            return None

        meta: dict[str, Any] = raw.get("metadata") or {}
        page_number = meta.get("page_number", "unknown")

        # Keep any extra metadata around for future extensibility
        extra = {k: v for k, v in meta.items() if k != "page_number"}
        return cls(text=text, page_number=page_number, extra_metadata=extra)

    def render(self) -> str:
        """Format the block for inclusion in the LLM prompt."""
        return f"[Page {self.page_number}]\n{self.text}"


# ---------------------------------------------------------------------------
# Service
# ---------------------------------------------------------------------------

class NIMAPIService:
    """
    Wraps a NVIDIA NIM / LangChain ChatNVIDIA client and exposes a single
    high-level method — `refine_answer` — that builds a structured prompt,
    calls the model, and returns a Markdown-formatted response.
    """

    def __init__(self, config: NIMConfig | None = None) -> None:
        self._cfg = config or NIMConfig()
        self._llm = self._build_client()

    # ------------------------------------------------------------------
    # Construction
    # ------------------------------------------------------------------

    def _build_client(self) -> ChatNVIDIA:
        """Validate credentials and instantiate the LangChain client."""
        api_key: str | None = getattr(settings, "NVIDIA_API_KEY", None)
        if not api_key:
            raise ApiError(
                message="NVIDIA_API_KEY not found in environment variables.",
                status_code=500,
                errors="Configuration Error",
            )

        logger.debug("Initialising ChatNVIDIA client (model=%s)", self._cfg.model)
        return ChatNVIDIA(
            model=self._cfg.model,
            nvidia_api_key=api_key,
            temperature=self._cfg.temperature,
            max_completion_tokens=self._cfg.max_completion_tokens,
        )

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def refine_answer(
        self,
        query: str,
        contexts: list[dict[str, Any]],
    ) -> str:
        """
        Generate a detailed, page-cited Markdown answer from retrieved contexts.

        Args:
            query:    The user's question.
            contexts: List of raw context dicts, each with ``text`` and
                      optional ``metadata`` (including ``page_number``).

        Returns:
            A Markdown-formatted answer string.

        Raises:
            ApiError: If the upstream NIM API call fails.
        """
        blocks = self._parse_contexts(contexts)

        if not blocks:
            logger.warning("refine_answer called with no usable context blocks.")
            return self._cfg.no_context_reply

        prompt = self._build_prompt(query, blocks)

        logger.info(
            "Calling NIM model '%s' | query_len=%d | context_blocks=%d",
            self._cfg.model,
            len(query),
            len(blocks),
        )
        return self._call_llm(prompt)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _parse_contexts(raw_contexts: list[dict[str, Any]]) -> list[ContextBlock]:
        """Convert raw dicts to validated ContextBlock objects, dropping empties."""
        blocks: list[ContextBlock] = []
        for raw in raw_contexts:
            block = ContextBlock.from_dict(raw)
            if block is not None:
                blocks.append(block)
        return blocks

    def _build_prompt(self, query: str, blocks: list[ContextBlock]) -> str:
        """Assemble the full user-turn prompt from query and context blocks."""
        combined_context = "\n\n".join(block.render() for block in blocks)
        return self._cfg.user_prompt_template.format(
            query=query.strip(),
            context=combined_context,
        )

    def _call_llm(self, prompt: str) -> str:
        """
        Invoke the LLM with a system + user message pair and return the
        text content of the response.
        """
        messages = [
            ("system", self._cfg.system_prompt),
            ("human", prompt),
        ]
        try:
            response: AIMessage = self._llm.invoke(messages)
            content = getattr(response, "content", None) or str(response)
            return content.strip()
        except ApiError:
            raise
        except Exception as exc:
            logger.exception("NIM API call failed: %s", exc)
            raise ApiError(
                message=f"Failed to generate refined answer: {exc}",
                status_code=500,
                errors="NIM API Error",
            ) from exc


# ---------------------------------------------------------------------------
# Module-level singleton (lazy-safe — raises only on first import if key missing)
# ---------------------------------------------------------------------------

nim_api_service = NIMAPIService()