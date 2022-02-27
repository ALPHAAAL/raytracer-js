import test from 'ava';
import { EPSILON } from '../../src/constants';
import {
    Color,
    Matrix, Point, PointLight, Ray, Vector, World,
} from '../../src/data-structure';
import Factory from '../../src/utils/factory';
import SceneOperators from '../../src/utils/scene-operators';

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

test('Test the view transformation matrix for the default orientation', (t) => {
    const from = new Point(0, 0, 0);
    const to = new Point(0, 0, -1);
    const up = new Vector(0, 1, 0);
    const expectedResult = Factory.createTransformationMatrix();
    const result = SceneOperators.viewTransform(from, to, up);

    t.is(result.equal(expectedResult), true);
});

test('Test the view transformation matrix looking in positive z direction', (t) => {
    const from = new Point(0, 0, 0);
    const to = new Point(0, 0, 1);
    const up = new Vector(0, 1, 0);
    const expectedResult = Factory.createTransformationMatrix().scale(-1, 1, -1);
    const result = SceneOperators.viewTransform(from, to, up);

    t.is(result.equal(expectedResult), true);
});

test('Test the view transformation matrix moving by 8 units in z axis', (t) => {
    const from = new Point(0, 0, 8);
    const to = new Point(0, 0, 0);
    const up = new Vector(0, 1, 0);
    const expectedResult = Factory.createTransformationMatrix().translate(0, 0, -8);
    const result = SceneOperators.viewTransform(from, to, up);

    t.is(result.equal(expectedResult), true);
});

test('Test arbitrary view transformation', (t) => {
    const from = new Point(1, 3, 2);
    const to = new Point(4, -2, 8);
    const up = new Vector(1, 1, 0);
    const expectedResult = new Matrix(4);

    expectedResult.setRow(0, [-0.50709, 0.50709, 0.67612, -2.36643]);
    expectedResult.setRow(1, [0.76772, 0.60609, 0.12122, -2.82843]);
    expectedResult.setRow(2, [-0.35857, 0.59761, -0.71714, 0.00000]);
    expectedResult.setRow(3, [0.00000, 0.00000, 0.00000, 1.00000]);

    const result = SceneOperators.viewTransform(from, to, up);

    t.is(result.equal(expectedResult), true);
});

test('Test camera pixel size - horizontal canvas', (t) => {
    const camera = Factory.createCamera(200, 125, Math.PI / 2);

    t.is(Math.abs(camera.getPixelSize() - 0.01) < EPSILON, true);
});

test('Test camera pixel size - vertical canvas', (t) => {
    const camera = Factory.createCamera(125, 200, Math.PI / 2);

    t.is(Math.abs(camera.getPixelSize() - 0.01) < EPSILON, true);
});

test('Test constructing a ray through the center of the canvase', (t) => {
    const camera = Factory.createCamera(201, 101, Math.PI / 2);
    const expectedResult = new Ray(new Point(0, 0, 0), new Vector(0, 0, -1));
    const result = SceneOperators.rayForPixel(camera, 100, 50);

    t.is(result.equal(expectedResult), true);
});

test('Test constructing a ray through a corner of the canvase', (t) => {
    const camera = Factory.createCamera(201, 101, Math.PI / 2);
    const expectedResult = new Ray(new Point(0, 0, 0), new Vector(0.66519, 0.33259, -0.66851));
    const result = SceneOperators.rayForPixel(camera, 0, 0);

    t.is(result.equal(expectedResult), true);
});

test('Test constructing a ray through a transformed camera', (t) => {
    const camera = Factory.createCamera(201, 101, Math.PI / 2);

    camera.setTransform(camera.getTransform().translate(0, -2, 5).rotateY(Math.PI / 4));
    const expectedResult = new Ray(new Point(0, 2, -5), new Vector(Math.sqrt(2) / 2, 0, -Math.sqrt(2) / 2));
    const result = SceneOperators.rayForPixel(camera, 100, 50);

    t.is(result.equal(expectedResult), true);
});

test('Test render a world with a camera', (t) => {
    const w = setupWorld();
    const c = Factory.createCamera(11, 11, Math.PI / 2);
    const from = new Point(0, 0, -5);
    const to = new Point(0, 0, 0);
    const up = new Vector(0, 1, 0);

    c.setTransform(SceneOperators.viewTransform(from, to, up));

    const expectedResult = new Color(0.38066, 0.47583, 0.2855);
    const result = SceneOperators.render(c, w).pixelAt(5, 5);

    t.is(result.equal(expectedResult), true);
});
