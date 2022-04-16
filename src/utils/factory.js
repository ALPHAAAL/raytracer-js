import {
    Camera,
    CheckerPattern,
    Color, Cone, Cube, Cylinder, GradientPattern, Material, Plane, RingPattern, Sphere, StripePattern, TestPattern, TransformationMatrix,
} from '../data-structure';
import MatrixOperators from './matrix-operators';
import Operators from './operators';

export default class Factory {
    static createTransformationMatrix(size = 4) {
        return new TransformationMatrix(MatrixOperators, size);
    }

    static createSphere(hasShadow = true) {
        return new Sphere(Factory, Operators, hasShadow);
    }

    static createMaterial(
        color = new Color(1, 1, 1),
        ambient = 0.1,
        diffuse = 0.9,
        specular = 0.9,
        shininess = 200.0,
        reflextive = 0.0,
        transparency = 0.0,
        refractiveIndex = 1.0,
        pattern = null,
    ) {
        return new Material(color, ambient, diffuse, specular, shininess, reflextive, transparency, refractiveIndex, pattern);
    }

    static createCamera(hsize, vsize, fieldOfView) {
        return new Camera(hsize, vsize, fieldOfView, Factory);
    }

    static createPlane(hasShadow = true) {
        return new Plane(Factory, hasShadow);
    }

    static createDefaultPattern() {
        return new TestPattern(Factory, MatrixOperators);
    }

    static createStripePattern(c1, c2) {
        return new StripePattern(c1, c2, Factory, MatrixOperators);
    }

    static createGradientPattern(c1, c2) {
        return new GradientPattern(c1, c2, Operators, Factory, MatrixOperators);
    }

    static createRignPattern(c1, c2) {
        return new RingPattern(c1, c2, Factory, MatrixOperators);
    }

    static createCheckerPattern(c1, c2) {
        return new CheckerPattern(c1, c2, Factory, MatrixOperators);
    }

    static createCube(hasShadow = true) {
        return new Cube(Factory, hasShadow);
    }

    static createCylinder(minimum = -Infinity, maximum = Infinity, closed = false, radius = 1, hasShadow = true) {
        return new Cylinder(radius, minimum, maximum, closed, hasShadow, Factory);
    }

    static createCone(minimum = -Infinity, maximum = Infinity, closed = false, radius = 1, hasShadow = true) {
        return new Cone(radius, minimum, maximum, closed, hasShadow, Factory);
    }
}
