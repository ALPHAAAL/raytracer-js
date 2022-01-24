import Tuple from "./Tuple.js";

export default class Vector extends Tuple {
    constructor(x, y, z) {
        super(x, y, z, 0);
    }
}