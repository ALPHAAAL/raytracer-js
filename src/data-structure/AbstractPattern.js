export default class AbstractPattern {
    constructor(factory, matrixOperator) {
        this.transform = factory.createTransformationMatrix();
        this.matrixOperator = matrixOperator;
    }

    setTransform(t) {
        this.transform = t;
    }

    getTransform() {
        return this.transform;
    }

    // To be overriden
    // Should return a Color
    // eslint-disable-next-line class-methods-use-this
    patternAt() {
        throw new Error('This method is supposed to be overriden');
    }

    // Should return a Color
    patternAtShape(shape, worldPoint) {
        const objectPoint = this.matrixOperator.multiply(this.matrixOperator.inverse(shape.getTransform()), worldPoint);
        const patternPoint = this.matrixOperator.multiply(this.matrixOperator.inverse(this.getTransform()), objectPoint);

        return this.patternAt(patternPoint);
    }
}
