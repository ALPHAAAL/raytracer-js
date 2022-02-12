import test from 'ava';
import { Matrix } from '../../src/data-structure';

test('Initialize matrix', (t) => {
    const matrix = new Matrix(4);

    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            if (matrix.getElement(x, y) !== 0) {
                t.fail();
            }
        }
    }

    t.pass();
});

test('Initialize matrix - identity', (t) => {
    const matrix = new Matrix(4, true);

    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            if (x === y && matrix.getElement(x, y) !== 1) {
                t.fail();
            } else if (x !== y && matrix.getElement(x, y) !== 0) {
                t.fail();
            }
        }
    }

    t.pass();
});

test('Set matrix elements - size 4', (t) => {
    const matrix = new Matrix(4);

    matrix.setRow(0, [1, 2, 3, 4]);
    matrix.setRow(1, [5.5, 6.5, 7.5, 8.5]);
    matrix.setRow(2, [9, 10, 11, 12]);
    matrix.setRow(3, [13.5, 14.5, 15.5, 16.5]);

    t.is(matrix.getElement(0, 0), 1);
    t.is(matrix.getElement(0, 3), 4);
    t.is(matrix.getElement(1, 0), 5.5);
    t.is(matrix.getElement(1, 2), 7.5);
    t.is(matrix.getElement(2, 2), 11);
    t.is(matrix.getElement(3, 0), 13.5);
    t.is(matrix.getElement(3, 2), 15.5);
});

test('Set matrix elements - size 2', (t) => {
    const matrix = new Matrix(2);

    matrix.setRow(0, [-3, 5]);
    matrix.setRow(1, [1, -2]);

    t.is(matrix.getElement(0, 0), -3);
    t.is(matrix.getElement(0, 1), 5);
    t.is(matrix.getElement(1, 0), 1);
    t.is(matrix.getElement(1, 1), -2);
});

test('Set matrix elements - size 3', (t) => {
    const matrix = new Matrix(3);

    matrix.setRow(0, [-3, 5, 0]);
    matrix.setRow(1, [1, -2, -7]);
    matrix.setRow(2, [0, 1, 1]);

    t.is(matrix.getElement(0, 0), -3);
    t.is(matrix.getElement(1, 1), -2);
    t.is(matrix.getElement(2, 2), 1);
});

test('Test matrix equality - positive', (t) => {
    const matrix = new Matrix(3);
    const matrix2 = new Matrix(3);

    matrix.setRow(0, [-3, 5, 0.0000000000000001]);
    matrix.setRow(1, [1, -2, -7]);
    matrix.setRow(2, [0, 1, 1]);

    matrix2.setRow(0, [-3, 5, 0.0000000000000001]);
    matrix2.setRow(1, [1, -2, -7]);
    matrix2.setRow(2, [0, 1, 1]);

    t.is(matrix.equal(matrix2), true);
});

test('Test matrix equality - negative', (t) => {
    const matrix = new Matrix(3);
    const matrix2 = new Matrix(3);

    matrix.setRow(0, [-3, 5, 0.0000000000000001]);
    matrix.setRow(1, [1, -2, -7]);
    matrix.setRow(2, [0, 1, 1]);

    matrix2.setRow(0, [-3, 5, 0.1]);
    matrix2.setRow(1, [1, -2, -7]);
    matrix2.setRow(2, [0, 1, 1]);

    t.is(matrix.equal(matrix2), false);
});

test('Test get column', (t) => {
    const matrix = new Matrix(3);

    matrix.setRow(0, [-3, 5, 0.0000000000000001]);
    matrix.setRow(1, [1, -2, -7]);
    matrix.setRow(2, [0, 1, 1]);

    t.deepEqual(matrix.getCol(0), [-3, 1, 0]);
});
