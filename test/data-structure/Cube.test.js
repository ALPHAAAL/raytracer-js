import test from 'ava';
import { Point, Ray, Vector } from '../../src/data-structure';
import Factory from '../../src/utils/factory';

test('Test - a ray intersects a cube', (t) => {
    const c = Factory.createCube();
    const rays = [
        {
            origin: new Point(5, 0.5, 0),
            direction: new Vector(-1, 0, 0),
            t1: 4,
            t2: 6,
        },
        {
            origin: new Point(-5, 0.5, 0),
            direction: new Vector(1, 0, 0),
            t1: 4,
            t2: 6,
        },
        {
            origin: new Point(0.5, 5, 0),
            direction: new Vector(0, -1, 0),
            t1: 4,
            t2: 6,
        },
        {
            origin: new Point(0.5, -5, 0),
            direction: new Vector(0, 1, 0),
            t1: 4,
            t2: 6,
        },
        {
            origin: new Point(0.5, 0, 5),
            direction: new Vector(0, 0, -1),
            t1: 4,
            t2: 6,
        },
        {
            origin: new Point(0.5, 0, -5),
            direction: new Vector(0, 0, 1),
            t1: 4,
            t2: 6,
        },
        {
            origin: new Point(0, 0.5, 0),
            direction: new Vector(0, 0, 1),
            t1: -1,
            t2: 1,
        },
    ];

    rays.forEach((ray) => {
        const r = new Ray(ray.origin, ray.direction);
        const xs = c.intersect(r);

        t.is(xs.length, 2);
        t.is(xs[0].getT(), ray.t1);
        t.is(xs[1].getT(), ray.t2);
    });
});

test('Test - a ray misses a cube', (t) => {
    const c = Factory.createCube();
    const rays = [
        {
            origin: new Point(-2, 0, 0),
            direction: new Vector(0.2673, 0.5345, 0.8018),
        },
        {
            origin: new Point(0, -2, 0),
            direction: new Vector(0.8018, 0.2673, 0.5345),
        },
        {
            origin: new Point(0, 0, -2),
            direction: new Vector(0.5345, 0.8018, 0.2673),
        },
        {
            origin: new Point(2, 0, 2),
            direction: new Vector(0, 0, -1),
        },
        {
            origin: new Point(0, 2, 2),
            direction: new Vector(0, -1, 0),
        },
        {
            origin: new Point(2, 2, 0),
            direction: new Vector(-1, 0, 0),
        },
    ];

    rays.forEach((ray) => {
        const r = new Ray(ray.origin, ray.direction);
        const xs = c.intersect(r);

        t.is(xs.length, 0);
    });
});

test('Test - normal on the surface of the cube', (t) => {
    const c = Factory.createCube();
    const points = [
        {
            point: new Point(1, 0.5, -0.8),
            normal: new Vector(1, 0, 0),
        },
        {
            point: new Point(-1, -0.2, 0.9),
            normal: new Vector(-1, 0, 0),
        },
        {
            point: new Point(-0.4, 1, -0.1),
            normal: new Vector(0, 1, 0),
        },
        {
            point: new Point(0.3, -1, -0.7),
            normal: new Vector(0, -1, 0),
        },
        {
            point: new Point(-0.6, 0.3, 1),
            normal: new Vector(0, 0, 1),
        },
        {
            point: new Point(0.4, 0.4, -1),
            normal: new Vector(0, 0, -1),
        },
        {
            point: new Point(1, 1, 1),
            normal: new Vector(1, 0, 0),
        },
        {
            point: new Point(-1, -1, -1),
            normal: new Vector(-1, 0, 0),
        },
    ];

    points.forEach((point) => {
        const normal = c.normalAt(point.point);

        t.is(normal.equal(point.normal), true);
    });
});
