import Redis from "ioredis"

// Fault tolerant redis integration
class RedisCacheManager {
    private static instance: RedisCacheManager;
    private redis: Redis;
    private createdAt: number;
    private static ttl: number = 30 * 60 * 1000; // TTL in milliseconds (e.g., 1 hour)
    private isRedisConnected: boolean = false;

    constructor() {
        this.redis = new Redis(process.env.REDIS_URL ?? "", {
            retryStrategy: function(times) {
                if (times >= 3) {
                    console.log('Exceeded maximum retry attempts. Stopping reconnection.');
                    return null;  // Stop reconnecting after 3rd retry
                }
                const delay = Math.min(times * 50, 2000);  // Exponential backoff with a maximum delay of 2 seconds
                return delay;  // Time in milliseconds before trying to reconnect
            }}
        );

        // Handle initial connection
        this.redis.on('connect', () => {
            console.log('Redis connected');
            this.isRedisConnected = true;
        });

        // Handle connection errors
        this.redis.on('error', (error) => {
            console.error('Redis connection error:', error);
            this.isRedisConnected = false;
        });

        // Handle disconnection
        this.redis.on('end', () => {
            console.log('Redis disconnected');
            this.isRedisConnected = false;
        });

        this.createdAt = Date.now();  // Store creation time for TTL
    }

    async get(key: string): Promise<string | null> {
        if (!this.isRedisConnected) {
            return null;
        }

        try {
            return await this.redis.get(key);
        } catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    }

    async set(key: string, value: string, ttlSeconds: number): Promise<void> {
        if (!this.isRedisConnected) {
            return;
        }

        try {
            await this.redis.setex(key, ttlSeconds, value);
        } catch (error) {
            console.error('Redis set error:', error);
        }
    }

    // Static method to ensure a single instance
    // Static method to ensure a single instance, with TTL check
    public static getInstance(): RedisCacheManager {
        const now = Date.now();
        if (!RedisCacheManager.instance || now - RedisCacheManager.instance.createdAt > RedisCacheManager.ttl) {
            console.log('Creating new RedisCacheManager instance due to TTL expiry or non-existence.');
            if (RedisCacheManager.instance) {
                RedisCacheManager.instance.redis.quit();  // Clean up existing Redis connection
            }
            RedisCacheManager.instance = new RedisCacheManager();
        }
        return RedisCacheManager.instance;
    }
}

export const redisCacheManager = RedisCacheManager.getInstance();



