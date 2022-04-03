import AbstractPattern from './AbstractPattern';

export default class GradientPattern extends AbstractPattern {
    constructor(colorA, colorB, operator, factory, matrixOperator) {
        super(factory, matrixOperator);

        this.colorA = colorA;
        this.colorB = colorB;
        this.operator = operator;
    }

    patternAt(point) {
        const distance = this.operator.subtract(this.colorB, this.colorA);
        const fraction = point.getX() - Math.floor(point.getX());

        return this.operator.add(this.colorA)(this.operator.multiply(distance, fraction))();
    }
}
