import { createClient } from 'redis';

const host = process.env.REDIS_HOST;
export const clientRedis = createClient({
    url: host,
});

clientRedis.on('error', (error) => {
    console.error(`Redis error: ${error}`);
});

clientRedis.on('connect', () => {
    console.info('Connected to Redis');
});

