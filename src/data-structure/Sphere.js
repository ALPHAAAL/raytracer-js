import AbstractShape from './AbstractShape';
import Point from './Point';
import Intersection from './Intersection';

export default class Sphere extends AbstractShape {
    constructor(factory, operators, hasShadow) {
        super(factory, hasShadow);
        this.origin = new Point(0, 0, 0);
        this.radius = 1;
        this.operators = operators;
    }

    getOrigin() {
        return this.origin;
    }

    getRadius() {
        return this.radius;
    }

    intersect(ray) {
        const sphereToRay = this.operators.subtract(ray.getOrigin(), this.getOrigin());
        const a = this.operators.dotProduct(ray.getDirection(), ray.getDirection());
        const b = 2 * this.operators.dotProduct(ray.getDirection(), sphereToRay);
        const c = this.operators.dotProduct(sphereToRay, sphereToRay) - (this.getRadius() * this.getRadius()); // The 1 correspond to the radius ^ 2 of the unit sphere we are using
        const discriminant = b * b - 4 * a * c;

        if (discriminant < 0) {
            return [];
        }

        const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

        return [new Intersection(t1, this), new Intersection(t2, this)];
    }

    normalAt(point) {
        return this.operators.subtract(point, this.getOrigin());
    }
}
