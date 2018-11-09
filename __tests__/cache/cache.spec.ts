import { cache, cacheConfigure } from '@src/cache';

// Main tests
describe('Main cache test suite', () => {
    test('Cache configuration is available', () => {
        expect(cacheConfigure).toBeDefined();
    });
});



export function middlewareTests() {
    // Test values
    const namespace: string = 'testNamespace';
    const testValues: any = {
        string: {
            key: 'stringKey',
            value: 'stringValue'
        },
        object: {
            key: 'objectKey',
            value: { a: 'string', b: 0, c: ['a', 'b', 0] }
        }
    };

    test('can save string keys', async () => {
        expect(await cache.saveKey(namespace, testValues['string'].key, testValues['string'].value)).toBe(1);
    });

    test('can save object keys', async () => {
        expect(await cache.saveKey(namespace, testValues['object'].key, testValues['object'].value)).toBe(1);
    });

    test('can read string values', async () => {
        expect(await cache.getKey(namespace, testValues['string'].key)).toBe(testValues['string'].value);
    });

    test('can read object values', async () => {
        expect(await cache.getObjKey(namespace, testValues['object'].key)).toMatchObject(testValues.object.value);
    });

    test('can delete keys', async () => {
        // Value exists before
        expect(await cache.getKey(namespace, testValues['string'].key)).toBe(testValues.string.value);

        expect(await cache.deleteKey(namespace, testValues['string'].key)).toBe(1);
        // Value does NOT exists after
        expect(await cache.getKey(namespace, testValues['string'].key)).toBeNull();
    });
}