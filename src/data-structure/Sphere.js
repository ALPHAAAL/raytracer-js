import { nanoid } from 'nanoid';
import Point from './Point';

export default class Sphere {
    constructor(factory) {
        this.id = nanoid();
        this.origin = new Point(0, 0, 0);
        this.radius = 1;
        this.transform = factory.createTransformationMatrix();
    }

    setTransform(t) {
        this.transform = t;
    }

    getTransform() {
        return this.transform;
    }

    getId() {
        return this.id;
    }

    getOrigin() {
        return this.origin;
    }

    getRadius() {
        return this.radius;
    }

    equal(s) {
        return this.id === s.getId();
    }
}
