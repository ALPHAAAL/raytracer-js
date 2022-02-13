/* eslint-disable no-console */
import {
    Environment,
    Point,
    Projectile,
    Vector,
    Canvas,
    Color,
    Ray,
} from './data-structure';
import Factory from './utils/factory';
import MatrixOperators from './utils/matrix-operators';
import Operators from './utils/operators';
import RayOperators from './utils/ray-operators';

// eslint-disable-next-line no-unused-vars
function drawParabola() {
    const e = new Environment(new Vector(0, -0.1, 0), new Vector(-0.01, 0, 0));
    const p = new Projectile(new Point(0, 1, 0), Operators.multiply(Operators.normalize(new Vector(1, 1.8, 0)), 11.25));
    const WIDTH = 900;
    const HEIGHT = 550;
    const canvas = new Canvas(WIDTH, HEIGHT);
    let count = 0;
    let isSaving = false;

    canvas.writePixel(Math.round(p.position.getX()), Math.round(HEIGHT - p.position.getY()), new Color(1, 1, 1));

    const interval = setInterval(async () => {
        if (isSaving) {
            return;
        }

        Operators.tick(e, p);
        count += 1;

        if (p.position.getY() >= 0) {
            canvas.writePixel(Math.round(p.position.getX()), Math.round(HEIGHT - p.position.getY()), new Color(1, 1, 1));
        }

        if (p.position.getY() <= 0) {
            isSaving = true;
            console.log('count: ', count);
            await canvas.save('graph', true);
            clearInterval(interval);
        }
    }, 10);
}

// eslint-disable-next-line no-unused-vars
async function drawClock() {
    const WIDTH = 100;
    const HEIGHT = 100;
    const RADIUS = 30;
    const COLOR = new Color(1, 1, 1);
    const canvas = new Canvas(WIDTH, HEIGHT);
    // The clock lies on Y-axis (meaning Z-axis 穿過 the center of clock)
    // Left-hand rule
    const twelve = new Point(0, 1, 0);

    for (let i = 0; i < 12; i++) {
        const transformationMatrix = Factory.createTransformationMatrix().rotateZ((Math.PI * i) / 6);
        const hour = MatrixOperators.multiply(transformationMatrix, twelve);

        canvas.writePixel(hour.getX() * RADIUS + WIDTH / 2, hour.getY() * RADIUS + HEIGHT / 2, COLOR);
    }

    await canvas.save('clock', true);
}

async function castRayOnSphere() {
    const CANVAS_SIZE = 100;
    const RAY_ORIGIN = new Point(0, 0, -1);
    const WALL_Z = 10;
    const WALL_SIZE = 8;
    const HALF = WALL_SIZE / 2;
    const PIXEL_SIZE = WALL_SIZE / CANVAS_SIZE;

    const canvas = new Canvas(CANVAS_SIZE, CANVAS_SIZE);
    const color = new Color(1, 0, 0);
    const shape = Factory.createSphere();

    // shape.setTransform(Factory.createTransformationMatrix().rotateZ(Math.PI / 4).scale(0.5, 1, 1));
    // shape.setTransform(Factory.createTransformationMatrix().scale(1, 0.5, 1));
    // shape.setTransform(Factory.createTransformationMatrix().scale(1, 0.5, 1));
    // shape.setTransform(Factory.createTransformationMatrix().shear(1, 0, 0, 0, 0, 0).scale(0.5, 1, 1));

    // For each row in canvas
    for (let canvasY = 0; canvasY < CANVAS_SIZE; canvasY++) {
        const worldY = HALF - canvasY * PIXEL_SIZE;
        // For each column in canvas
        for (let canvasX = 0; canvasX < CANVAS_SIZE; canvasX++) {
            const worldX = -HALF + canvasX * PIXEL_SIZE;
            const r = new Ray(RAY_ORIGIN, Operators.normalize(Operators.subtract(new Point(worldX, worldY, WALL_Z), RAY_ORIGIN)));
            const intersections = RayOperators.intersect(shape, r);
            const hit = RayOperators.hit(intersections);

            if (hit) {
                canvas.writePixel(canvasX, canvasY, color);
            }
        }
    }

    canvas.save(`${Date.now()}_castRayOnSphere`, true);
}

castRayOnSphere();
