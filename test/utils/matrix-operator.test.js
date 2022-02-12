import test from 'ava';
import { EPSILON } from '../../src/constants';
import { Matrix, Tuple } from '../../src/data-structure';
import MatrixOperator from '../../src/utils/matrix-operators';

const epsilonEqual = (a, b) => Math.abs(a - b) < EPSILON;

test('Test multiplication - matrix', (t) => {
    const m1 = new Matrix(4);
    const m2 = new Matrix(4);
    const expectedResult = new Matrix(4);

    m1.setRow(0, [1, 2, 3, 4]);
    m1.setRow(1, [5, 6, 7, 8]);
    m1.setRow(2, [9, 8, 7, 6]);
    m1.setRow(3, [5, 4, 3, 2]);

    m2.setRow(0, [-2, 1, 2, 3]);
    m2.setRow(1, [3, 2, 1, -1]);
    m2.setRow(2, [4, 3, 6, 5]);
    m2.setRow(3, [1, 2, 7, 8]);

    const result = MatrixOperator.multiply(m1, m2);

    expectedResult.setRow(0, [20, 22, 50, 48]);
    expectedResult.setRow(1, [44, 54, 114, 108]);
    expectedResult.setRow(2, [40, 58, 110, 102]);
    expectedResult.setRow(3, [16, 26, 46, 42]);

    t.is(result.equal(expectedResult), true);
});

test('Test multiplication - tuple', (t) => {
    const matrix = new Matrix(4);
    const tuple = new Tuple(1, 2, 3, 1);
    const expectedResult = new Tuple(18, 24, 33, 1);

    matrix.setRow(0, [1, 2, 3, 4]);
    matrix.setRow(1, [2, 4, 4, 2]);
    matrix.setRow(2, [8, 6, 4, 1]);
    matrix.setRow(3, [0, 0, 0, 1]);

    const result = MatrixOperator.multiply(matrix, tuple);

    t.is(result.equal(expectedResult), true);
});

test('Test multiplication - identity matrix', (t) => {
    const m1 = new Matrix(4);
    const m2 = new Matrix(4, true);
    const expectedResult = new Matrix(4);

    m1.setRow(0, [1, 2, 3, 4]);
    m1.setRow(1, [2, 4, 4, 2]);
    m1.setRow(2, [8, 6, 4, 1]);
    m1.setRow(3, [0, 0, 0, 1]);

    expectedResult.setRow(0, [1, 2, 3, 4]);
    expectedResult.setRow(1, [2, 4, 4, 2]);
    expectedResult.setRow(2, [8, 6, 4, 1]);
    expectedResult.setRow(3, [0, 0, 0, 1]);

    const result = MatrixOperator.multiply(m1, m2);

    t.is(result.equal(expectedResult), true);
});

test('Test transpose', (t) => {
    const m = new Matrix(4);
    const expectedResult = new Matrix(4);

    m.setRow(0, [0, 9, 3, 0]);
    m.setRow(1, [9, 8, 0, 8]);
    m.setRow(2, [1, 8, 5, 3]);
    m.setRow(3, [0, 0, 5, 8]);

    expectedResult.setRow(0, [0, 9, 1, 0]);
    expectedResult.setRow(1, [9, 8, 8, 0]);
    expectedResult.setRow(2, [3, 0, 5, 5]);
    expectedResult.setRow(3, [0, 8, 3, 8]);

    const result = MatrixOperator.transpose(m);

    t.is(result.equal(expectedResult), true);
});

test('Test determinants - 2 * 2 matrix', (t) => {
    const m = new Matrix(2);
    const expectedResult = 17;

    m.setRow(0, [1, 5]);
    m.setRow(1, [-3, 2]);

    const result = MatrixOperator.determinants(m);

    t.deepEqual(result, expectedResult);
});

test('Test submatrix - 3 * 3', (t) => {
    const m = new Matrix(3);
    const expectedResult = new Matrix(2);

    m.setRow(0, [1, 5, 0]);
    m.setRow(1, [-3, 2, 7]);
    m.setRow(2, [0, 6, -3]);

    expectedResult.setRow(0, [-3, 2]);
    expectedResult.setRow(1, [0, 6]);

    const result = MatrixOperator.submatrix(m, 0, 2);

    t.is(result.equal(expectedResult), true);
});

test('Test submatrix - 4 * 4', (t) => {
    const m = new Matrix(4);
    const expectedResult = new Matrix(3);

    m.setRow(0, [-6, 1, 1, 6]);
    m.setRow(1, [-8, 5, 8, 6]);
    m.setRow(2, [-1, 0, 8, 2]);
    m.setRow(3, [-7, 1, -1, 1]);

    expectedResult.setRow(0, [-6, 1, 6]);
    expectedResult.setRow(1, [-8, 8, 6]);
    expectedResult.setRow(2, [-7, -1, 1]);

    const result = MatrixOperator.submatrix(m, 2, 1);

    t.is(result.equal(expectedResult), true);
});

test('Test minor - 3 * 3', (t) => {
    const m = new Matrix(3);
    const expectedResult = 25;

    m.setRow(0, [3, 5, 0]);
    m.setRow(1, [2, -1, -7]);
    m.setRow(2, [6, -1, 5]);

    const result = MatrixOperator.minor(m, 1, 0);

    t.deepEqual(result, expectedResult);
});

test('Test cofactor - 3 * 3', (t) => {
    const m = new Matrix(3);

    m.setRow(0, [3, 5, 0]);
    m.setRow(1, [2, -1, -7]);
    m.setRow(2, [6, -1, 5]);

    t.deepEqual(MatrixOperator.minor(m, 0, 0), -12);
    t.deepEqual(MatrixOperator.cofactor(m, 0, 0), -12);
    t.deepEqual(MatrixOperator.minor(m, 1, 0), 25);
    t.deepEqual(MatrixOperator.cofactor(m, 1, 0), -25);
});

test('Test determinant - 3 * 3', (t) => {
    const m = new Matrix(3);

    m.setRow(0, [1, 2, 6]);
    m.setRow(1, [-5, 8, -4]);
    m.setRow(2, [2, 6, 4]);

    t.deepEqual(MatrixOperator.cofactor(m, 0, 0), 56);
    t.deepEqual(MatrixOperator.cofactor(m, 0, 1), 12);
    t.deepEqual(MatrixOperator.cofactor(m, 0, 2), -46);
    t.deepEqual(MatrixOperator.determinants(m), -196);
});

test('Test determinant - 4 * 4', (t) => {
    const m = new Matrix(4);

    m.setRow(0, [-2, -8, 3, 5]);
    m.setRow(1, [-3, 1, 7, 3]);
    m.setRow(2, [1, 2, -9, 6]);
    m.setRow(3, [-6, 7, 7, -9]);

    t.deepEqual(MatrixOperator.cofactor(m, 0, 0), 690);
    t.deepEqual(MatrixOperator.cofactor(m, 0, 1), 447);
    t.deepEqual(MatrixOperator.cofactor(m, 0, 2), 210);
    t.deepEqual(MatrixOperator.cofactor(m, 0, 3), 51);
    t.deepEqual(MatrixOperator.determinants(m), -4071);
});

test('Test inverse - 4 * 4 case 1', (t) => {
    const m = new Matrix(4);
    const expectedResult = new Matrix(4);

    m.setRow(0, [-5, 2, 6, -8]);
    m.setRow(1, [1, -5, 1, 8]);
    m.setRow(2, [7, 7, -6, -7]);
    m.setRow(3, [1, -3, 7, 4]);

    expectedResult.setRow(0, [0.21805, 0.45113, 0.24060, -0.04511]);
    expectedResult.setRow(1, [-0.80827, -1.45677, -0.44361, 0.52068]);
    expectedResult.setRow(2, [-0.07895, -0.22368, -0.05263, 0.19737]);
    expectedResult.setRow(3, [-0.52256, -0.81391, -0.30075, 0.30639]);

    t.deepEqual(MatrixOperator.determinants(m), 532);
    t.deepEqual(MatrixOperator.cofactor(m, 2, 3), -160);
    t.is(epsilonEqual(expectedResult.getElement(3, 2), -160 / 532), true);
    t.deepEqual(MatrixOperator.cofactor(m, 3, 2), 105);
    t.is(epsilonEqual(expectedResult.getElement(2, 3), 105 / 532), true);
    t.is(MatrixOperator.inverse(m).equal(expectedResult), true);
});

test('Test inverse - 4 * 4 case 2', (t) => {
    const m = new Matrix(4);
    const expectedResult = new Matrix(4);

    m.setRow(0, [8, -5, 9, 2]);
    m.setRow(1, [7, 5, 6, 1]);
    m.setRow(2, [-6, 0, 9, 6]);
    m.setRow(3, [-3, 0, -9, -4]);

    expectedResult.setRow(0, [-0.15385, -0.15385, -0.28205, -0.53846]);
    expectedResult.setRow(1, [-0.07692, 0.12308, 0.02564, 0.03077]);
    expectedResult.setRow(2, [0.35897, 0.35897, 0.43590, 0.92308]);
    expectedResult.setRow(3, [-0.69231, -0.69231, -0.76923, -1.92308]);

    t.is(MatrixOperator.inverse(m).equal(expectedResult), true);
});

test('Test inverse - 4 * 4 case 3', (t) => {
    const m = new Matrix(4);
    const expectedResult = new Matrix(4);

    m.setRow(0, [9, 3, 0, 9]);
    m.setRow(1, [-5, -2, -6, -3]);
    m.setRow(2, [-4, 9, 6, 4]);
    m.setRow(3, [-7, 6, 6, 2]);

    expectedResult.setRow(0, [-0.04074, -0.07778, 0.14444, -0.22222]);
    expectedResult.setRow(1, [-0.07778, 0.03333, 0.36667, -0.33333]);
    expectedResult.setRow(2, [-0.02901, -0.14630, -0.10926, 0.12963]);
    expectedResult.setRow(3, [0.17778, 0.06667, -0.26667, 0.33333]);

    t.is(MatrixOperator.inverse(m).equal(expectedResult), true);
});

test('Test inverse - A * B = C, C * B^-1 = A', (t) => {
    const m1 = new Matrix(4);
    const m2 = new Matrix(4);
    const expectedResult = m1;

    m1.setRow(0, [3, -9, 7, 3]);
    m1.setRow(1, [3, -8, 2, -9]);
    m1.setRow(2, [-4, 4, 4, 1]);
    m1.setRow(3, [-6, 5, -1, 1]);

    m2.setRow(0, [8, 2, 2, 2]);
    m2.setRow(1, [3, -1, 7, 0]);
    m2.setRow(2, [7, 0, 5, 4]);
    m2.setRow(3, [6, -2, 0, 5]);

    const m3 = MatrixOperator.multiply(m1, m2);

    t.is(MatrixOperator.multiply(m3, MatrixOperator.inverse(m2)).equal(expectedResult), true);
});
