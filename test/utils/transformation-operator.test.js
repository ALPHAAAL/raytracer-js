import test from 'ava';
import TransformationOperator from '../../src/utils/transformation-operator';
import MatrixOperator from '../../src/utils/matrix-operators';
import { Point, Vector } from '../../src/data-structure';

// Move point forward
test('Test forward translation on a point', (t) => {
    const translationMatrix = TransformationOperator.translation(5, -3, 2);
    const point = new Point(-3, 4, 5);
    const expectedResult = new Point(2, 1, 7);

    t.is(MatrixOperator.multiply(translationMatrix, point).equal(expectedResult), true);
});

// Move point in reverse direction
test('Test reverse translation on a point', (t) => {
    const translationMatrix = TransformationOperator.translation(5, -3, 2);
    const inverseOfTranslationMatrix = MatrixOperator.inverse(translationMatrix);
    const point = new Point(-3, 4, 5);
    const expectedResult = new Point(-8, 7, 3);

    t.is(MatrixOperator.multiply(inverseOfTranslationMatrix, point).equal(expectedResult), true);
});

// Applying translation matrix on vector won't work
test('Test translation on a vector', (t) => {
    const translationMatrix = TransformationOperator.translation(5, -3, 2);
    const inverseOfTranslationMatrix = MatrixOperator.inverse(translationMatrix);
    const vector = new Vector(-3, 4, 5);
    const expectedResult = vector;

    t.is(MatrixOperator.multiply(inverseOfTranslationMatrix, vector).equal(expectedResult), true);
});

// Applying scaling on a point
test('Test scaling on a point', (t) => {
    const scalingMatrix = TransformationOperator.scalaing(2, 3, 4);
    const point = new Point(-4, 6, 8);
    const expectedResult = new Point(-8, 18, 32);
    const result = MatrixOperator.multiply(scalingMatrix, point);

    t.is(result.equal(expectedResult), true);
});

// Applying scaling on a vector
test('Test scaling on a vector', (t) => {
    const scalingMatrix = TransformationOperator.scalaing(2, 3, 4);
    const vector = new Vector(-4, 6, 8);
    const expectedResult = new Vector(-8, 18, 32);
    const result = MatrixOperator.multiply(scalingMatrix, vector);

    t.is(result.equal(expectedResult), true);
});

// Inverse scaling matrix will scale in opposite ways
test('Test reverse scaling on a vector', (t) => {
    const p = new Point(2, 3, 4);
    const reflectionMatrix = TransformationOperator.reflect('x');
    const expectedResult = new Point(-2, 3, 4);
    const result = MatrixOperator.multiply(reflectionMatrix, p);

    t.is(result.equal(expectedResult), true);
});

test('Test rotation around x-axis', (t) => {
    const p = new Point(0, 1, 0);
    const halfQuarter = TransformationOperator.rotateX(Math.PI / 4);
    const fullQuarter = TransformationOperator.rotateX(Math.PI / 2);
    const halfQuarterExpectedResult = new Point(0, Math.sqrt(2) / 2, Math.sqrt(2) / 2);
    const fullQuarterExpectedResult = new Point(0, 0, 1);
    const halfQuarterResult = MatrixOperator.multiply(halfQuarter, p);
    const fullQuarterResult = MatrixOperator.multiply(fullQuarter, p);

    t.is(halfQuarterResult.equal(halfQuarterExpectedResult), true);
    t.is(fullQuarterResult.equal(fullQuarterExpectedResult), true);
});

test('Test rotation around y-axis', (t) => {
    const p = new Point(0, 0, 1);
    const halfQuarter = TransformationOperator.rotateY(Math.PI / 4);
    const fullQuarter = TransformationOperator.rotateY(Math.PI / 2);
    const halfQuarterExpectedResult = new Point(Math.sqrt(2) / 2, 0, Math.sqrt(2) / 2);
    const fullQuarterExpectedResult = new Point(1, 0, 0);
    const halfQuarterResult = MatrixOperator.multiply(halfQuarter, p);
    const fullQuarterResult = MatrixOperator.multiply(fullQuarter, p);

    t.is(halfQuarterResult.equal(halfQuarterExpectedResult), true);
    t.is(fullQuarterResult.equal(fullQuarterExpectedResult), true);
});

test('Test rotation around z-axis', (t) => {
    const p = new Point(0, 1, 0);
    const halfQuarter = TransformationOperator.rotateZ(Math.PI / 4);
    const fullQuarter = TransformationOperator.rotateZ(Math.PI / 2);
    const halfQuarterExpectedResult = new Point(-Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0);
    const fullQuarterExpectedResult = new Point(-1, 0, 0);
    const halfQuarterResult = MatrixOperator.multiply(halfQuarter, p);
    const fullQuarterResult = MatrixOperator.multiply(fullQuarter, p);

    t.is(halfQuarterResult.equal(halfQuarterExpectedResult), true);
    t.is(fullQuarterResult.equal(fullQuarterExpectedResult), true);
});
