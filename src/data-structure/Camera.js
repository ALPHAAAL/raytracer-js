// Kinda useful resource for camera
// https://jsantell.com/3d-projection/

export default class Camera {
    constructor(hsize, vsize, fieldOfView, factory) {
        this.hsize = hsize;
        this.vsize = vsize;
        this.fieldOfView = fieldOfView;
        this.transform = factory.createTransformationMatrix();

        // Compute pixel size
        // Here we assume the canvas is 1 pixel in front of the camera
        const halfView = Math.tan(fieldOfView / 2);
        const aspect = hsize / vsize;

        if (aspect >= 1) {
            this.halfWidth = halfView;
            this.halfHeight = halfView / aspect;
        } else {
            this.halfWidth = halfView * aspect;
            this.halfHeight = halfView;
        }

        this.pixelSize = (this.halfWidth * 2) / hsize;
    }

    getHSize() {
        return this.hsize;
    }

    getVSize() {
        return this.vsize;
    }

    getFieldOfView() {
        return this.fieldOfView;
    }

    getTransform() {
        return this.transform;
    }

    setTransform(t) {
        this.transform = t;
    }

    getHalfWidth() {
        return this.halfWidth;
    }

    getHalfHeight() {
        return this.halfHeight;
    }

    getPixelSize() {
        return this.pixelSize;
    }
}
