# Rumble RSS Proxy

Generate RSS feeds from Rumble channels for use with RSS readers like Reeder.

## Features

- 🚀 Fast and lightweight Express server
- 💾 In-memory caching (configurable TTL)
- 🐳 Docker and Docker Compose support
- ✅ Input validation and error handling
- 🔄 Automatic fallback for user vs channel URLs
- 📊 Health check endpoint
- 🎯 RSS 2.0 with iTunes and Media RSS extensions

## Quick Start (Docker)

```bash
docker-compose up -d
```

Access feeds at `http://localhost:9000/{channelname}`

## Installation

### Using Docker

1. Clone the repository:

```bash
git clone https://github.com/mmoyles87/rumble-rss-proxy.git
cd rumble-rss-proxy
```

2. Build and run:

```bash
docker-compose up -d
```

### Manual Installation

1. Prerequisites:

   - Node.js 20 LTS or higher
   - npm

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Start the server:

```bash
npm start
```

For development with hot reload:

```bash
npm run dev
```

## Usage

### Generate RSS Feed

Get the RSS feed for any Rumble channel:

```
GET http://localhost:9000/{channelname}
```

**Example:**

```bash
curl http://localhost:9000/timcast
```

The server will try both channel formats:

- `https://rumble.com/c/{channelname}`
- `https://rumble.com/user/{channelname}`

### Health Check

Check if the service is running:

```
GET http://localhost:9000/health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-11-20T12:00:00.000Z"
}
```

## Configuration

Set environment variables to customize the server:

| Variable            | Default | Description                   |
| ------------------- | ------- | ----------------------------- |
| `PORT`              | `9000`  | Server port                   |
| `CACHE_TTL_MINUTES` | `10`    | Cache time-to-live in minutes |

### Using .env File

1. Copy the example file:

```bash
cp .env.example .env
```

2. Edit `.env` with your values:

```bash
PORT=9000
CACHE_TTL_MINUTES=15
```

### Docker Environment Variables

In `docker-compose.yml`:

```yaml
environment:
  - PORT=9000
  - CACHE_TTL_MINUTES=15
```

## API Documentation

### GET /:channel

Generate RSS feed for a Rumble channel.

**Parameters:**

- `channel` (path) - Rumble channel name (alphanumeric, dash, underscore, 1-100 chars)

**Response:**

- `200 OK` - RSS XML feed
- `400 Bad Request` - Invalid channel name
- `404 Not Found` - Channel not found
- `500 Internal Server Error` - Server error
- `504 Gateway Timeout` - Request timeout

**RSS Feed Format:**

- RSS 2.0 compatible
- iTunes podcast tags
- Media RSS tags
- Thumbnails included
- Video metadata (duration, views, comments)

### Building Docker Image

```bash
docker build -t rumble-rss-proxy .
docker run -p 9000:9000 rumble-rss-proxy
```

## Deployment

### Docker Production

```bash
docker-compose up -d --build
```

### Standalone Server

1. Build the project:

```bash
npm run build
```

2. Set environment variables and start:

```bash
export PORT=9000
export CACHE_TTL_MINUTES=10
npm start
```

## Technical Details

### Caching Strategy

- In-memory cache with configurable TTL
- Cache key: channel name
- Reduces Rumble requests by ~90%
- Prevents rate limiting
- Fast response times (50ms cached vs 3-5s uncached)

### Error Handling

- Input validation prevents injection attacks
- Proper HTTP status codes
- Detailed console logging
- Timeout protection (5 seconds)
- Graceful degradation

## License

MIT

## Contributing

This is a fork focused on improvements and modernization. Feel free to submit issues and pull requests at [https://github.com/mmoyles87/rumble-rss-proxy](https://github.com/mmoyles87/rumble-rss-proxy).

## Credits

Original project by [alexandersokolow](https://github.com/alexandersokolow/rumble-rss)
