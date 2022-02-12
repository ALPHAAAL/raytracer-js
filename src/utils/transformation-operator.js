import { Matrix } from '../data-structure';

const translation = (x, y, z) => {
    const m = new Matrix(4, true);

    m.setCol(3, [x, y, z, 1]);

    return m;
};

const scalaing = (x, y, z) => {
    const m = new Matrix(4, true);

    m.setElement(0, 0, x);
    m.setElement(1, 1, y);
    m.setElement(2, 2, z);

    return m;
};

const reflect = (axis) => {
    switch (axis) {
    case 'x':
        return scalaing(-1, 1, 1);
    case 'y':
        return scalaing(1, -1, 1);
    case 'z':
        return scalaing(1, 1, -1);
    default:
        return scalaing(1, 1, 1);
    }
};

const rotateX = (radians) => {
    const m = new Matrix(4, true);

    m.setElement(1, 1, Math.cos(radians));
    m.setElement(1, 2, -Math.sin(radians));
    m.setElement(2, 1, Math.sin(radians));
    m.setElement(2, 2, Math.cos(radians));

    return m;
};

const rotateY = (radians) => {
    const m = new Matrix(4, true);

    m.setElement(0, 0, Math.cos(radians));
    m.setElement(0, 2, Math.sin(radians));
    m.setElement(2, 0, -Math.sin(radians));
    m.setElement(2, 2, Math.cos(radians));

    return m;
};

const rotateZ = (radians) => {
    const m = new Matrix(4, true);

    m.setElement(0, 0, Math.cos(radians));
    m.setElement(0, 1, -Math.sin(radians));
    m.setElement(1, 0, Math.sin(radians));
    m.setElement(1, 1, Math.cos(radians));

    return m;
};

export default {
    translation,
    scalaing,
    reflect,
    rotateX,
    rotateY,
    rotateZ,
};
