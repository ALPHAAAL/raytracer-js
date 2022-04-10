import test from 'ava';
import { EPSILON } from '../../src/constants';
import {
    Color,
    Intersection,
    Point,
    PointLight,
    Ray,
    Vector,
    World,
} from '../../src/data-structure';
import Factory from '../../src/utils/factory';
import RayOperators from '../../src/utils/ray-operators';
import Shading from '../../src/utils/shading';

const m = Factory.createMaterial();
const position = new Point(0, 0, 0);
const epsilonEqual = (val1, val2) => Math.abs(val1 - val2) < EPSILON;
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

test('Lighting with eye between light and surface', (t) => {
    const eyeVector = new Vector(0, 0, -1);
    const normalVector = new Vector(0, 0, -1);
    const light = new PointLight(new Point(0, 0, -10), new Color(1, 1, 1));
    const expectedResult = new Color(1.9, 1.9, 1.9);
    const result = Shading.lighting(m, light, position, eyeVector, normalVector);

    t.is(result.equal(expectedResult), true);
});

test('Lighting with eye between light and surface, eye offset 45 degrees', (t) => {
    const eyeVector = new Vector(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
    const normalVector = new Vector(0, 0, -1);
    const light = new PointLight(new Point(0, 0, -10), new Color(1, 1, 1));
    const expectedResult = new Color(1.0, 1.0, 1.0);
    const result = Shading.lighting(m, light, position, eyeVector, normalVector);

    t.is(result.equal(expectedResult), true);
});

test('Lighting with eye opposite surface, light offset 45 degrees', (t) => {
    const eyeVector = new Vector(0, 0, -1);
    const normalVector = new Vector(0, 0, -1);
    const light = new PointLight(new Point(0, 10, -10), new Color(1, 1, 1));
    const expectedResult = new Color(0.1 + 0.9 * (Math.sqrt(2) / 2), 0.1 + 0.9 * (Math.sqrt(2) / 2), 0.1 + 0.9 * (Math.sqrt(2) / 2));
    const result = Shading.lighting(m, light, position, eyeVector, normalVector);

    t.is(result.equal(expectedResult), true);
});

test('Lighting with eye in the path of the reflection vector', (t) => {
    const eyeVector = new Vector(0, -Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
    const normalVector = new Vector(0, 0, -1);
    const light = new PointLight(new Point(0, 10, -10), new Color(1, 1, 1));
    const expectedResult = new Color(0.1 + 0.9 * (Math.sqrt(2) / 2) + 0.9, 0.1 + 0.9 * (Math.sqrt(2) / 2) + 0.9, 0.1 + 0.9 * (Math.sqrt(2) / 2) + 0.9);
    const result = Shading.lighting(m, light, position, eyeVector, normalVector);

    t.is(result.equal(expectedResult), true);
});

test('Lighting with the light behind the surface', (t) => {
    const eyeVector = new Vector(0, 0, -1);
    const normalVector = new Vector(0, 0, -1);
    const light = new PointLight(new Point(0, 0, 10), new Color(1, 1, 1));
    const expectedResult = new Color(0.1, 0.1, 0.1);
    const result = Shading.lighting(m, light, position, eyeVector, normalVector);

    t.is(result.equal(expectedResult), true);
});

test('Shade an intersection', (t) => {
    const w = setupWorld();
    const r = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
    const shape = w.getObjects()[0];
    const i = RayOperators.hit(RayOperators.intersect(shape, r));
    const comps = RayOperators.prepareComputations(i, r);
    const result = Shading.shadeHit(w, comps);
    const expectedResult = new Color(0.38066, 0.47583, 0.2855);

    t.is(result.equal(expectedResult), true);
});

test('Shade an intersection from the inside', (t) => {
    const w = setupWorld();

    w.setLight(new PointLight(new Point(0, 0.25, 0), new Color(1, 1, 1)));

    const r = new Ray(new Point(0, 0, 0), new Vector(0, 0, 1));
    const shape = w.getObjects()[1];
    const i = RayOperators.hit(RayOperators.intersect(shape, r));
    const comps = RayOperators.prepareComputations(i, r);
    const result = Shading.shadeHit(w, comps);
    const expectedResult = new Color(0.90498, 0.90498, 0.90498);

    t.is(result.equal(expectedResult), true);
});

test('Color when a ray miss', (t) => {
    const w = setupWorld();
    const r = new Ray(new Point(0, 0, -5), new Vector(0, 1, 0));
    const expectedResult = new Color(0, 0, 0);
    const result = Shading.colorAt(w, r);

    t.is(result.equal(expectedResult), true);
});

test('Color when a ray hits', (t) => {
    const w = setupWorld();
    const r = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
    const expectedResult = new Color(0.38066, 0.47583, 0.2855);
    const result = Shading.colorAt(w, r);

    t.is(result.equal(expectedResult), true);
});

// Put the ray between outer and inner sphere, and the ray pointing at inner sphere
test('Color with an intersection behind the ray', (t) => {
    const w = setupWorld();
    const outerSphere = w.getObjects()[0];
    const innerSphere = w.getObjects()[1];
    const r = new Ray(new Point(0, 0, 0.75), new Vector(0, 0, -1));

    outerSphere.getMaterial().setAmbient(1);
    innerSphere.getMaterial().setAmbient(1);

    const expectedResult = innerSphere.getMaterial().getColor();
    const result = Shading.colorAt(w, r);

    t.is(result.equal(expectedResult), true);
});

test('Lighting with eye between light and surface - with shadow', (t) => {
    const eyeVector = new Vector(0, 0, -1);
    const normalVector = new Vector(0, 0, -1);
    const light = new PointLight(new Point(0, 0, -10), new Color(1, 1, 1));
    const expectedResult = new Color(0.1, 0.1, 0.1);
    const result = Shading.lighting(m, light, position, eyeVector, normalVector, true);

    t.is(result.equal(expectedResult), true);
});

test('There is no shadow when nothing is collinear with point and light', (t) => {
    const w = setupWorld();
    const p = new Point(0, 10, 0);

    t.deepEqual(Shading.isShadowed(w, p), false);
});

test('There is shadow when object is between with point and light', (t) => {
    const w = setupWorld();
    const p = new Point(10, -10, 10);

    t.deepEqual(Shading.isShadowed(w, p), true);
});

test('There is no shadow when point is behind light and object', (t) => {
    const w = setupWorld();
    const p = new Point(-20, 20, -20);

    t.deepEqual(Shading.isShadowed(w, p), false);
});

test('There is no shadow when object is behind the point', (t) => {
    const w = setupWorld();
    const p = new Point(-2, 2, -2);

    t.deepEqual(Shading.isShadowed(w, p), false);
});

test('Shade hit is given an intersection in shadow', (t) => {
    const w = setupWorld();
    const s1 = Factory.createSphere();
    const s2 = Factory.createSphere();
    const r = new Ray(new Point(0, 0, 5), new Vector(0, 0, 1));
    const i = new Intersection(4, s2);
    const comp = RayOperators.prepareComputations(i, r);

    s2.setTransform(Factory.createTransformationMatrix().translate(0, 0, 10));
    w.setLight(new PointLight(new Point(0, 0, -10), new Color(1, 1, 1)));
    w.addObject(s1);
    w.addObject(s2);

    const expectedResult = new Color(0.1, 0.1, 0.1);
    const result = Shading.shadeHit(w, comp);

    t.is(result.equal(expectedResult), true);
});

test('Test - lighting with a pattern applied', (t) => {
    const black = new Color(0, 0, 0);
    const white = new Color(1, 1, 1);
    const pattern = Factory.createStripePattern(white, black);
    const material = Factory.createMaterial();
    const eyeV = new Vector(0, 0, -1);
    const normalV = new Vector(0, 0, -1);
    const light = new PointLight(new Point(0, 0, -10), white);

    material.setPattern(pattern);
    material.setAmbient(1);
    material.setDiffuse(0);
    material.setSpecular(0);

    const c1 = Shading.lighting(material, light, new Point(0.9, 0, 0), eyeV, normalV);
    const c2 = Shading.lighting(material, light, new Point(1.1, 0, 0), eyeV, normalV);

    t.is(c1.equal(white), true);
    t.is(c2.equal(black), true);
});

test('Test - the reflected color for a nonreflective material should be black', (t) => {
    const w = setupWorld();
    const r = new Ray(new Point(0, 0, 0), new Vector(0, 0, 1));
    const shape = w.getObjects()[1];

    shape.getMaterial().setAmbient(1);

    const i = new Intersection(1, shape);
    const comps = RayOperators.prepareComputations(i, r);
    const result = Shading.reflectedColor(w, comps);
    const expectedResult = new Color(0, 0, 0);

    t.is(result.equal(expectedResult), true);
});

test('Test - the reflected color for a reflective material', (t) => {
    const w = setupWorld();
    const r = new Ray(new Point(0, 0, -3), new Vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
    const shape = Factory.createPlane();

    shape.getMaterial().setReflective(0.5);
    shape.setTransform(Factory.createTransformationMatrix().translate(0, -1, 0));

    w.addObject(shape);

    const i = new Intersection(Math.sqrt(2), shape);
    const comps = RayOperators.prepareComputations(i, r);
    const result = Shading.reflectedColor(w, comps);
    const expectedResult = new Color(0.19032, 0.2379, 0.14274);

    t.is(result.equal(expectedResult), true);
});

test('Test - Shade hit with a reflective material', (t) => {
    const w = setupWorld();
    const r = new Ray(new Point(0, 0, -3), new Vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
    const shape = Factory.createPlane();

    shape.getMaterial().setReflective(0.5);
    shape.setTransform(Factory.createTransformationMatrix().translate(0, -1, 0));

    w.addObject(shape);

    const i = new Intersection(Math.sqrt(2), shape);
    const comps = RayOperators.prepareComputations(i, r);
    const result = Shading.shadeHit(w, comps);
    const expectedResult = new Color(0.87677, 0.92436, 0.82918);

    t.is(result.equal(expectedResult), true);
});

test('Test - Color at with mutautally reflective surface (eg. mirror)', (t) => {
    try {
        const w = new World();

        w.setLight(new PointLight(new Point(0, 0, 0), new Color(1, 1, 1)));

        const lowerMirror = Factory.createPlane();
        const upperMirror = Factory.createPlane();

        lowerMirror.getMaterial().setReflective(1);
        lowerMirror.setTransform(Factory.createTransformationMatrix().translate(0, -1, 0));
        w.addObject(lowerMirror);

        upperMirror.getMaterial().setReflective(1);
        upperMirror.setTransform(Factory.createTransformationMatrix().translate(0, 1, 0));
        w.addObject(upperMirror);

        const r = new Ray(new Point(0, 0, 0), new Vector(0, 1, 0));

        const result = Shading.colorAt(w, r);
        const expectedResult = new Color(0, 0, 0);

        t.not(result.equal(expectedResult), true);
    } catch (err) {
        t.not(err.message, 'Maximum call stack size exceeded');
    }
});

test('Test - reflected color at the maximum recursive depth', (t) => {
    const w = setupWorld();
    const r = new Ray(new Point(0, 0, -3), new Vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
    const shape = Factory.createPlane();

    shape.getMaterial().setReflective(0.5);
    shape.setTransform(Factory.createTransformationMatrix().translate(0, -1, 0));

    w.addObject(shape);

    const i = new Intersection(Math.sqrt(2), shape);
    const comps = RayOperators.prepareComputations(i, r);
    const result = Shading.reflectedColor(w, comps, 0);
    const expectedResult = new Color(0, 0, 0);

    t.is(result.equal(expectedResult), true);
});

test('Test - the refracted color with an opague surface (i.e. transparency = 0)', (t) => {
    const w = setupWorld();
    const shape = w.getObjects()[0];
    const r = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
    const xs = [new Intersection(4, shape), new Intersection(6, shape)];
    const comps = RayOperators.prepareComputations(xs[0], r, xs);
    const result = Shading.refractedColor(w, comps, 5);
    const expectedResult = new Color(0, 0, 0);

    t.is(result.equal(expectedResult), true);
});

test('Test - the refracted color at  the maximum recursive depth', (t) => {
    const w = setupWorld();
    const shape = w.getObjects()[0];

    shape.getMaterial().setTransparency(1.0);
    shape.getMaterial().setRefractiveIndex(1.5);

    const r = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
    const xs = [new Intersection(4, shape), new Intersection(6, shape)];
    const comps = RayOperators.prepareComputations(xs[0], r, xs);
    const result = Shading.refractedColor(w, comps, 0);
    const expectedResult = new Color(0, 0, 0);

    t.is(result.equal(expectedResult), true);
});

test('Test - the refracted color under total internal refraction', (t) => {
    const w = setupWorld();
    const shape = w.getObjects()[0];

    shape.getMaterial().setTransparency(1.0);
    shape.getMaterial().setRefractiveIndex(1.5);

    const r = new Ray(new Point(0, 0, Math.sqrt(2)), new Vector(0, 1, 0));
    const xs = [new Intersection(-Math.sqrt(2) / 2, shape), new Intersection(Math.sqrt(2) / 2, shape)];
    const comps = RayOperators.prepareComputations(xs[1], r, xs);
    const result = Shading.refractedColor(w, comps, 5);
    const expectedResult = new Color(0, 0, 0);

    t.is(result.equal(expectedResult), true);
});

test('Test - the refracted color with a refracted ray', (t) => {
    const w = setupWorld();
    const objectA = w.getObjects()[0];

    objectA.getMaterial().setAmbient(1.0);
    objectA.getMaterial().setPattern(Factory.createDefaultPattern());

    const objectB = w.getObjects()[1];

    objectB.getMaterial().setTransparency(1.0);
    objectB.getMaterial().setRefractiveIndex(1.5);

    const r = new Ray(new Point(0, 0, 0.1), new Vector(0, 1, 0));
    const xs = [
        new Intersection(-0.9899, objectA),
        new Intersection(-0.4899, objectB),
        new Intersection(0.4899, objectB),
        new Intersection(0.9899, objectA),
    ];
    const comps = RayOperators.prepareComputations(xs[2], r, xs);
    const result = Shading.refractedColor(w, comps, 5);

    t.is(result.equal(new Color(0, 0.99888, 0.04725)), true);
});

test('Test - shadeHit() with a transparent material', (t) => {
    const w = setupWorld();
    const floor = Factory.createPlane();

    floor.setTransform(Factory.createTransformationMatrix().translate(0, -1, 0));
    floor.getMaterial().setTransparency(0.5);
    floor.getMaterial().setRefractiveIndex(1.5);

    w.addObject(floor);

    const ball = Factory.createSphere();

    ball.getMaterial().setColor(new Color(1, 0, 0));
    ball.getMaterial().setAmbient(0.5);
    ball.setTransform(Factory.createTransformationMatrix().translate(0, -3.5, -0.5));

    w.addObject(ball);

    const r = new Ray(new Point(0, 0, -3), new Vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
    const xs = [new Intersection(Math.sqrt(2), floor)];
    const comps = RayOperators.prepareComputations(xs[0], r, xs);
    const result = Shading.shadeHit(w, comps, 5);

    t.is(result.equal(new Color(0.93642, 0.68642, 0.68642)), true);
});

test('Test - the schlick approximation under total internal reflection', (t) => {
    const shape = createGlassSphere();
    const r = new Ray(new Point(0, 0, Math.sqrt(2) / 2), new Vector(0, 1, 0));
    const xs = [new Intersection(-Math.sqrt(2) / 2, shape), new Intersection(Math.sqrt(2) / 2, shape)];
    const comps = RayOperators.prepareComputations(xs[1], r, xs);
    const result = Shading.schlick(comps);

    t.is(result, 1.0);
});

// Looking straight down at a pool scenario
test('Test - the schlick approximation with a perpendicular viewing angle', (t) => {
    const shape = createGlassSphere();
    const r = new Ray(new Point(0, 0, 0), new Vector(0, 1, 0));
    const xs = [new Intersection(-1, shape), new Intersection(1, shape)];
    const comps = RayOperators.prepareComputations(xs[1], r, xs);
    const result = Shading.schlick(comps);

    t.is(epsilonEqual(result, 0.04), true);
});

// Looking far side of a pool
test('Test - the schlick approximation with a small angle and n2 > n1', (t) => {
    const shape = createGlassSphere();
    const r = new Ray(new Point(0, 0.99, -2), new Vector(0, 0, 1));
    const xs = [new Intersection(1.8589, shape)];
    const comps = RayOperators.prepareComputations(xs[0], r, xs);
    const result = Shading.schlick(comps);

    t.is(epsilonEqual(result, 0.48873), true);
});

test('Test - shadeHit() with a transparent and reflective material', (t) => {
    const w = setupWorld();
    const floor = Factory.createPlane();

    floor.setTransform(Factory.createTransformationMatrix().translate(0, -1, 0));
    floor.getMaterial().setReflective(0.5);
    floor.getMaterial().setTransparency(0.5);
    floor.getMaterial().setRefractiveIndex(1.5);

    w.addObject(floor);

    const ball = Factory.createSphere();

    ball.getMaterial().setColor(new Color(1, 0, 0));
    ball.getMaterial().setAmbient(0.5);
    ball.setTransform(Factory.createTransformationMatrix().translate(0, -3.5, -0.5));

    w.addObject(ball);

    const r = new Ray(new Point(0, 0, -3), new Vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
    const xs = [new Intersection(Math.sqrt(2), floor)];
    const comps = RayOperators.prepareComputations(xs[0], r, xs);
    const result = Shading.shadeHit(w, comps, 5);

    t.is(result.equal(new Color(0.93391, 0.69643, 0.69243)), true);
});
