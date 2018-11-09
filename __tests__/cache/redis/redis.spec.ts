const ioredisMock = require('ioredis-mock');
import { cache, cacheConfigure } from '@src/cache';
import { middlewareTests } from '../cache.spec';
import { RedisCache } from '@src/cache/RedisCache';

// Return mocked Redis instead of real one
jest.mock('@src/cache/redis/RedisCreate', () => {
    const RedisMock = new ioredisMock();
    return {
        redisCreate: jest.fn(() => RedisMock)
    };
});

// beforeAll(() => cacheConfigure());
describe('Redis test case', async () => {
    cacheConfigure('RedisCache');
    test('Cache is instance of RedisCache', () => {
        expect(cache).toBeInstanceOf(RedisCache);
    });
    middlewareTests();
});