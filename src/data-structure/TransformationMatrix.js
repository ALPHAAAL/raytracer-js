import Matrix from './Matrix';

export default class TransformationMatrix extends Matrix {
    constructor(matrixOperator, size = 4) {
        super(size, true);
        this.matrixOperator = matrixOperator;
    }

    translate(x, y, z) {
        const m = new TransformationMatrix(this.matrixOperator);

        m.setCol(3, [x, y, z, 1]);

        return this.matrixOperator.multiply(m, this);
    }

    scale(x, y, z) {
        const m = new TransformationMatrix(this.matrixOperator);

        m.setElement(0, 0, x);
        m.setElement(1, 1, y);
        m.setElement(2, 2, z);

        return this.matrixOperator.multiply(m, this);
    }

    reflect(axis) {
        switch (axis) {
        case 'x':
            return this.scale(-1, 1, 1);
        case 'y':
            return this.scale(1, -1, 1);
        case 'z':
            return this.scale(1, 1, -1);
        default:
            return this.scale(1, 1, 1);
        }
    }

    rotateX(radians) {
        const m = new TransformationMatrix(this.matrixOperator);

        m.setElement(1, 1, Math.cos(radians));
        m.setElement(1, 2, -Math.sin(radians));
        m.setElement(2, 1, Math.sin(radians));
        m.setElement(2, 2, Math.cos(radians));

        return this.matrixOperator.multiply(m, this);
    }

    rotateY(radians) {
        const m = new TransformationMatrix(this.matrixOperator);

        m.setElement(0, 0, Math.cos(radians));
        m.setElement(0, 2, Math.sin(radians));
        m.setElement(2, 0, -Math.sin(radians));
        m.setElement(2, 2, Math.cos(radians));

        return this.matrixOperator.multiply(m, this);
    }

    rotateZ(radians) {
        const m = new TransformationMatrix(this.matrixOperator);

        m.setElement(0, 0, Math.cos(radians));
        m.setElement(0, 1, -Math.sin(radians));
        m.setElement(1, 0, Math.sin(radians));
        m.setElement(1, 1, Math.cos(radians));

        return this.matrixOperator.multiply(m, this);
    }

    shear(xy, xz, yx, yz, zx, zy) {
        const m = new TransformationMatrix(this.matrixOperator);

        m.setElement(0, 1, xy);
        m.setElement(0, 2, xz);
        m.setElement(1, 0, yx);
        m.setElement(1, 2, yz);
        m.setElement(2, 0, zx);
        m.setElement(2, 1, zy);

        return this.matrixOperator.multiply(m, this);
    }
}
