import AbstractPattern from './AbstractPattern';

export default class StripePattern extends AbstractPattern {
    constructor(colorA, colorB, factory, matrixOperator) {
        super(factory, matrixOperator);

        this.colorA = colorA;
        this.colorB = colorB;
    }

    patternAt(point) {
        return Math.abs(Math.floor(point.getX()) % 2) === 0 ? this.colorA : this.colorB;
    }
}
