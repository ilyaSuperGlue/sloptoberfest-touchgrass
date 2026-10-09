import { serve } from "bun";
import { env, pipeline, RawImage } from "@huggingface/transformers";
import sharp from "sharp";
import { validationRules } from "./constants/validation";
import index from "./index.html";

env.cacheDir = "./models";
const classifierPromise = pipeline(
  "zero-shot-image-classification",
  "Xenova/clip-vit-base-patch32",
  { dtype: "q8" },
);
const rateWindowMs = 60_000;
const maxRequestsPerWindow = 10;
const requestLog = new Map<string, { startedAt: number; count: number }>();

function clientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "local";
}

function isAllowedBrowserRequest(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  let originHost = host;
  if (origin) {
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = "";
    }
  }
  return contentType.includes("application/json") && originHost === host;
}

const server = serve({
  port: Number(process.env.PORT || 3000),
  routes: {
    "/*": index,
    "/api/analyze": {
      async POST(req) {
        try {
          if (!isAllowedBrowserRequest(req))
            return Response.json(
              { error: "Browser validation requests only" },
              { status: 403 },
            );
          const key = clientIp(req);
          const now = Date.now();
          const current = requestLog.get(key);
          if (!current || now - current.startedAt >= rateWindowMs)
            requestLog.set(key, { startedAt: now, count: 1 });
          else if (current.count >= maxRequestsPerWindow)
            return Response.json(
              { error: "Too many validation requests. Try again in a minute." },
              { status: 429, headers: { "Retry-After": "60" } },
            );
          else current.count += 1;
          const { image, quest } = await req.json();
          if (!image || !quest)
            return Response.json(
              { error: "image and quest are required" },
              { status: 400 },
            );
          const rule = validationRules[quest];
          if (!rule)
            return Response.json({ error: "Unknown quest" }, { status: 400 });
          const sourceBase64 = String(image).split(",")[1] || String(image);
          const compressed = await sharp(Buffer.from(sourceBase64, "base64"))
            .rotate()
            .resize({
              width: 1280,
              height: 1280,
              fit: "inside",
              withoutEnlargement: true,
            })
            .jpeg({ quality: 78, progressive: true })
            .toBuffer();
          const classifier = await classifierPromise;
          const picture = await RawImage.fromBlob(
            new Blob([compressed], { type: "image/jpeg" }),
          );
          const results = await classifier(picture, [
            ...rule.positives,
            ...rule.negatives,
          ]);
          const best = results[0] as { label: string; score: number };
          return Response.json({
            valid:
              rule.positives.includes(best.label) &&
              best.score >= rule.threshold,
            label: best.label,
            score: best.score,
          });
        } catch (error) {
          console.error(error);
          return Response.json({ error: "Validation failed" }, { status: 500 });
        }
      },
    },
  },
  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
