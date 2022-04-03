import AbstractPattern from './AbstractPattern';

export default class CheckerPattern extends AbstractPattern {
    constructor(colorA, colorB, factory, matrixOperator) {
        super(factory, matrixOperator);

        this.colorA = colorA;
        this.colorB = colorB;
    }

    patternAt(point) {
        return (Math.floor(point.getX()) + Math.floor(point.getY()) + Math.floor(point.getZ())) % 2 === 0 ? this.colorA : this.colorB;
    }
}
