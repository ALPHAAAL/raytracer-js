export default class Projectile {
    constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
    }

    set(position, velocity) {
        this.position = position;
        this.velocity = velocity;
    }
}
