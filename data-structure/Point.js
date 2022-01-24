import Tuple from "./Tuple.js";

export default class Point extends Tuple {
    constructor(x, y, z) {
        super(x, y, z, 1);
    }
}