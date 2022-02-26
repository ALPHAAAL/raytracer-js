import test from 'ava';
import {
    Color,
    Point,
    PointLight,
    Vector,
} from '../../src/data-structure';
import Factory from '../../src/utils/factory';
import Shading from '../../src/utils/shading';

const m = Factory.createMaterial();
const position = new Point(0, 0, 0);

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
