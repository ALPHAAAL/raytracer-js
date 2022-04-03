import AbstractPattern from './AbstractPattern';

export default class RingPattern extends AbstractPattern {
    constructor(colorA, colorB, factory, matrixOperator) {
        super(factory, matrixOperator);

        this.colorA = colorA;
        this.colorB = colorB;
    }

    patternAt(point) {
        return Math.floor(Math.sqrt(point.getX() * point.getX() + point.getZ() * point.getZ())) % 2 === 0 ? this.colorA : this.colorB;
    }
}
