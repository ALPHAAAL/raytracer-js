import Tuple from './Tuple';

export default class Point extends Tuple {
    constructor(x, y, z) {
        super(x, y, z, 1);
    }
}
