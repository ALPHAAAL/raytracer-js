import test from 'ava';
import { Point, Ray, Vector } from '../../src/data-structure';
import Factory from '../../src/utils/factory';

test('Test the normal of a plane is constant everywhere', (t) => {
    const p = Factory.createPlane();
    const n1 = p.normalAt(new Point(0, 0, 0));
    const n2 = p.normalAt(new Point(10, 0, -10));
    const n3 = p.normalAt(new Point(-5, 0, 150));
    const expectedResult = new Vector(0, 1, 0);

    t.is(n1.equal(expectedResult), true);
    t.is(n2.equal(expectedResult), true);
    t.is(n3.equal(expectedResult), true);
});

test('Test intersect with a ray parallel to the plane', (t) => {
    const p = Factory.createPlane();
    const r = new Ray(new Point(0, 10, 0), new Vector(0, 0, 1));
    const result = p.intersect(r);

    t.is(result.length === 0, true);
});

test('Test a ray intersecting a plane from above', (t) => {
    const p = Factory.createPlane();
    const r = new Ray(new Point(0, 1, 0), new Vector(0, -1, 0));
    const results = p.intersect(r);

    t.is(results.length === 1, true);
    t.is(results[0].getT(), 1);
    t.is(results[0].getObject().equal(p), true);
});

test('Test a ray intersecting a plane from below', (t) => {
    const p = Factory.createPlane();
    const r = new Ray(new Point(0, -1, 0), new Vector(0, 1, 0));
    const results = p.intersect(r);

    t.is(results.length === 1, true);
    t.is(results[0].getT(), 1);
    t.is(results[0].getObject().equal(p), true);
});
