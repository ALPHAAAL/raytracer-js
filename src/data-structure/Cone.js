import { EPSILON } from '../constants';
import AbstractShape from './AbstractShape';
import Intersection from './Intersection';
// eslint-disable-next-line no-unused-vars
import Point from './Point';
import Vector from './Vector';

const isZero = (val) => Math.abs(val) < EPSILON;

export default class Cone extends AbstractShape {
    constructor(radius, minimum, maximum, closed, hasShadow, factory) {
        super(factory, hasShadow);

        this.radius = radius;
        this.minimum = minimum;
        this.maximum = maximum;
        this.closed = closed;
    }

    /**
     * Check to see if the intersection at `t` is within a radisu of our cylinder
     * @param {Ray} ray
     * @param {number} t
     * @param {number} radius
     * @returns {boolean}
     */
    // eslint-disable-next-line class-methods-use-this
    checkCap(ray, t, radius) {
        const x = ray.getOrigin().getX() + t * ray.getDirection().getX();
        const z = ray.getOrigin().getZ() + t * ray.getDirection().getZ();

        return (x ** 2 + z ** 2) <= Math.abs(radius) ** 2;
    }

    /**
     *
     * @param {Ray} ray
     * @returns {Array<Intersection>}
     */
    // eslint-disable-next-line consistent-return
    intersectCaps(ray) {
        if (this.closed && Math.abs(ray.getDirection().getY()) > EPSILON) {
            const xs = [];

            const t0 = (this.minimum - ray.getOrigin().getY()) / ray.getDirection().getY();

            if (this.checkCap(ray, t0, this.minimum)) {
                xs.push(new Intersection(t0, this));
            }

            const t1 = (this.maximum - ray.getOrigin().getY()) / ray.getDirection().getY();

            if (this.checkCap(ray, t1, this.maximum)) {
                xs.push(new Intersection(t1, this));
            }

            return xs;
        }

        return [];
    }

    /**
     * @param {Ray} ray
     * @returns {Array<Intersection>}
     */
    intersect(ray) {
        const a = ray.getDirection().getX() ** 2
            - ray.getDirection().getY() ** 2
            + ray.getDirection().getZ() ** 2;
        const b = 2 * ray.getOrigin().getX() * ray.getDirection().getX()
            - 2 * ray.getOrigin().getY() * ray.getDirection().getY()
            + 2 * ray.getOrigin().getZ() * ray.getDirection().getZ();
        const c = ray.getOrigin().getX() ** 2
            - ray.getOrigin().getY() ** 2
            + ray.getOrigin().getZ() ** 2;
        const xs = [];

        // Ray is parallel to the y axis
        if (isZero(a) && isZero(b)) {
            return [];
        }

        if (isZero(a) && !isZero(b)) {
            const t = -c / (2 * b);

            xs.push(new Intersection(t, this));
        }

        if (!isZero(a)) {
            const discriminant = b ** 2 - 4 * a * c;

            if (discriminant < 0) {
                return [];
            }

            let t0 = (-b - Math.sqrt(discriminant)) / (2 * a);
            let t1 = (-b + Math.sqrt(discriminant)) / (2 * a);

            if (t0 > t1) {
                const temp = t0;

                t0 = t1;
                t1 = temp;
            }

            const y0 = ray.getOrigin().getY() + t0 * ray.getDirection().getY();

            if (y0 > this.minimum && y0 < this.maximum) {
                xs.push(new Intersection(t0, this));
            }

            const y1 = ray.getOrigin().getY() + t1 * ray.getDirection().getY();

            if (y1 > this.minimum && y1 < this.maximum) {
                xs.push(new Intersection(t1, this));
            }

            return xs.concat(this.intersectCaps(ray));
        }

        return xs.concat(this.intersectCaps(ray));
    }

    /**
     * @param {Point} point
     * @returns {Vector}
     */
    // eslint-disable-next-line class-methods-use-this
    normalAt(point) {
        const distnanceFromYAxis = point.getX() ** 2 + point.getZ() ** 2;

        if (distnanceFromYAxis < 1 && point.getY() >= this.maximum - EPSILON) {
            return new Vector(0, 1, 0);
        }

        if (distnanceFromYAxis < 1 && point.getY() <= this.minimum + EPSILON) {
            return new Vector(0, -1, 0);
        }

        const y = Math.sqrt(distnanceFromYAxis);

        return new Vector(point.getX(), point.getY() > 0 ? -y : y, point.getZ());
    }
}
