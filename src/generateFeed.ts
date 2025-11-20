import xml = require("xml");
import { Post, Channel } from "./types";
import { FEED_DEFAULTS } from "./config";

function getFeedItems(posts: Post[]) {
  return posts.map((post) => ({
    item: [
      { title: post.title },
      { link: post.link },
      { pubDate: new Date(post.date).toUTCString() },
      { guid: [{ _attr: { isPermaLink: true } }, post.link] },
      { description: { _cdata: post.description } },
      { "itunes:image": [{ _attr: { href: post.thumbnail } }] },
      { "media:thumbnail": [{ _attr: { url: post.thumbnail } }] },
    ],
  }));
}

export function getRSSFeed(channel: Channel, posts: Post[]): string {
  const feedObject = {
    rss: [
      {
        _attr: {
          version: "2.0",
          "xmlns:atom": "http://www.w3.org/2005/Atom",
          "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
          "xmlns:media": "http://search.yahoo.com/mrss/",
        },
      },
      {
        channel: [
          {
            "atom:link": {
              _attr: {
                rel: "self",
                type: "application/rss+xml",
              },
            },
          },
          { title: channel.title },
          { link: channel.link },
          { description: channel.description || FEED_DEFAULTS.description },
          { language: channel.language || FEED_DEFAULTS.language },
          ...getFeedItems(posts),
        ],
      },
    ],
  };

  return '<?xml version="1.0" encoding="UTF-8"?>' + xml(feedObject);
}
