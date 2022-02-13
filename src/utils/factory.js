import { Sphere, TransformationMatrix } from '../data-structure';
import MatrixOperators from './matrix-operators';

export default class Factory {
    static createTransformationMatrix(size = 4) {
        return new TransformationMatrix(MatrixOperators, size);
    }

    static createSphere() {
        return new Sphere(Factory);
    }
}
