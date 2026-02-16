import sys
import os

# Ensure the current directory is in sys.path
sys.path.append(os.getcwd())

print("Starting import...")
try:
    from app.core.config import settings
    print(f"Config loaded. QDRANT_URL: '{settings.QDRANT_URL}'")
except Exception as e:
    print(f"Import failed: {e}")
    import traceback
    traceback.print_exc()
