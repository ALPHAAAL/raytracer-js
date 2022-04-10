import test from 'ava';
import { EPSILON } from '../../src/constants';
import {
    Color,
    Intersection, Point, PointLight, Ray, Vector, World,
} from '../../src/data-structure';
import Factory from '../../src/utils/factory';
import RayOperators from '../../src/utils/ray-operators';

const setupWorld = () => {
    const world = new World();
    const worldLight = new PointLight(new Point(-10, 10, -10), new Color(1, 1, 1));
    const outerSphere = Factory.createSphere();
    const innerSphere = Factory.createSphere();
    const outerSphereMaterial = Factory.createMaterial(new Color(0.8, 1.0, 0.6), 0.1, 0.7, 0.2);
    const innerSphereTransformationMatrix = Factory.createTransformationMatrix().scale(0.5, 0.5, 0.5);

    outerSphere.setMaterial(outerSphereMaterial);
    innerSphere.setTransform(innerSphereTransformationMatrix);

    world.setLight(worldLight);
    world.addObject(outerSphere);
    world.addObject(innerSphere);

    return world;
};

const createGlassSphere = () => {
    const s = Factory.createSphere();

    s.getMaterial().setTransparency(1);
    s.getMaterial().setRefractiveIndex(1.5);

    return s;
};

test('Test a point from a distance', (t) => {
    const r = new Ray(new Point(2, 3, 4), new Vector(1, 0, 0));
    const expectedResult1 = new Point(2, 3, 4);
    const expectedResult2 = new Point(3, 3, 4);
    const expectedResult3 = new Point(1, 3, 4);
    const expectedResult4 = new Point(4.5, 3, 4);
    const result1 = RayOperators.position(r, 0);
    const result2 = RayOperators.position(r, 1);
    const result3 = RayOperators.position(r, -1);
    const result4 = RayOperators.position(r, 2.5);

    t.is(result1.equal(expectedResult1), true);
    t.is(result2.equal(expectedResult2), true);
    t.is(result3.equal(expectedResult3), true);
    t.is(result4.equal(expectedResult4), true);
});

test('Test ray intersects sphere at 2 points', (t) => {
    const r = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
    const s = Factory.createSphere();
    const expectedResult = [new Intersection(4, s), new Intersection(6, s)];
    const result = RayOperators.intersect(s, r);

    t.deepEqual(expectedResult.length, result.length);
    t.is(result[0].equal(expectedResult[0]), true);
    t.is(result[1].equal(expectedResult[1]), true);
});

test('Test ray intersects sphere at a tangent', (t) => {
    const r = new Ray(new Point(0, 1, -5), new Vector(0, 0, 1));
    const s = Factory.createSphere();
    const expectedResult = [new Intersection(5, s), new Intersection(5, s)];
    const result = RayOperators.intersect(s, r);

    t.deepEqual(expectedResult.length, result.length);
    t.is(result[0].equal(expectedResult[0]), true);
    t.is(result[1].equal(expectedResult[1]), true);
});

test('Test ray intersects sphere at 0 point', (t) => {
    const r = new Ray(new Point(0, 2, -5), new Vector(0, 0, 1));
    const s = Factory.createSphere();
    const expectedResult = [];
    const result = RayOperators.intersect(s, r);

    t.deepEqual(expectedResult.length, result.length);
});

test('Test ray intersects sphere at 2 point and ray originates inside a sphere', (t) => {
    const r = new Ray(new Point(0, 0, 0), new Vector(0, 0, 1));
    const s = Factory.createSphere();
    const expectedResult = [new Intersection(-1, s), new Intersection(1, s)];
    const result = RayOperators.intersect(s, r);

    t.deepEqual(expectedResult.length, result.length);
    t.is(result[0].equal(expectedResult[0]), true);
    t.is(result[1].equal(expectedResult[1]), true);
});

test('Test ray intersects sphere at 2 point and ray originates on the right side of a sphere', (t) => {
    const r = new Ray(new Point(0, 0, 5), new Vector(0, 0, 1));
    const s = Factory.createSphere();
    const expectedResult = [new Intersection(-6, s), new Intersection(-4, s)];
    const result = RayOperators.intersect(s, r);

    t.deepEqual(expectedResult.length, result.length);
    t.is(result[0].equal(expectedResult[0]), true);
    t.is(result[1].equal(expectedResult[1]), true);
});

test('Test hit - all intersections are in front of ray origin', (t) => {
    const s = Factory.createSphere();
    const i1 = new Intersection(1, s);
    const i2 = new Intersection(2, s);
    const xs = [i1, i2];
    const expectedResult = i1;
    const result = RayOperators.hit(xs);

    t.is(result.equal(expectedResult), true);
});

test('Test hit - some intersections are behind ray origin', (t) => {
    const s = Factory.createSphere();
    const i1 = new Intersection(-1, s);
    const i2 = new Intersection(1, s);
    const xs = [i1, i2];
    const expectedResult = i2;
    const result = RayOperators.hit(xs);

    t.is(result.equal(expectedResult), true);
});

test('Test hit - all intersections are behind ray origin', (t) => {
    const s = Factory.createSphere();
    const i1 = new Intersection(-2, s);
    const i2 = new Intersection(-1, s);
    const xs = [i1, i2];
    const expectedResult = null;
    const result = RayOperators.hit(xs);

    t.deepEqual(result, expectedResult);
});

test('Test hit - hit is always the lowest nonnegative intersection', (t) => {
    const s = Factory.createSphere();
    const i1 = new Intersection(5, s);
    const i2 = new Intersection(7, s);
    const i3 = new Intersection(-3, s);
    const i4 = new Intersection(2, s);
    const xs = [i1, i2, i3, i4];
    const expectedResult = i4;
    const result = RayOperators.hit(xs);

    t.deepEqual(result, expectedResult);
});

test('Test translate ray', (t) => {
    const r = new Ray(new Point(1, 2, 3), new Vector(0, 1, 0));
    const transformationMatrix = Factory.createTransformationMatrix().translate(3, 4, 5);
    const expectedResult = new Ray(new Point(4, 6, 8), new Vector(0, 1, 0));
    const result = RayOperators.transform(r, transformationMatrix);

    t.is(result.equal(expectedResult), true);
});

test('Test scaling ray', (t) => {
    const r = new Ray(new Point(1, 2, 3), new Vector(0, 1, 0));
    const transformationMatrix = Factory.createTransformationMatrix().scale(2, 3, 4);
    const expectedResult = new Ray(new Point(2, 6, 12), new Vector(0, 3, 0));
    const result = RayOperators.transform(r, transformationMatrix);

    t.is(result.equal(expectedResult), true);
});

test('Intersect a sacled sphere with a ray', (t) => {
    const r = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
    const s = Factory.createSphere();

    s.setTransform(Factory.createTransformationMatrix().scale(2, 2, 2));

    const result = RayOperators.intersect(s, r);

    t.deepEqual(result.length, 2);
    t.deepEqual(result[0].getT(), 3);
    t.deepEqual(result[1].getT(), 7);
});

test('Test reflecing a vector approaching at 45 degree', (t) => {
    const v = new Vector(1, -1, 0);
    const n = new Vector(0, 1, 0);
    const expectedResult = new Vector(1, 1, 0);
    const result = RayOperators.reflect(v, n);

    t.deepEqual(result.equal(expectedResult), true);
});

test('Test reflecing a vector off a slanted surface', (t) => {
    const v = new Vector(0, -1, 0);
    const n = new Vector(Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0);
    const expectedResult = new Vector(1, 0, 0);
    const result = RayOperators.reflect(v, n);

    t.deepEqual(result.equal(expectedResult), true);
});

test('Test intersecting a world with ray', (t) => {
    const world = setupWorld();
    const r = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
    const result = RayOperators.intersectWorld(r, world);

    t.deepEqual(result.length, 4);
    t.deepEqual(result[0].getT(), 4);
    t.deepEqual(result[1].getT(), 4.5);
    t.deepEqual(result[2].getT(), 5.5);
    t.deepEqual(result[3].getT(), 6);
});

test('Test precomputing the state of an intersection', (t) => {
    const r = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
    const shape = Factory.createSphere();
    const i = RayOperators.hit(RayOperators.intersect(shape, r));
    const result = RayOperators.prepareComputations(i, r);

    t.deepEqual(result.t, i.getT());
    t.is(result.object.equal(i.getObject()), true);
    t.is(result.point.equal(new Point(0, 0, -1)), true);
    t.is(result.eyeVector.equal(new Vector(0, 0, -1)), true);
    t.is(result.normalVector.equal(new Vector(0, 0, -1)), true);
});

test('Test precomputing the state of an intersection - when the intersection occurs on the outside', (t) => {
    const r = new Ray(new Point(0, 0, 0), new Vector(0, 0, 1));
    const shape = Factory.createSphere();
    const i = RayOperators.hit(RayOperators.intersect(shape, r));
    const result = RayOperators.prepareComputations(i, r);

    t.deepEqual(result.inside, true);
    t.is(result.point.equal(new Point(0, 0, 1)), true);
    t.is(result.eyeVector.equal(new Vector(0, 0, -1)), true);
    t.is(result.normalVector.equal(new Vector(0, 0, -1)), true);
});

test('Test precomputing the state of an intersection - adding a slight offset to the point to prevent acne', (t) => {
    const r = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
    const shape = Factory.createSphere();

    shape.setTransform(Factory.createTransformationMatrix().translate(0, 0, 1));

    const i = new Intersection(5, shape);
    const comps = RayOperators.prepareComputations(i, r);

    t.is((comps.overPoint.getZ() < -EPSILON / 2) && (comps.point.getZ() > comps.overPoint.getZ()), true);
});

test('Test precomputing the reflection vector', (t) => {
    const shape = Factory.createPlane();
    const r = new Ray(new Point(0, 1, 1), new Vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
    const i = new Intersection(Math.sqrt(2), shape);
    const comps = RayOperators.prepareComputations(i, r);
    const expectedResult = new Vector(0, Math.sqrt(2) / 2, Math.sqrt(2) / 2);

    t.is(comps.reflectVector.equal(expectedResult), true);
});

// P.151 Ch11 in book
test('Test - finding n1 and n2 at various intersections', (t) => {
    const a = createGlassSphere();
    const b = createGlassSphere();
    const c = createGlassSphere();

    a.setTransform(Factory.createTransformationMatrix().scale(2, 2, 2));
    b.setTransform(Factory.createTransformationMatrix().translate(0, 0, -0.25));
    b.getMaterial().setRefractiveIndex(2.0);
    c.setTransform(Factory.createTransformationMatrix().translate(0, 0, 0.25));
    c.getMaterial().setRefractiveIndex(2.5);

    const r = new Ray(new Point(0, 0, -4), new Vector(0, 0, 1));
    const i1 = new Intersection(2, a);
    const i2 = new Intersection(2.75, b);
    const i3 = new Intersection(3.25, c);
    const i4 = new Intersection(4.75, b);
    const i5 = new Intersection(5.25, c);
    const i6 = new Intersection(6, a);
    const xs = [i1, i2, i3, i4, i5, i6];
    const expectedResult = [
        [1.0, 1.5],
        [1.5, 2.0],
        [2.0, 2.5],
        [2.5, 2.5],
        [2.5, 1.5],
        [1.5, 1.0],
    ];
    xs.forEach((i, index) => {
        const { n1, n2 } = RayOperators.prepareComputations(i, r, xs);

        t.is(n1, expectedResult[index][0]);
        t.is(n2, expectedResult[index][1]);
    });
});

test('Test - the under point is offset below the surface', (t) => {
    const r = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
    const shape = createGlassSphere();

    shape.setTransform(Factory.createTransformationMatrix().translate(0, 0, 1));

    const i = new Intersection(5, shape);
    const xs = [i];
    const comps = RayOperators.prepareComputations(i, r, xs);

    t.is(comps.underPoint.getZ() > EPSILON / 2, true);
    t.is(comps.point.getZ() < comps.underPoint.getZ(), true);
});
