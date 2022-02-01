import test from 'ava';
import {
    add,
    subtract,
    multiply,
    negate,
    magnitude,
    normalize,
    dotProduct,
    crossProduct,
    hadamardProduct,
} from '../../src/utils/operators';
import {
    Point,
    Vector,
    Tuple,
    Color,
} from '../../src/data-structure';

test('Test addition - tuple', (t) => {
    const tuple1 = new Tuple(3, -2, 5, 1);
    const tuple2 = new Tuple(-2, 3, 1, 0);
    const result = add(tuple1, tuple2);
    const expectedResult = new Tuple(1, 1, 6, 1);

    t.is(result.equal(expectedResult), true);
});

test('Test addition - color', (t) => {
    const color1 = new Color(0.9, 0.6, 0.75);
    const color2 = new Color(0.7, 0.1, 0.25);
    const result = add(color1, color2);
    const expectedResult = new Color(1.6, 0.7, 1.0);

    t.is(result.equal(expectedResult), true);
});

test('Test subtraction - point minus point', (t) => {
    const p1 = new Point(3, 2, 1);
    const p2 = new Point(5, 6, 7);
    const result = subtract(p1, p2);
    const expectedResult = new Vector(-2, -4, -6);

    t.is(result.equal(expectedResult), true);
});

test('Test subtraction - point minus vector', (t) => {
    const p1 = new Point(3, 2, 1);
    const p2 = new Vector(5, 6, 7);
    const result = subtract(p1, p2);
    const expectedResult = new Point(-2, -4, -6);

    t.is(result.equal(expectedResult), true);
});

test('Test subtraction - vector minus vector', (t) => {
    const p1 = new Vector(3, 2, 1);
    const p2 = new Vector(5, 6, 7);
    const result = subtract(p1, p2);
    const expectedResult = new Vector(-2, -4, -6);

    t.is(result.equal(expectedResult), true);
});

test('Test subtraction - color', (t) => {
    const c1 = new Color(0.9, 0.6, 0.75);
    const c2 = new Color(0.7, 0.1, 0.25);
    const result = subtract(c1, c2);
    const expectedResult = new Color(0.2, 0.5, 0.5);

    t.is(result.equal(expectedResult), true);
});

test('Test negation', (t) => {
    const t1 = new Tuple(1, -2, 3, -4);
    const result = negate(t1);
    const expectedResult = new Tuple(-1, 2, -3, 4);

    t.is(result.equal(expectedResult), true);
});

test('Test scalar multiplication', (t) => {
    const t1 = new Tuple(1, -2, 3, -4);
    const result = multiply(t1, 3.5);
    const expectedResult = new Tuple(3.5, -7, 10.5, -14);

    t.is(result.equal(expectedResult), true);
});

test('Test scalar multiplication - color', (t) => {
    const c1 = new Color(0.2, 0.3, 0.4);
    const result = multiply(c1, 2);
    const expectedResult = new Color(0.4, 0.6, 0.8);

    t.is(result.equal(expectedResult), true);
});

test('Test scalar multiplication - division', (t) => {
    const t1 = new Tuple(1, -2, 3, -4);
    const result = multiply(t1, 0.5);
    const expectedResult = new Tuple(0.5, -1, 1.5, -2);

    t.is(result.equal(expectedResult), true);
});

test('Test magnitude - Vector(1,0,0)', (t) => {
    const v1 = new Vector(1, 0, 0);
    const result = magnitude(v1);
    const expectedResult = 1;

    t.is(result, expectedResult);
});

test('Test magnitude - Vector(0,1,0)', (t) => {
    const v1 = new Vector(0, 1, 0);
    const result = magnitude(v1);
    const expectedResult = 1;

    t.is(result, expectedResult);
});

test('Test magnitude - Vector(0,0,1)', (t) => {
    const v1 = new Vector(0, 0, 1);
    const result = magnitude(v1);
    const expectedResult = 1;

    t.is(result, expectedResult);
});

test('Test magnitude - Vector(1,2,3)', (t) => {
    const v1 = new Vector(1, 2, 3);
    const result = magnitude(v1);
    const expectedResult = Math.sqrt(14);

    t.is(result, expectedResult);
});

test('Test magnitude - Vector(-1,-2,-3)', (t) => {
    const v1 = new Vector(-1, -2, -3);
    const result = magnitude(v1);
    const expectedResult = Math.sqrt(14);

    t.is(result, expectedResult);
});

test('Test normalization - Vector(4,0,0)', (t) => {
    const v1 = new Vector(4, 0, 0);
    const result = normalize(v1);
    const expectedResult = new Vector(1, 0, 0);

    t.is(result.equal(expectedResult), true);
});

test('Test normalization - Vector(1,2,3)', (t) => {
    const v1 = new Vector(1, 2, 3);
    const result = normalize(v1);
    const expectedResult = new Vector(1 / Math.sqrt(14), 2 / Math.sqrt(14), 3 / Math.sqrt(14));

    t.is(result.equal(expectedResult), true);
});

test('Test dot product', (t) => {
    const v1 = new Vector(1, 2, 3);
    const v2 = new Vector(2, 3, 4);
    const result = dotProduct(v1, v2);
    const expectedResult = 20;

    t.is(result, expectedResult);
});

test('Test cross product - a cross b', (t) => {
    const v1 = new Vector(1, 2, 3);
    const v2 = new Vector(2, 3, 4);
    const result = crossProduct(v1, v2);
    const expectedResult = new Vector(-1, 2, -1);

    t.is(result.equal(expectedResult), true);
});

test('Test cross product - b cross a', (t) => {
    const v1 = new Vector(2, 3, 4);
    const v2 = new Vector(1, 2, 3);
    const result = crossProduct(v1, v2);
    const expectedResult = new Vector(1, -2, 1);

    t.is(result.equal(expectedResult), true);
});

test('Test hadamard product', (t) => {
    const c1 = new Color(1, 0.2, 0.4);
    const c2 = new Color(0.9, 1, 0.1);
    const result = hadamardProduct(c1, c2);
    const expectedResult = new Color(0.9, 0.2, 0.04);

    t.is(result.equal(expectedResult), true);
});
