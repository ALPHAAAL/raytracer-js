import Tuple from './Tuple';

export default class Point extends Tuple {
    constructor(x, y, z) {
        super(x, y, z, 1);
    }

    getX() {
        return this.values[0];
    }

    getY() {
        return this.values[1];
    }

    getZ() {
        return this.values[2];
    }
}
