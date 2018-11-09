import { convertToJson, convertToString } from '@src/cache/redis/RedisUtils';

test('RedisUtils - Convert to JSON', () => {
    const testObj = { testNum: 1, testStr: 'test', testObj: [1, 2, 3] };
    const testStr = JSON.stringify(testObj);
    expect(convertToJson('string test')).toBe('string test');
    expect(convertToJson(testStr)).toMatchObject(testObj);
    // tslint:disable-next-line:no-null-keyword
    expect(convertToJson(null)).toBeNull();
    expect(convertToJson(undefined)).toBeUndefined();
});

test('RedisUtils - Convert JSON to String', () => {
    const testObj = { testNum: 1, testStr: 'test', testObj: [1, 2, 3] };
    const testStr = JSON.stringify(testObj);
    expect(convertToString(testObj)).toBe(testStr);
    expect(() => { convertToString(convertToString); }).toThrow();
    expect(convertToString('string test')).toBe('string test');
    expect(convertToJson(undefined)).toBeUndefined();
    // tslint:disable-next-line:no-null-keyword
    expect(convertToJson(null)).toBeNull();
});
