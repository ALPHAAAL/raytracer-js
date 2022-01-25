import { Point, Vector, Tuple } from '../data-structure';

const square = (a) => a * a;

const add = (a, b) => {
    if (a.w + b.w > 1) {
        throw new Error('Operation not supported');
    } else if (a.w + b.w === 1) {
        return new Point(a.x + b.x, a.y + b.y, a.z + b.z);
    } else {
        return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
    }
};

const subtract = (a, b) => {
    if (a.w - b.w < 0) {
        throw new Error('Operation not supported');
    } else if (a.w - b.w === 1) {
        return new Point(a.x - b.x, a.y - b.y, a.z - b.z);
    } else {
        return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
    }
};

const multiply = (source, multiplier) => new Tuple(source.x * multiplier, source.y * multiplier, source.z * multiplier, source.w * multiplier);

const negate = (a) => new Tuple(-a.x, -a.y, -a.z, a.w ? -a.w : a.w);

const magnitude = (a) => Math.sqrt(square(a.x) + square(a.y) + square(a.z) + square(a.w));

const normalize = (a) => {
    const m = magnitude(a);

    if (a instanceof Vector) {
        return new Vector(a.x / m, a.y / m, a.z / m);
    }

    return new Tuple(a.x / m, a.y / m, a.z / m, a.w / m);
};

// smaller the dot product, the larger the angle between the vectors
// Dot product of 1 means the two vectors are the same
// Dot product of -1 means the two vectors are opposite directions
// If the 2 vectors are unit vectors, the dot product is the cosine of the angle between them
const dotProduct = (a, b) => (a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w);

export {
    add,
    subtract,
    multiply,
    negate,
    magnitude,
    normalize,
    dotProduct,
};
