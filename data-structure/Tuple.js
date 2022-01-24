import { epsilonEqual } from "../utils/operators.js";


export default class Tuple {
	constructor(x, y, z, w) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	equal(b) {
		return epsilonEqual(this.x, b.x) && epsilonEqual(this.y, b.y) && epsilonEqual(this.z, b.z) && this.w === b.w;
	}
}
