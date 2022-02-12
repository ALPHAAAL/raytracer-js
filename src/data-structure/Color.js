import Tuple from './Tuple';
import { EPSILON } from '../constants';

const normalizeValue = (val, normalizationVal) => {
    if (val < 0) {
        return 0;
    }

    return (val * normalizationVal > normalizationVal ? normalizationVal : Math.round(val * normalizationVal));
};

export default class Color extends Tuple {
    toString(normalizationVal = 255) {
        const [red, green, blue] = this.values;

        return `${normalizeValue(red, normalizationVal)} ${normalizeValue(green, normalizationVal)} ${normalizeValue(blue, normalizationVal)}`;
    }

    equal(c) {
        const [r1, g1, b1] = this.values;
        const [r2, g2, b2] = c.getValues();
        const epsilonEqual = (val1, val2) => Math.abs(val1 - val2) < EPSILON;

        return epsilonEqual(r1, r2) && epsilonEqual(g1, g2) && epsilonEqual(b1, b2);
    }
}
