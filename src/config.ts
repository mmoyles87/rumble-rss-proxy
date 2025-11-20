export const PORT = parseInt(process.env.PORT || "9000", 10);
export const CACHE_TTL_MINUTES = parseInt(
  process.env.CACHE_TTL_MINUTES || "10",
  10
);
export const REQUEST_TIMEOUT_MS = 5000;

export const RUMBLE_URLS = {
  channel: (name: string) => `https://rumble.com/c/${name}`,
  user: (name: string) => `https://rumble.com/user/${name}`,
  video: (path: string) => `https://rumble.com${path}`,
};

export const CSS_SELECTORS = {
  videoItems: ".videostream.thumbnail__grid--item:not(.videostream--featured)",
  title: ".thumbnail__title",
  link: ".videostream__link",
  thumbnail: ".thumbnail__image",
  datetime: ".videostream__time",
  views: ".videostream__views",
  comments: ".videostream__comments",
  duration: ".videostream__status--duration",
};

export const FEED_DEFAULTS = {
  language: "en-US",
  description: "-",
};
