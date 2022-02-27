import test from 'ava';
import {
    Color,
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
