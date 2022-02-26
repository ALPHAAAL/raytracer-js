import {
    Color, Material, Sphere, TransformationMatrix,
} from '../data-structure';
import MatrixOperators from './matrix-operators';

export default class Factory {
    static createTransformationMatrix(size = 4) {
        return new TransformationMatrix(MatrixOperators, size);
    }

    static createSphere() {
        return new Sphere(Factory);
    }

    static createMaterial(
        color = new Color(1, 1, 1),
        ambient = 0.1,
        diffuse = 0.9,
        specular = 0.9,
        shininess = 200.0,
    ) {
        return new Material(color, ambient, diffuse, specular, shininess);
    }
}
