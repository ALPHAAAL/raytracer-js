import { EPSILON } from '../constants';

export default class Tuple {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    equal(b) {
        const epsilonEqual = (val1, val2) => Math.abs(val1 - val2) < EPSILON;

        return epsilonEqual(this.x, b.x) && epsilonEqual(this.y, b.y) && epsilonEqual(this.z, b.z) && this.w === b.w;
    }
}
