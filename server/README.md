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

  # Recolor walls
  curl -X POST http://localhost:8000/images/recolor \
    -H "Content-Type: application/json" \
    -d '{"filename": "room.jpg", "color": "#A3C4BC"}'

  Output saved to ./images/output/room_recolored.jpg.