export default class Ray {
    // Point, Vector
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }

    getOrigin() {
        return this.origin;
    }

    getDirection() {
        return this.direction;
    }

    equal(r) {
        return this.origin.equal(r.getOrigin()) && this.direction.equal(r.getDirection());
    }
}
