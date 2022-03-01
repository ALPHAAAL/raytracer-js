import _ from 'lodash';
import { EPSILON } from '../constants';
import { Intersection, Ray } from '../data-structure';
import MatrixOperators from './matrix-operators';
import Operators from './operators';

export default class RayOperators {
    // Computing the position of the ray by how far it travels (t)
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

    // in - normal * 2 * dot(in, normal)
    static reflect(inVector, normal) {
        return Operators.subtract(inVector, Operators.multiply(Operators.multiply(normal, 2), Operators.dotProduct(inVector, normal)));
    }

    // Assuming all objects in the world are sphere for now
    static intersectWorld(ray, world) {
        const objects = world.getObjects();
        const intersections = objects.map((object) => RayOperators.intersect(object, ray));

        return _.flatten(intersections).sort((a, b) => a.getT() - b.getT());
    }

    static prepareComputations(intersection, ray) {
        const t = intersection.getT();
        const object = intersection.getObject();
        const point = RayOperators.position(ray, t);
        const eyeVector = Operators.negate(ray.getDirection());
        let normalVector = MatrixOperators.normalAt(object, point);
        const inside = Operators.dotProduct(normalVector, eyeVector) < 0;

        normalVector = inside ? Operators.negate(normalVector) : normalVector;

        const overPoint = Operators.add(point)(Operators.multiply(normalVector, EPSILON))();

        return {
            t,
            object,
            point,
            eyeVector,
            normalVector,
            inside,
            overPoint,
        };
    }
}
