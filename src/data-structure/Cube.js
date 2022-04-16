import { EPSILON } from '../constants';
import AbstractShape from './AbstractShape';
import Intersection from './Intersection';
import Vector from './Vector';

export default class Cube extends AbstractShape {
    /**
     * @param {Point} point
     * @returns {Vector}
     */
    // eslint-disable-next-line class-methods-use-this
    normalAt(point) {
        const x = Math.abs(point.getX());
        const y = Math.abs(point.getY());
        const z = Math.abs(point.getZ());
        const maxComponent = Math.max(x, y, z);

        if (maxComponent === x) {
            return new Vector(point.getX(), 0, 0);
        }

        if (maxComponent === y) {
            return new Vector(0, point.getY(), 0);
        }

        return new Vector(0, 0, point.getZ());
    }

    /**
     * @param {number} origin
     * @param {number} direction
     * @returns {number[]}
     */
    // eslint-disable-next-line class-methods-use-this
    checkAxis(origin, direction) {
        const tminNumerator = -1 - origin;
        const tMaxNumerator = 1 - origin;
        let tmin;
        let tmax;

        if (Math.abs(direction) >= EPSILON) {
            // Pre-computing this to avoid redundant divsion
            // Since division is slower than multiplication
            const directionInverse = 1 / direction;

            tmin = tminNumerator * directionInverse;
            tmax = tMaxNumerator * directionInverse;
        } else {
            tmin = tminNumerator * Infinity;
            tmax = tMaxNumerator * Infinity;
        }

        if (tmin > tmax) {
            return [tmax, tmin];
        }

        return [tmin, tmax];
    }

    /**
     * @param {Vector} ray
     * @returns {Intersection[]}
     */
    intersect(ray) {
        const [xtMin, xtMax] = this.checkAxis(ray.getOrigin().getX(), ray.getDirection().getX());
        const [ytMin, ytMax] = this.checkAxis(ray.getOrigin().getY(), ray.getDirection().getY());
        const [ztMin, ztMax] = this.checkAxis(ray.getOrigin().getZ(), ray.getDirection().getZ());

        const tmin = Math.max(xtMin, ytMin, ztMin);
        const tmax = Math.min(xtMax, ytMax, ztMax);

        if (tmin > tmax) {
            return [];
        }

        return [new Intersection(tmin, this), new Intersection(tmax, this)];
    }
}
