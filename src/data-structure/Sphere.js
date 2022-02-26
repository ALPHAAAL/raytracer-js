import { nanoid } from 'nanoid';
import Point from './Point';

export default class Sphere {
    constructor(factory) {
        this.id = nanoid();
        this.origin = new Point(0, 0, 0);
        this.radius = 1;
        this.transform = factory.createTransformationMatrix();
        this.material = factory.createMaterial();
    }

    setTransform(t) {
        this.transform = t;
    }

    setMaterial(m) {
        this.material = m;
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

    getMaterial() {
        return this.material;
    }

    equal(s) {
        return this.id === s.getId();
    }
}
