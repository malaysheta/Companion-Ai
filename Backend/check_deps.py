try:
    import langchain
    import langchain_nvidia_ai_endpoints
    import qdrant_client
    print("Dependencies OK")
except ImportError as e:
    print(f"Missing dependency: {e}")
