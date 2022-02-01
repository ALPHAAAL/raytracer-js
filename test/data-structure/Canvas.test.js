import test from 'ava';
import { Canvas, Color } from '../../src/data-structure';

test('Test initialize canvas', (t) => {
    const canvas = new Canvas(10, 20);
    const emptyColor = new Color(0, 0, 0);

    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
            if (!canvas.pixelAt(x, y).equal(emptyColor)) {
                t.fail();
            }
        }
    }

    t.pass();
});

test('Test write pixel', (t) => {
    const canvas = new Canvas(10, 20);
    const red = new Color(1, 0, 0);
    canvas.writePixel(2, 3, red);

    t.is(canvas.pixelAt(2, 3).equal(red), true);
});

test('Test save canvas - empty', async (t) => {
    const canvas = new Canvas(5, 3);
    const result = await canvas.save();
    const expectedResult = 'P3\n5 3\n255';

    t.is(result.startsWith(expectedResult), true);
});

test('Test save canvas - some values', async (t) => {
    const canvas = new Canvas(5, 3);
    canvas.writePixel(0, 0, new Color(1.5, 0, 0));
    canvas.writePixel(2, 1, new Color(0, 0.5, 0));
    canvas.writePixel(4, 2, new Color(-0.5, 0, 1));

    const result = await canvas.save();
    const expectedResult = 'P3\n5 3\n255\n255 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n0 0 0 0 0 0 0 128 0 0 0 0 0 0 0\n0 0 0 0 0 0 0 0 0 0 0 0 0 0 255\n';

    t.is(result, expectedResult);
});

test('Test save canvas - end with newline character', async (t) => {
    const canvas = new Canvas(5, 3);
    canvas.writePixel(0, 0, new Color(1.5, 0, 0));
    canvas.writePixel(2, 1, new Color(0, 0.5, 0));
    canvas.writePixel(4, 2, new Color(-0.5, 0, 1));

    const result = await canvas.save(true);

    t.is(result.endsWith('\n'), true);
});
