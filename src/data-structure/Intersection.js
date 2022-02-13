import { EPSILON } from '../constants';

export default class Intersection {
    constructor(t, object) {
        this.t = t;
        this.object = object;
    }

    getT() {
        return this.t;
    }

    getObject() {
        return this.object;
    }

    equal(i) {
        const epsilonEqual = (val1, val2) => Math.abs(val1 - val2) < EPSILON;

        return epsilonEqual(this.t, i.getT()) && this.object.equal(i.getObject());
    }
}
