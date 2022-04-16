import test from 'ava';
import { EPSILON } from '../../src/constants';
import { Point, Ray, Vector } from '../../src/data-structure';
import Factory from '../../src/utils/factory';
import Operators from '../../src/utils/operators';

const epsilonEqual = (val1, val2) => Math.abs(val1 - val2) < EPSILON;

test('Test - a ray misses a cylinder', (t) => {
    const c = Factory.createCylinder();
    const cases = [
        {
            point: new Point(1, 0, 0),
            direction: new Vector(0, 1, 0),
        },
        {
            point: new Point(0, 0, 0),
            direction: new Vector(0, 1, 0),
        },
        {
            point: new Point(0, 0, -5),
            direction: new Vector(1, 1, 1),
        },
    ];

    cases.forEach((i) => {
        const direction = Operators.normalize(i.direction);
        const r = new Ray(i.point, direction);
        const xs = c.intersect(r);

        t.is(xs.length, 0);
    });
});

test('Test - a ray hits a cylinder', (t) => {
    const c = Factory.createCylinder();
    const cases = [
        {
            point: new Point(1, 0, -5),
            direction: new Vector(0, 0, 1),
            t0: 5,
            t1: 5,
        },
        {
            point: new Point(0, 0, -5),
            direction: new Vector(0, 0, 1),
            t0: 4,
            t1: 6,
        },
        {
            point: new Point(0.5, 0, -5),
            direction: new Vector(0.1, 1, 1),
            t0: 6.80798,
            t1: 7.08872,
        },
    ];

    cases.forEach((i) => {
        const direction = Operators.normalize(i.direction);
        const r = new Ray(i.point, direction);
        const xs = c.intersect(r);

        t.is(xs.length, 2);
        t.is(epsilonEqual(xs[0].t, i.t0), true);
        t.is(epsilonEqual(xs[1].t, i.t1), true);
    });
});

test('Test - normal vector on a cylinder', (t) => {
    const c = Factory.createCylinder();
    const cases = [
        {
            point: new Point(1, 0, 0),
            normal: new Vector(1, 0, 0),
        },
        {
            point: new Point(0, 5, -1),
            normal: new Vector(0, 0, -1),
        },
        {
            point: new Point(0, -2, 1),
            normal: new Vector(0, 0, 1),
        },
        {
            point: new Point(-1, 1, 0),
            normal: new Vector(-1, 0, 0),
        },
    ];

    cases.forEach((i) => {
        const normal = c.normalAt(i.point);

        t.is(normal.equal(i.normal), true);
    });
});

test('Test - Intersecting a truncated cylinder', (t) => {
    const c = Factory.createCylinder(1, 2);
    const cases = [
        // A diagonal ray from inside the cylinder
        {
            point: new Point(0, 1.5, 0),
            direction: new Vector(0.1, 1, 0),
            count: 0,
        },
        // Ray perpendicular to y-axis
        {
            point: new Point(0, 3, -5),
            direction: new Vector(0, 0, 1),
            count: 0,
        },
        {
            point: new Point(0, 0, -5),
            direction: new Vector(0, 0, 1),
            count: 0,
        },
        // Edge cases: Showing the minimum and maximum value are not inclusive
        {
            point: new Point(0, 2, -5),
            direction: new Vector(0, 0, 1),
            count: 0,
        },
        {
            point: new Point(0, 1, -5),
            direction: new Vector(0, 0, 1),
            count: 0,
        },
        // Actually hitting the cylinder
        {
            point: new Point(0, 1.5, -2),
            direction: new Vector(0, 0, 1),
            count: 2,
        },
    ];

    cases.forEach((i) => {
        const direction = Operators.normalize(i.direction);
        const r = new Ray(i.point, direction);
        const xs = c.intersect(r);

        t.is(xs.length, i.count);
    });
});

test('Test - Intersecting a cylinder end caps', (t) => {
    const c = Factory.createCylinder(1, 2, true);
    const cases = [
        // A ray directly hitting both cylinder's caps
        {
            point: new Point(0, 3, 0),
            direction: new Vector(0, -1, 0),
            count: 2,
        },
        // Ray originate above the cylinder and cast a ray diagonally through it
        {
            point: new Point(0, 3, -2),
            direction: new Vector(0, -1, 2),
            count: 2,
        },
        {
            point: new Point(0, 4, -2),
            direction: new Vector(0, -1, 1),
            count: 2,
        },
        // Ray originate below the cylinder and cast a ray diagonally through it
        {
            point: new Point(0, 0, -2),
            direction: new Vector(0, 1, 2),
            count: 2,
        },
        {
            point: new Point(0, -1, -2),
            direction: new Vector(0, 1, 1),
            count: 2,
        },
    ];

    cases.forEach((i) => {
        const direction = Operators.normalize(i.direction);
        const r = new Ray(i.point, direction);
        const xs = c.intersect(r);

        t.is(xs.length, i.count);
    });
});

test('Test - normal vector on a cylinder\'s end caps', (t) => {
    const c = Factory.createCylinder(1, 2, true);
    const cases = [
        {
            point: new Point(0, 1, 0),
            normal: new Vector(0, -1, 0),
        },
        {
            point: new Point(0.5, 1, 0),
            normal: new Vector(0, -1, 0),
        },
        {
            point: new Point(0, 1, 0.5),
            normal: new Vector(0, -1, 0),
        },
        {
            point: new Point(0, 2, 0),
            normal: new Vector(0, 1, 0),
        },
        {
            point: new Point(0.5, 2, 0),
            normal: new Vector(0, 1, 0),
        },
        {
            point: new Point(0, 2, 0.5),
            normal: new Vector(0, 1, 0),
        },
    ];

    cases.forEach((i) => {
        const normal = c.normalAt(i.point);

        t.is(normal.equal(i.normal), true);
    });
});
