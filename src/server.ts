import express, { Request, Response } from "express";
import cors from "cors";
import { getRSSFeed } from "./generateFeed";
import { getRumblePosts } from "./parsePosts";
import { Cache } from "./cache";
import { Post } from "./types";
import { PORT, CACHE_TTL_MINUTES, RUMBLE_URLS } from "./config";

const app = express();
const cache = new Cache<Post[]>(CACHE_TTL_MINUTES);

app.use(cors({ origin: "*" }));

function validateChannelName(channel: string): boolean {
  return /^[a-zA-Z0-9_-]{1,100}$/.test(channel);
}

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/:channel", async (req: Request, res: Response) => {
  try {
    const { channel } = req.params;

    if (!validateChannelName(channel)) {
      res.status(400).json({ error: "Invalid channel name" });
      return;
    }

    let posts = cache.get(channel);

    if (!posts) {
      console.log(`Cache miss for channel: ${channel}`);
      posts = await getRumblePosts(channel);
      cache.set(channel, posts);
    } else {
      console.log(`Cache hit for channel: ${channel}`);
    }

    const rss = getRSSFeed(
      {
        title: channel,
        link: RUMBLE_URLS.channel(channel),
      },
      posts
    );

    res.set("Content-Type", "application/rss+xml");
    res.send(rss);
  } catch (err) {
    console.error("Error generating RSS feed:", err);
    const error = err as Error;
    if (
      error.message?.includes("404") ||
      error.message?.includes("not found")
    ) {
      res.status(404).json({ error: "Channel not found" });
    } else if (error.message?.includes("timeout")) {
      res.status(504).json({ error: "Request timeout" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Cache TTL: ${CACHE_TTL_MINUTES} minutes`);
});
