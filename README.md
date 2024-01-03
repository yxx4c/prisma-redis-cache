# prisma-redis-cache

The [prisma-redis-cache](https://github.com/yxx4c/prisma-redis-cache)  library is a powerful tool designed to enhance the performance of your Prisma-based applications by seamlessly integrating caching of query results into a Redis/Dragonfly database. This library acts as a bridge between your Prisma queries and the Redis/Dragonfly caching mechanism, helping you reduce latency and enhance the overall responsiveness of your application.

### **Installation**

##### **Using npm:**

```bash
npm install @yxx4c/prisma-redis-cache
```

##### **Using yarn:**

```bash
yarn add @yxx4c/prisma-redis-cache
```

##### **Using pnpm:**

```bash
pnpm add @yxx4c/prisma-redis-cache
```

##### **Using bun:**

```bash
bun add @yxx4c/prisma-redis-cache
```

### Example

```javascript
import { createCache } from 'async-cache-dedupe';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import pino from 'pino';
import prismaCache from '@yxx4c/prisma-redis-cache';

// Create a Redis client
const redis = new Redis({
  host: env.REDIS_HOST_NAME,
  port: env.REDIS_PORT,
});

// Craete a pino logger instance for logging
const logger = pino()

// Create an async-cache-dedupe instance for caching
const cache = createCache({
  ttl: 1,  // Use your custom values
  stale: 1, // Use your custom values
  storage: {
    type: 'redis',
    options: {
      client: redis,
      invalidation: { referencesTTL: 60 }, // Invalidation settings
      log: logger, // Logger for cache events
    },
  },
});

// Create a Prisma client instance
const prisma = new PrismaClient();

// Extend Prisma with the caching functionality provided by prisma-redis-cache
const prismaWithCache = prisma.$extends(prismaCache({ redis, cache }));

// Example: Query a user and cache the result
prismaWithCache.user.findUnique({
  where: { id },
  cache: { ttl: 5, key: `user:${id}` }, // Cache configuration
});
```

### Dependencies

- `ioredis`
- `async-cache-dedupe`

### Key Features

- **Automatic Query Result Caching:** Easily cache Prisma query results in Redis with minimal configuration.
- **Fine-grained Control:** Configure caching settings on a per-query basis for granular control over caching behavior.
- **Cache Invalidation:** Implement cache invalidation strategies to ensure that cached data remains up-to-date.

By using [prisma-redis-cache](https://github.com/yxx4c/prisma-redis-cache), you can significantly optimize database access times, resulting in a more efficient and responsive application.


### Enhance Cache Management with prisma-redis-uncache

Explore [prisma-redis-uncache](https://github.com/yxx4c/prisma-redis-uncache) for additional cache invalidation capabilities. This library complements [prisma-redis-cache](https://github.com/yxx4c/prisma-redis-cache) by providing features for selectively invalidating cached Prisma query results in Redis. Ideal for scenarios requiring real-time data updates.

Strike the perfect balance between performance optimization and data accuracy with both [prisma-redis-cache](https://github.com/yxx4c/prisma-redis-cache) and [prisma-redis-uncache](https://github.com/yxx4c/prisma-redis-uncache).
