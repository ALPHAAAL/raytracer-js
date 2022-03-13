import {
    Camera,
    Color, Material, Plane, Sphere, TransformationMatrix,
} from '../data-structure';
import MatrixOperators from './matrix-operators';
import Operators from './operators';

export default class Factory {
    static createTransformationMatrix(size = 4) {
        return new TransformationMatrix(MatrixOperators, size);
    }

    static createSphere() {
        return new Sphere(Factory, Operators);
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

    static createCamera(hsize, vsize, fieldOfView) {
        return new Camera(hsize, vsize, fieldOfView, Factory);
    }

    static createPlane() {
        return new Plane(Factory);
    }
}
