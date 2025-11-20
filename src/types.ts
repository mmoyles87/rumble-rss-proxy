export interface Post {
  title: string;
  link: string;
  thumbnail: string;
  date: string;
  description: string;
}

export interface Channel {
  title: string;
  link: string;
  language?: string;
  description?: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
