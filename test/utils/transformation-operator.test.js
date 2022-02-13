import test from 'ava';
import MatrixOperator from '../../src/utils/matrix-operators';
import { Point, Vector } from '../../src/data-structure';
import Factory from '../../src/utils/factory';

// Move point forward
test('Test forward translation on a point', (t) => {
    const transformationMatrix = Factory.createTransformationMatrix().translate(5, -3, 2);
    const point = new Point(-3, 4, 5);
    const expectedResult = new Point(2, 1, 7);

    t.is(MatrixOperator.multiply(transformationMatrix, point).equal(expectedResult), true);
});

// Move point in reverse direction
test('Test reverse translation on a point', (t) => {
    const transformationMatrix = Factory.createTransformationMatrix().translate(5, -3, 2);
    const inverseOfTransformationMatrix = MatrixOperator.inverse(transformationMatrix);
    const point = new Point(-3, 4, 5);
    const expectedResult = new Point(-8, 7, 3);

    t.is(MatrixOperator.multiply(inverseOfTransformationMatrix, point).equal(expectedResult), true);
});

// Applying translation matrix on vector won't work
test('Test translation on a vector', (t) => {
    const transformationMatrix = Factory.createTransformationMatrix().translate(5, -3, 2);
    const vector = new Vector(-3, 4, 5);
    const expectedResult = vector;

    t.is(MatrixOperator.multiply(transformationMatrix, vector).equal(expectedResult), true);
});

// Applying scaling on a point
test('Test scaling on a point', (t) => {
    const transformationMatrix = Factory.createTransformationMatrix().scale(2, 3, 4);
    const point = new Point(-4, 6, 8);
    const expectedResult = new Point(-8, 18, 32);
    const result = MatrixOperator.multiply(transformationMatrix, point);

    t.is(result.equal(expectedResult), true);
});

// Applying scaling on a vector
test('Test scaling on a vector', (t) => {
    const transformationMatrix = Factory.createTransformationMatrix().scale(2, 3, 4);
    const vector = new Vector(-4, 6, 8);
    const expectedResult = new Vector(-8, 18, 32);
    const result = MatrixOperator.multiply(transformationMatrix, vector);

    t.is(result.equal(expectedResult), true);
});

test('Test reflection', (t) => {
    const p = new Point(2, 3, 4);
    const transformationMatrix = Factory.createTransformationMatrix().reflect('x');
    const expectedResult = new Point(-2, 3, 4);
    const result = MatrixOperator.multiply(transformationMatrix, p);

    t.is(result.equal(expectedResult), true);
});

test('Test rotation around x-axis', (t) => {
    const p = new Point(0, 1, 0);
    const halfQuarter = Factory.createTransformationMatrix().rotateX(Math.PI / 4);
    const fullQuarter = Factory.createTransformationMatrix().rotateX(Math.PI / 2);
    const halfQuarterExpectedResult = new Point(0, Math.sqrt(2) / 2, Math.sqrt(2) / 2);
    const fullQuarterExpectedResult = new Point(0, 0, 1);
    const halfQuarterResult = MatrixOperator.multiply(halfQuarter, p);
    const fullQuarterResult = MatrixOperator.multiply(fullQuarter, p);

    t.is(halfQuarterResult.equal(halfQuarterExpectedResult), true);
    t.is(fullQuarterResult.equal(fullQuarterExpectedResult), true);
});

test('Test rotation around y-axis', (t) => {
    const p = new Point(0, 0, 1);
    const halfQuarter = Factory.createTransformationMatrix().rotateY(Math.PI / 4);
    const fullQuarter = Factory.createTransformationMatrix().rotateY(Math.PI / 2);
    const halfQuarterExpectedResult = new Point(Math.sqrt(2) / 2, 0, Math.sqrt(2) / 2);
    const fullQuarterExpectedResult = new Point(1, 0, 0);
    const halfQuarterResult = MatrixOperator.multiply(halfQuarter, p);
    const fullQuarterResult = MatrixOperator.multiply(fullQuarter, p);

    t.is(halfQuarterResult.equal(halfQuarterExpectedResult), true);
    t.is(fullQuarterResult.equal(fullQuarterExpectedResult), true);
});

test('Test rotation around z-axis', (t) => {
    const p = new Point(0, 1, 0);
    const halfQuarter = Factory.createTransformationMatrix().rotateZ(Math.PI / 4);
    const fullQuarter = Factory.createTransformationMatrix().rotateZ(Math.PI / 2);
    const halfQuarterExpectedResult = new Point(-Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0);
    const fullQuarterExpectedResult = new Point(-1, 0, 0);
    const halfQuarterResult = MatrixOperator.multiply(halfQuarter, p);
    const fullQuarterResult = MatrixOperator.multiply(fullQuarter, p);

    t.is(halfQuarterResult.equal(halfQuarterExpectedResult), true);
    t.is(fullQuarterResult.equal(fullQuarterExpectedResult), true);
});

test('Test shear moves x in proportion to y', (t) => {
    const p = new Point(2, 3, 4);
    const transformationMatrix = Factory.createTransformationMatrix().shear(1, 0, 0, 0, 0, 0);
    const expectedResult = new Point(5, 3, 4);
    const result = MatrixOperator.multiply(transformationMatrix, p);

    t.is(result.equal(expectedResult), true);
});

test('Test shear moves x in proportion to z', (t) => {
    const p = new Point(2, 3, 4);
    const transformationMatrix = Factory.createTransformationMatrix().shear(0, 1, 0, 0, 0, 0);
    const expectedResult = new Point(6, 3, 4);
    const result = MatrixOperator.multiply(transformationMatrix, p);

    t.is(result.equal(expectedResult), true);
});

test('Test shear moves y in proportion to x', (t) => {
    const p = new Point(2, 3, 4);
    const transformationMatrix = Factory.createTransformationMatrix().shear(0, 0, 1, 0, 0, 0);
    const expectedResult = new Point(2, 5, 4);
    const result = MatrixOperator.multiply(transformationMatrix, p);

    t.is(result.equal(expectedResult), true);
});

test('Test shear moves y in proportion to z', (t) => {
    const p = new Point(2, 3, 4);
    const transformationMatrix = Factory.createTransformationMatrix().shear(0, 0, 0, 1, 0, 0);
    const expectedResult = new Point(2, 7, 4);
    const result = MatrixOperator.multiply(transformationMatrix, p);

    t.is(result.equal(expectedResult), true);
});

test('Test shear moves z in proportion to x', (t) => {
    const p = new Point(2, 3, 4);
    const transformationMatrix = Factory.createTransformationMatrix().shear(0, 0, 0, 0, 1, 0);
    const expectedResult = new Point(2, 3, 6);
    const result = MatrixOperator.multiply(transformationMatrix, p);

    t.is(result.equal(expectedResult), true);
});

test('Test shear moves z in proportion to y', (t) => {
    const p = new Point(2, 3, 4);
    const transformationMatrix = Factory.createTransformationMatrix().shear(0, 0, 0, 0, 0, 1);
    const expectedResult = new Point(2, 3, 7);
    const result = MatrixOperator.multiply(transformationMatrix, p);

    t.is(result.equal(expectedResult), true);
});

test('Test applying transformation in sequence', (t) => {
    const p = new Point(1, 0, 1);
    const transformationMatrix = Factory.createTransformationMatrix().rotateX(Math.PI / 2).scale(5, 5, 5).translate(10, 5, 7);
    const expectedResult = new Point(15, 0, 7);
    const result = MatrixOperator.multiply(transformationMatrix, p);

    t.is(result.equal(expectedResult), true);
});
