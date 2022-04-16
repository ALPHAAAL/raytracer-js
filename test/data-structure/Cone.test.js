import test from 'ava';
import { EPSILON } from '../../src/constants';
import { Point, Ray, Vector } from '../../src/data-structure';
import Factory from '../../src/utils/factory';
import Operators from '../../src/utils/operators';

const epsilonEqual = (val1, val2) => Math.abs(val1 - val2) < EPSILON;

test('Test - intersecting a cone with a ray', (t) => {
    const c = Factory.createCone();
    const cases = [
        {
            origin: new Point(0, 0, -5),
            direction: new Vector(0, 0, 1),
            t0: 5,
            t1: 5,
        },
        {
            origin: new Point(0, 0, -5),
            direction: new Vector(1, 1, 1),
            t0: 8.66025,
            t1: 8.66025,
        },
        {
            origin: new Point(1, 1, -5),
            direction: new Vector(-0.5, -1, 1),
            t0: 4.55006,
            t1: 49.44994,
        },
    ];

    cases.forEach((i) => {
        const direction = Operators.normalize(i.direction);
        const r = new Ray(i.origin, direction);
        const xs = c.intersect(r);

        t.is(xs.length, 2);
        t.is(epsilonEqual(xs[0].getT(), i.t0), true);
        t.is(epsilonEqual(xs[1].getT(), i.t1), true);
    });
});

test('Test - intersecting a cone with a ray parallel to one of its halves', (t) => {
    const c = Factory.createCone();
    const direction = Operators.normalize(new Vector(0, 1, 1));
    const r = new Ray(new Point(0, 0, -1), direction);
    const xs = c.intersect(r);

    t.is(xs.length, 1);
    t.is(epsilonEqual(xs[0].getT(), 0.35355), true);
});

test('Test - intersecting a cone\'s end caps', (t) => {
    const c = Factory.createCone(-0.5, 0.5, true);
    const cases = [
        {
            origin: new Point(0, 0, -5),
            direction: new Vector(0, 1, 0),
            count: 0,
        },
        {
            origin: new Point(0, 0, -0.25),
            direction: new Vector(0, 1, 1),
            count: 2,
        },
        {
            origin: new Point(0, 0, -0.25),
            direction: new Vector(0, 1, 0),
            count: 4,
        },
    ];

    cases.forEach((i) => {
        const direction = Operators.normalize(i.direction);
        const r = new Ray(i.origin, direction);
        const xs = c.intersect(r);

        t.is(xs.length, i.count);
    });
});

test('Test - computing the normal vector on a cone', (t) => {
    const c = Factory.createCone();
    const cases = [
        {
            point: new Point(0, 0, 0),
            normal: new Vector(0, 0, 0),
        },
        {
            point: new Point(1, 1, 1),
            normal: new Vector(1, -Math.sqrt(2), 1),
        },
        {
            point: new Point(-1, -1, 0),
            normal: new Vector(-1, 1, 0),
        },
    ];

    cases.forEach((i) => {
        const normal = c.normalAt(i.point);

        t.is(normal.equal(i.normal), true);
    });
});
