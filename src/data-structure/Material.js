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

    getDiffuse() {
        return this.diffuse;
    }

    getSpecular() {
        return this.specular;
    }

    getShininess() {
        return this.shininess;
    }
}
