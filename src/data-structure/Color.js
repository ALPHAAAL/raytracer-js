import { EPSILON } from '../constants';

const normalizeValue = (val, normalizationVal) => {
    if (val < 0) {
        return 0;
    }

    return (val * normalizationVal > normalizationVal ? normalizationVal : Math.round(val * normalizationVal));
};

export default class Color {
    constructor(r, g, b) {
        this.red = r;
        this.green = g;
        this.blue = b;
    }

    toString(normalizationVal = 255) {
        return `${normalizeValue(this.red, normalizationVal)} ${normalizeValue(this.green, normalizationVal)} ${normalizeValue(this.blue, normalizationVal)}`;
    }

    equal(c) {
        const epsilonEqual = (val1, val2) => Math.abs(val1 - val2) < EPSILON;

        return epsilonEqual(this.red, c.red) && epsilonEqual(this.green, c.green) && epsilonEqual(this.blue, c.blue);
    }
}
