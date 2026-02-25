## WALLUP

  1. Install dependencies:
  uv sync
  2. Copy and fill in your token:
  cp .env.example .env
  # edit .env with your HF token from huggingface.co/settings/tokens
  3. Add images to ./images/input/ and start the server:
  uv run python main.py
  4. Call the API:
  # List available images
  curl http://localhost:8000/images/list

  # Recolor regions
  curl -X POST http://localhost:8000/images/recolor \
    -H "Content-Type: application/json" \
    -d '{"filename": "room.jpg", "regions": {"wall":"#A3C4BC", "floor": "#FF0000"}}'

  Output saved to ./images/output/room_recolored.jpg.