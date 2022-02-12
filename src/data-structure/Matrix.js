import lodash from 'lodash';
import { EPSILON } from '../constants';

const {
    inRange, range, chunk,
} = lodash;

// Only support square matrix
// Add caching to improve performance
export default class Matrix {
    constructor(size, isIdentity = false) {
        this.size = size;

        if (!isIdentity) {
            this.values = chunk(range(0, size * size).map(() => 0), size);
        } else {
            this.values = chunk(range(0, size * size).map(() => 0), size);
            for (let i = 0; i < size; i++) {
                this.values[i][i] = 1;
            }
        }
    }

    getValue() {
        return this.values;
    }

    getSize() {
        return this.size;
    }

    isInRange(row) {
        return inRange(row, 0, this.size);
    }

    getElement(row, col) {
        if (!this.isInRange(row) || !this.isInRange(col)) {
            throw new Error('Invalid element index');
        }

        return this.values[row][col];
    }

    setElement(row, col, value) {
        if (!this.isInRange(row) || !this.isInRange(col)) {
            throw new Error('Invalid element index');
        }

        this.values[row][col] = value;
    }

    setRow(rowNumber, data) {
        if (!this.isInRange(rowNumber) || data.length !== this.size) {
            throw new Error('Invalid row');
        }

        this.values[rowNumber] = data;
    }

    getRow(row) {
        if (!this.isInRange(row)) {
            throw new Error('Invalid row');
        }

        return this.values[row];
    }

    getCol(col) {
        if (!this.isInRange(col)) {
            throw new Error('Invalid col');
        }

        return this.values.map((e) => e[col]);
    }

    setCol(colNumber, data) {
        if (!this.isInRange(colNumber)) {
            throw new Error('Invalid col');
        }

        for (let i = 0; i < this.size; i++) {
            this.values[i][colNumber] = data[i];
        }
    }

    equal(matrix) {
        const epsilonEqual = (val1, val2) => Math.abs(val1 - val2) < EPSILON;

        if (this.size === matrix.getSize()) {
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    if (!epsilonEqual(matrix.getElement(i, j), this.getElement(i, j))) {
                        return false;
                    }
                }
            }

            return true;
        }

        return false;
    }
}
