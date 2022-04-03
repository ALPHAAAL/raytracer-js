import { Canvas, Point, Ray } from '../data-structure';
import Factory from './factory';
import MatrixOperators from './matrix-operators';
import Operators from './operators';
import Shading from './shading';

export default class SceneOperators {
    /**
     * P.97
     * @param {Vector} from Where your eye want to be in the scene
     * @param {Point} to Where your eye want to look
     * @param {Vector} up A vector indicating which direction is up
     * @returns
     */
    static viewTransform(from, to, up) {
        const forward = Operators.normalize(Operators.subtract(to, from));
        const left = Operators.crossProduct(forward, Operators.normalize(up));
        const trueUp = Operators.crossProduct(left, forward);
        const orientation = Factory.createTransformationMatrix();

        orientation.setRow(0, [left.getX(), left.getY(), left.getZ(), 0]);
        orientation.setRow(1, [trueUp.getX(), trueUp.getY(), trueUp.getZ(), 0]);
        orientation.setRow(2, [-forward.getX(), -forward.getY(), -forward.getZ(), 0]);
        orientation.setRow(3, [0, 0, 0, 1]);

        return MatrixOperators.multiply(orientation, Factory.createTransformationMatrix().translate(-from.getX(), -from.getY(), -from.getZ()));
    }

    static rayForPixel(camera, x, y) {
        const xOffset = (x + 0.5) * camera.getPixelSize();
        const yOffset = (y + 0.5) * camera.getPixelSize();
        const worldX = camera.getHalfWidth() - xOffset;
        const worldY = camera.getHalfHeight() - yOffset;
        const pixel = MatrixOperators.multiply(MatrixOperators.inverse(camera.getTransform()), new Point(worldX, worldY, -1));
        const origin = MatrixOperators.multiply(MatrixOperators.inverse(camera.getTransform()), new Point(0, 0, 0));
        const direction = Operators.normalize(Operators.subtract(pixel, origin));

        return new Ray(origin, direction);
    }

    static render(camera, world) {
        const image = new Canvas(camera.getHSize(), camera.getVSize());

        for (let y = 0; y < camera.getVSize(); y++) {
            for (let x = 0; x < camera.getHSize(); x++) {
                const ray = SceneOperators.rayForPixel(camera, x, y);
                const color = Shading.colorAt(world, ray);

                image.writePixel(x, y, color);
            }
        }

        return image;
    }
}
