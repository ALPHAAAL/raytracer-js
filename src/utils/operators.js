import {
    Point, Vector, Tuple,
} from '../data-structure';
import Color from '../data-structure/Color';

const square = (a) => a * a;

// TODO: refactor to currying and accept arbitrary number of arguments
const add = (a, b) => {
    if (a instanceof Color && b instanceof Color) {
        return new Color(a.red + b.red, a.green + b.green, a.blue + b.blue);
    }
    if (a.w + b.w > 1) {
        throw new Error('Operation not supported');
    } else if (a.w + b.w === 1) {
        return new Point(a.x + b.x, a.y + b.y, a.z + b.z);
    } else {
        return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
    }
};

const subtract = (a, b) => {
    if (a instanceof Color && b instanceof Color) {
        return new Color(a.red - b.red, a.green - b.green, a.blue - b.blue);
    }
    if (a.w - b.w < 0) {
        throw new Error('Operation not supported');
    } else if (a.w - b.w === 1) {
        return new Point(a.x - b.x, a.y - b.y, a.z - b.z);
    } else {
        return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
    }
};

const multiply = (source, multiplier) => {
    if (source instanceof Color) {
        return new Color(source.red * multiplier, source.green * multiplier, source.blue * multiplier);
    }

    return new Tuple(source.x * multiplier, source.y * multiplier, source.z * multiplier, source.w * multiplier);
};

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
const dotProduct = (a, b) => {
    if (a instanceof Vector && b instanceof Vector) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    }

    throw new Error('Operation not supported');
};

// Cross product will return a vector that is perpendicular the original 2 vectors
const crossProduct = (a, b) => {
    if (a instanceof Vector && b instanceof Vector) {
        return new Vector(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x,
        );
    }

    throw new Error('Operation not supported');
};

const hadamardProduct = (c1, c2) => new Color(c1.red * c2.red, c1.green * c2.green, c1.blue * c2.blue);

// TODO: Thinking if it is good idea to directly mutate the projectile vs creating new instance
// Performance wise, 1.602s for mutation vs 1.605s for new instance after running this funciton 144 times
const tick = (env, proj) => {
    const position = add(proj.position, proj.velocity);
    const velocity = add(add(proj.velocity, env.gravity), env.wind);

    proj.set(position, velocity);
};

export {
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
