export default class World {
    constructor() {
        this.light = null;
        this.objects = [];
    }

    // PointLight
    setLight(l) {
        this.light = l;
    }

    getLight() {
        return this.light;
    }

    addObject(o) {
        this.objects.push(o);
    }

    getObjects() {
        return this.objects;
    }

    contains(o) {
        return this.objects.includes((object) => object.getId() === o.getId());
    }
}
