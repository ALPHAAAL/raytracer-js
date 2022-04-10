import { nanoid } from 'nanoid';

export default class AbstractShape {
    constructor(factory, hasShadow) {
        this.id = nanoid();
        this.transform = factory.createTransformationMatrix();
        this.material = factory.createMaterial();
        this.hasShadow = hasShadow;
    }

    getId() {
        return this.id;
    }

    getHasShadow() {
        return this.hasShadow;
    }

    setTransform(t) {
        this.transform = t;
    }

    getTransform() {
        return this.transform;
    }

    setMaterial(m) {
        this.material = m;
    }

    getMaterial() {
        return this.material;
    }

    equal(s) {
        return this.id === s.getId();
    }

    // To be overriden
    // eslint-disable-next-line class-methods-use-this
    intersect() {
        throw new Error('This method is supposed to be overriden');
    }

    // To be overriden
    // Should return a Vector
    // eslint-disable-next-line class-methods-use-this
    normalAt() {
        throw new Error('This method is supposed to be overriden');
    }
}
