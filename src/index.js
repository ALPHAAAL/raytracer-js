/* eslint-disable no-console */
import {
    Environment,
    Point,
    Projectile,
    Vector,
    Canvas,
    Color,
    TransformationMatrix,
} from './data-structure';
import MatrixOperators from './utils/matrix-operators';
import { normalize, tick, multiply } from './utils/operators';

// eslint-disable-next-line no-unused-vars
function drawParabola() {
    const e = new Environment(new Vector(0, -0.1, 0), new Vector(-0.01, 0, 0));
    const p = new Projectile(new Point(0, 1, 0), multiply(normalize(new Vector(1, 1.8, 0)), 11.25));
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

        tick(e, p);
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
        const transformationMatrix = new TransformationMatrix(MatrixOperators).rotateZ((Math.PI * i) / 6);
        const hour = MatrixOperators.multiply(transformationMatrix, twelve);

        canvas.writePixel(hour.getX() * RADIUS + WIDTH / 2, hour.getY() * RADIUS + HEIGHT / 2, COLOR);
    }

    await canvas.save('clock', true);
}
