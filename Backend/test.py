import sys
import os

from app.services.nim_api import nim_api_service

print("Testing NIM API manually")
try:
    contexts = [
        {"text": "The battery is located at the bottom of the device.", "metadata": {"page_number": 5}}
    ]
    response = nim_api_service.refine_answer(
        query="where is the battery",
        contexts=contexts
    )
    print("Response:", response)
except Exception as e:
    import traceback
    traceback.print_exc()
