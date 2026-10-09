# touchgrass

A tiny, local-first outdoor quest for the Hacktoberfest Week 1 “Touch Grass” challenge. Pick up a seven-minute prompt, go outside, and bring back a photo. The UI is ready for a Gemma Vision endpoint and remains usable in demo mode without one.

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

## Docker

Run the app and persist the downloaded CLIP model cache locally:

```bash
podman compose up --build
```

The app is available at `http://localhost:3000`. Render deploys the included `Dockerfile` directly; `docker-compose.yml` is provided for local development and other Docker-compatible hosts.

## Gemma Vision

The browser calls the Bun server at `/api/analyze`; credentials never go to the browser. By default the server calls local Ollama:

```bash
ollama pull gemma3:4b
bun dev
```

For a Thinking Machines or other OpenAI-compatible provider, configure the Bun server with:

```bash
GEMMA_PROVIDER=openai
GEMMA_API_URL=https://your-base-url
GEMMA_MODEL=Inkling
GEMMA_API_KEY=your-secret-key
```

The server appends `/v1/chat/completions`, sends the photo as a vision message, and returns the model's JSON classification. The key stays on the server.

The frontend intentionally keeps the photo on-device until the user taps “Check my quest”.

This project was created using `bun init` in bun v1.4.0. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
# sloptoberfest-touchgrass
