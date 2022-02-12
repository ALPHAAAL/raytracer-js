import { EPSILON } from '../constants';

// TODO: Refactor tuple class to be more generic instead x, y, z, w
// Similar to Matrix class
// Set size and set values
export default class Tuple {
    constructor(...args) {
        this.values = args;
        this.size = args.length;
    }

    getSize() {
        return this.size;
    }

    getValues() {
        return this.values;
    }

    get(idx) {
        if (idx >= this.size || idx < 0) {
            throw new Error('Index out of bound');
        }

        return this.values[idx];
    }

    equal(b) {
        if (b.getSize() !== this.getSize()) {
            return false;
        }

        const epsilonEqual = (val1, val2) => Math.abs(val1 - val2) < EPSILON;

        return this.values.every((val, idx) => epsilonEqual(val, b.get(idx)));
    }
}
