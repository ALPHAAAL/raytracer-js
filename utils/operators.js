const EPSILON = 0.00001;

const epsilonEqual = (a, b) => {
    return Math.abs(a - b) < EPSILON;
}

export {
    epsilonEqual,
}