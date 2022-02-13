import { Intersection, Ray } from '../data-structure';
import MatrixOperators from './matrix-operators';
import Operators from './operators';

export default class RayOperators {
    static position(ray, t) {
        return Operators.add(ray.getOrigin())(Operators.multiply(ray.getDirection(), t))();
    }

    // Ray sphere intersection
    // Using analytic solution here instead of geometric
    // ax^2 + bx + c
    // a = ray^2 (dot product of itself), b = 2 * sphereToRay * ray, c = ray ^ 2 - radius ^ 2
    // Returns the t that correspond to the intersection
    // https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection
    static intersect(sphere, ray) {
        let newRay = ray;
        if (sphere.getTransform()) {
            newRay = RayOperators.transform(ray, MatrixOperators.inverse(sphere.getTransform()));
        }
        const sphereToRay = Operators.subtract(newRay.getOrigin(), sphere.getOrigin());
        const a = Operators.dotProduct(newRay.getDirection(), newRay.getDirection());
        const b = 2 * Operators.dotProduct(newRay.getDirection(), sphereToRay);
        const c = Operators.dotProduct(sphereToRay, sphereToRay) - (sphere.getRadius() * sphere.getRadius()); // The 1 correspond to the radius ^ 2 of the unit sphere we are using
        const discriminant = b * b - 4 * a * c;

        if (discriminant < 0) {
            return [];
        }

        const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

        return [new Intersection(t1, sphere), new Intersection(t2, sphere)];
    }

    static hit(intersections) {
        let t = Number.MAX_SAFE_INTEGER;
        let result = null;

        intersections.forEach((i) => {
            if (i.getT() > 0 && i.getT() < t) {
                result = i;
                t = i.getT();
            }
        });

        return result;
    }

    static transform(ray, transformationMatrix) {
        const p = ray.getOrigin();
        const d = ray.getDirection();

        const newP = MatrixOperators.multiply(transformationMatrix, p);
        const newD = MatrixOperators.multiply(transformationMatrix, d);

        return new Ray(newP, newD);
    }
}
