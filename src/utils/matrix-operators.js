import {
    Matrix, Point, Tuple, Vector,
} from '../data-structure';
import TransformationMatrix from '../data-structure/TransformationMatrix';
import Operators from './operators';

export default class MatrixOperators {
    static multiplyTuple(m, t) {
        if (m.getSize() !== t.getSize()) {
            throw new Error('Size does not match');
        }

        const result = [];

        for (let i = 0; i < m.getSize(); i++) {
            result.push(Operators.dotProduct(m.getRow(i), t.getValues()));
        }

        if (t instanceof Point) {
            return new Point(result[0], result[1], result[2]);
        }

        if (t instanceof Vector) {
            return new Vector(result[0], result[1], result[2]);
        }

        return new Tuple(...result);
    }

    static multiply(m1, m2) {
        if (m1 instanceof Matrix && m2 instanceof Tuple) {
            return MatrixOperators.multiplyTuple(m1, m2);
        }
        if (m1.getSize() !== m2.getSize()) {
            throw new Error('Matrix size does not match');
        }

        const size = m1.getSize();
        const isTransformationMatrix = m1 instanceof TransformationMatrix && m2 instanceof TransformationMatrix;
        const matrix = isTransformationMatrix ? new TransformationMatrix(MatrixOperators) : new Matrix(size);

        for (let i = 0; i < size; i++) {
            const data = [];

            for (let j = 0; j < size; j++) {
                data.push(Operators.dotProduct(m1.getRow(i), m2.getCol(j)));
            }

            matrix.setRow(i, data);
        }

        return matrix;
    }

    static transpose(m) {
        const t = new Matrix(m.getSize());

        for (let i = 0; i < m.getSize(); i++) {
            t.setCol(i, m.getRow(i));
        }

        return t;
    }

    static determinants(m) {
        if (m.getSize() === 2) {
            return m.getElement(0, 0) * m.getElement(1, 1) - m.getElement(0, 1) * m.getElement(1, 0);
        }

        let result = 0;

        for (let i = 0; i < m.getSize(); i++) {
            result += m.getElement(0, i) * MatrixOperators.cofactor(m, 0, i);
        }

        return result;
    }

    static cofactor = (m, row, col) => {
        const val = MatrixOperators.minor(m, row, col);

        return (row + col) % 2 === 0 ? val : -val;
    };

    static submatrix = (m, row, col) => {
        const size = m.getSize();
        const result = new Matrix(size - 1);
        let currentRow = 0;

        for (let i = 0; i < size; i++) {
            if (i === row) {
                // eslint-disable-next-line no-continue
                continue;
            }
            const data = [];

            for (let j = 0; j < size; j++) {
                if (j !== col) {
                    data.push(m.getElement(i, j));
                }
            }

            result.setRow(currentRow, data);
            currentRow += 1;
        }

        return result;
    };

    static minor(m, row, col) {
        return MatrixOperators.determinants(MatrixOperators.submatrix(m, row, col));
    }

    static inverse(m) {
        if (MatrixOperators.determinants(m) === 0) {
            throw new Error('Matrix not invertible');
        }

        const inverseMatrix = new Matrix(m.getSize());
        const size = m.getSize();
        const d = MatrixOperators.determinants(m);

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                inverseMatrix.setElement(j, i, MatrixOperators.cofactor(m, i, j) / d);
            }
        }

        return inverseMatrix;
    }
}
