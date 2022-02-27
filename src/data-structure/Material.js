export default class Material {
    constructor(color, ambient, diffuse, specular, shininess) {
        this.color = color;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
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
}
