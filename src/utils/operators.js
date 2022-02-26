import _ from 'lodash';
import {
    Point, Vector, Tuple, Color,
} from '../data-structure';

const square = (a) => a * a;

// Usage:
// add(a)(b)(c)() <- add an empty () to get the value
const add = (a) => {
    let [x1, y1, z1, w1] = a.getValues();

    const curry = (b) => {
        if (b === undefined) {
            if (w1 === undefined) {
                return new Color(x1, y1, z1);
            }
            if (w1 === 1) {
                return new Point(x1, y1, z1);
            }
            if (w1 === 0) {
                return new Vector(x1, y1, z1);
            }

            throw new Error('Operation not supported');
        } else {
            const [x2, y2, z2, w2] = b.getValues();

            x1 += x2;
            y1 += y2;
            z1 += z2;

            if (w2 !== undefined) {
                w1 += w2;
            }

            return curry;
        }
    };

    return curry;
};

const subtract = (a, b) => {
    const [x1, y1, z1, w1] = a.getValues();
    const [x2, y2, z2, w2] = b.getValues();

    if (a instanceof Color && b instanceof Color) {
        return new Color(x1 - x2, y1 - y2, z1 - z2);
    }

    if (w1 - w2 < 0) {
        throw new Error('Operation not supported');
    } else if (w1 - w2 === 1) {
        return new Point(x1 - x2, y1 - y2, z1 - z2);
    } else {
        return new Vector(x1 - x2, y1 - y2, z1 - z2);
    }
};

const multiply = (source, multiplier) => {
    const [x, y, z, w] = source.getValues();

    if (source instanceof Color) {
        return new Color(x * multiplier, y * multiplier, z * multiplier);
    }

    if (source instanceof Vector) {
        return new Vector(x * multiplier, y * multiplier, z * multiplier);
    }

    if (source instanceof Point) {
        return new Point(x * multiplier, y * multiplier, z * multiplier);
    }

    return new Tuple(x * multiplier, y * multiplier, z * multiplier, w * multiplier);
};

const negate = (a) => multiply(a, -1);

const magnitude = (a) => Math.sqrt(a.getValues().map(square).reduce((acc, cur) => acc + cur), 0);

const normalize = (t) => {
    const m = magnitude(t);
    const [x, y, z, w] = t.getValues();

    if (t instanceof Vector) {
        return new Vector(x / m, y / m, z / m);
    }

    return new Tuple(x / m, y / m, z / m, w / m);
};

// smaller the dot product, the larger the angle between the vectors
// Dot product of 1 means the two vectors are the same
// Dot product of -1 means the two vectors are opposite directions
// If the 2 vectors are unit vectors, the dot product is the cosine of the angle between them
const dotProduct = (a, b) => {
    if (a instanceof Vector && b instanceof Vector) {
        const [x1, y1, z1, w1] = a.getValues();
        const [x2, y2, z2, w2] = b.getValues();

        return x1 * x2 + y1 * y2 + z1 * z2 + w1 * w2;
    }

    if (_.isArray(a) && _.isArray(b) && a.length === b.length) {
        return a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
    }

    throw new Error('Operation not supported');
};

// Cross product will return a vector that is perpendicular the original 2 vectors
const crossProduct = (a, b) => {
    const [x1, y1, z1] = a.getValues();
    const [x2, y2, z2] = b.getValues();

    if (a instanceof Vector && b instanceof Vector) {
        return new Vector(
            y1 * z2 - z1 * y2,
            z1 * x2 - x1 * z2,
            x1 * y2 - y1 * x2,
        );
    }

    throw new Error('Operation not supported');
};

const hadamardProduct = (c1, c2) => {
    const [r1, g1, b1] = c1.getValues();
    const [r2, g2, b2] = c2.getValues();

    return new Color(r1 * r2, g1 * g2, b1 * b2);
};

// TODO: Thinking if it is good idea to directly mutate the projectile vs creating new instance
// Performance wise, 1.602s for mutation vs 1.605s for new instance after running this funciton 144 times
const tick = (env, proj) => {
    const position = add(proj.position)(proj.velocity)();
    const velocity = add(proj.velocity)(env.gravity)(env.wind)();

    proj.set(position, velocity);
};

export default {
    add,
    subtract,
    multiply,
    negate,
    magnitude,
    normalize,
    dotProduct,
    crossProduct,
    hadamardProduct,
    tick,
};
