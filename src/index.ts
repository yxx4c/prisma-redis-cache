import {Prisma} from '@prisma/client/extension';
import {CACHE_OPERATIONS, CacheDefinitionOptions, CacheOptions, ModelExtension, PrismaRedisCacheConfig} from './types';

export default (config: PrismaRedisCacheConfig) => {
  const {redis, cache} = config;
  return Prisma.defineExtension({
    name: 'prisma-redis-cache',
    client: {
      cache: {store: cache, redis},
    },
    model: {
      $allModels: {} as ModelExtension,
    },
    query: {
      $allModels: {
        async $allOperations({model, operation, args, query}) {
          let result: any;
          const useCache =
            ['boolean', 'object'].includes(typeof args['cache']) &&
            args['cache'] !== null &&
            (CACHE_OPERATIONS as ReadonlyArray<string>).includes(operation);

          if (!useCache) return query(args);

          const queryArgs = {
            ...args,
          };
          delete queryArgs['cache'];

          if (typeof args['cache'] === 'boolean') {
            if (!(cache as any)[model]) cache.define(model, ({a, q}: CacheDefinitionOptions) => q(a));

            result = await (cache as any)[model]({a: queryArgs, q: query});

            return result;
          }

          const {key, ttl} = args['cache'] as unknown as CacheOptions;

          const cached = await redis.get(key);

          if (cached)
            if (typeof cached === 'string') return JSON.parse(cached);
            else return cached;

          result = await query(queryArgs);
          const value = JSON.stringify(result);

          if (ttl) redis.setex(key, ttl, value);
          else redis.set(key, value);

          return result;
        },
      },
    },
  });
};
