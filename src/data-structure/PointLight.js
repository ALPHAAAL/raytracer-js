export default class PointLight {
    // position - point
    // intensity - vector
    constructor(position, intensity) {
        this.position = position;
        this.intensity = intensity;
    }

    getIntensity() {
        return this.intensity;
    }

    getPosition() {
        return this.position;
    }
}
