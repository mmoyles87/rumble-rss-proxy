import axios from "axios";
import * as cheerio from "cheerio";
import { Post } from "./types";
import { RUMBLE_URLS, CSS_SELECTORS, REQUEST_TIMEOUT_MS } from "./config";

const axiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
});

async function getChannelHtml(channelName: string): Promise<string> {
  try {
    const response = await axiosInstance.get(RUMBLE_URLS.channel(channelName));
    return response.data;
  } catch {
    const response = await axiosInstance.get(RUMBLE_URLS.user(channelName));
    return response.data;
  }
}

export async function getRumblePosts(channelName: string): Promise<Post[]> {
  const html = await getChannelHtml(channelName);
  const $ = cheerio.load(html);
  const items = $(CSS_SELECTORS.videoItems).toArray();

  return items.map((item) => {
    const title = $(CSS_SELECTORS.title, item).text().trim();
    const urlRel = $(CSS_SELECTORS.link, item).attr("href") || "";
    const link = RUMBLE_URLS.video(urlRel);
    const thumbnail = $(CSS_SELECTORS.thumbnail, item).attr("src") || "";
    const date = $(CSS_SELECTORS.datetime, item).attr("datetime") || "";
    const views = $(CSS_SELECTORS.views, item).attr("data-views") || "unknown";
    const comments = $(CSS_SELECTORS.comments, item).attr("title") || "unknown";
    const duration = $(CSS_SELECTORS.duration, item).text().trim();
    const description = `Duration: ${duration}<br/>Views: ${views}<br/>Comments: ${comments}`;

    return { title, link, thumbnail, date, description };
  });
}
