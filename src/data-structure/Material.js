// https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/Basic_theory#rasterization
// Diffuse: A distant directional light, like the sun.
// Specular: A point of light, just like a light bulb in a room or a flash light.
// Ambient: The constant light applied to everything on the scene.
// Emissive: The light emitted directly by the object.
export default class Material {
    constructor(color, ambient, diffuse, specular, shininess, reflextive, transparency, refractiveIndex, pattern) {
        this.color = color;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
        this.reflextive = reflextive;
        this.transparency = transparency;
        this.refractiveIndex = refractiveIndex;
        this.pattern = pattern;
    }

    setColor(c) {
        this.color = c;
    }

    getColor() {
        return this.color;
    }

    getAmbient() {
        return this.ambient;
    }

    setAmbient(a) {
        this.ambient = a;
    }

    getDiffuse() {
        return this.diffuse;
    }

    setDiffuse(d) {
        this.diffuse = d;
    }

    getSpecular() {
        return this.specular;
    }

    setSpecular(s) {
        this.specular = s;
    }

    getShininess() {
        return this.shininess;
    }

    getReflective() {
        return this.reflextive;
    }

    setReflective(r) {
        this.reflextive = r;
    }

    getTransparency() {
        return this.transparency;
    }

    setTransparency(t) {
        this.transparency = t;
    }

    getRefractiveIndex() {
        return this.refractiveIndex;
    }

    setRefractiveIndex(r) {
        this.refractiveIndex = r;
    }

    setPattern(p) {
        this.pattern = p;
    }

    getPattern() {
        return this.pattern;
    }
}
