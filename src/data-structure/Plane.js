import Intersection from './Intersection';
import { EPSILON } from '../constants';
import AbstractShape from './AbstractShape';
import Vector from './Vector';

export default class Plane extends AbstractShape {
    // Assuming this plane is on the xz-plane
    // eslint-disable-next-line class-methods-use-this
    normalAt() {
        return new Vector(0, 1, 0);
    }

    intersect(ray) {
        if (Math.abs(ray.getDirection().getY()) < EPSILON) {
            return [];
        }

        const t = -ray.getOrigin().getY() / ray.getDirection().getY();

        return [new Intersection(t, this)];
    }
}
