/* eslint-disable no-console */
import {
    Environment,
    Point,
    Projectile,
    Vector,
    Canvas,
    Color,
} from './data-structure';
import { normalize, tick, multiply } from './utils/operators';

const e = new Environment(new Vector(0, -0.1, 0), new Vector(-0.01, 0, 0));
const p = new Projectile(new Point(0, 1, 0), multiply(normalize(new Vector(1, 1.8, 0)), 11.25));
const WIDTH = 900;
const HEIGHT = 550;
const canvas = new Canvas(WIDTH, HEIGHT);
let count = 0;
let isSaving = false;

canvas.writePixel(Math.round(p.position.x), Math.round(HEIGHT - p.position.y), new Color(1, 1, 1));

const interval = setInterval(async () => {
    if (isSaving) {
        return;
    }

    tick(e, p);
    count += 1;

    if (p.position.y >= 0) {
        canvas.writePixel(Math.round(p.position.x), Math.round(HEIGHT - p.position.y), new Color(1, 1, 1));
    }

    if (p.position.y <= 0) {
        isSaving = true;
        console.log('count: ', count);
        await canvas.save('graph', true);
        clearInterval(interval);
    }
}, 10);
