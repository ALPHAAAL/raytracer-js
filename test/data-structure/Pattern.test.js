import test from 'ava';
import { Color, Point } from '../../src/data-structure';
import Factory from '../../src/utils/factory';

const black = new Color(0, 0, 0);
const white = new Color(1, 1, 1);

test('Test - a stripe pattern is constant in y', (t) => {
    const pattern = Factory.createStripePattern(white, black);

    t.is(pattern.patternAt(new Point(0, 0, 0)).equal(white), true);
    t.is(pattern.patternAt(new Point(0, 1, 0)).equal(white), true);
    t.is(pattern.patternAt(new Point(0, 2, 0)).equal(white), true);
});

test('Test - a stripe pattern is constant in z', (t) => {
    const pattern = Factory.createStripePattern(white, black);

    t.is(pattern.patternAt(new Point(0, 0, 0)).equal(white), true);
    t.is(pattern.patternAt(new Point(0, 0, 1)).equal(white), true);
    t.is(pattern.patternAt(new Point(0, 0, 2)).equal(white), true);
});

test('Test - a stripe pattern is constant in x', (t) => {
    const pattern = Factory.createStripePattern(white, black);

    t.is(pattern.patternAt(new Point(0, 0, 0)).equal(white), true);
    t.is(pattern.patternAt(new Point(0.9, 0, 0)).equal(white), true);
    t.is(pattern.patternAt(new Point(1, 0, 0)).equal(black), true);
    t.is(pattern.patternAt(new Point(-0.1, 0, 0)).equal(black), true);
    t.is(pattern.patternAt(new Point(-1, 0, 0)).equal(black), true);
    t.is(pattern.patternAt(new Point(-1.1, 0, 0)).equal(white), true);
});

test('Test - stripes with an object transformation', (t) => {
    const sphere = Factory.createSphere();
    const pattern = Factory.createStripePattern(white, black);

    sphere.setTransform(Factory.createTransformationMatrix().scale(2, 2, 2));

    const result = pattern.patternAtShape(sphere, new Point(1.5, 0, 0));

    t.is(result.equal(white), true);
});

test('Test - stripes with a pattern transformation', (t) => {
    const sphere = Factory.createSphere();
    const pattern = Factory.createStripePattern(white, black);

    pattern.setTransform(Factory.createTransformationMatrix().scale(2, 2, 2));

    const result = pattern.patternAtShape(sphere, new Point(1.5, 0, 0));

    t.is(result.equal(white), true);
});

test('Test - stripes with both object and pattern transformation', (t) => {
    const sphere = Factory.createSphere();
    const pattern = Factory.createStripePattern(white, black);

    sphere.setTransform(Factory.createTransformationMatrix().scale(2, 2, 2));
    pattern.setTransform(Factory.createTransformationMatrix().translate(0.5, 0, 0));

    const result = pattern.patternAtShape(sphere, new Point(2.5, 0, 0));

    t.is(result.equal(white), true);
});

test('Test - a gradient pattern linearly interpolates between color', (t) => {
    const pattern = Factory.createGradientPattern(white, black);

    t.is(pattern.patternAt(new Point(0, 0, 0)).equal(white), true);
    t.is(pattern.patternAt(new Point(0.25, 0, 0)).equal(new Color(0.75, 0.75, 0.75)), true);
    t.is(pattern.patternAt(new Point(0.5, 0, 0)).equal(new Color(0.5, 0.5, 0.5)), true);
    t.is(pattern.patternAt(new Point(0.75, 0, 0)).equal(new Color(0.25, 0.25, 0.25)), true);
});

test('Test - a ring should extend in both x and z', (t) => {
    const pattern = Factory.createRignPattern(white, black);

    t.is(pattern.patternAt(new Point(0, 0, 0)).equal(white), true);
    t.is(pattern.patternAt(new Point(1, 0, 0)).equal(black), true);
    t.is(pattern.patternAt(new Point(0, 0, 1)).equal(black), true);
    t.is(pattern.patternAt(new Point(0.708, 0, 0.708)).equal(black), true);
});

test('Test - checker should repeat in x', (t) => {
    const pattern = Factory.createCheckerPattern(white, black);

    t.is(pattern.patternAt(new Point(0, 0, 0)).equal(white), true);
    t.is(pattern.patternAt(new Point(0.99, 0, 0)).equal(white), true);
    t.is(pattern.patternAt(new Point(1.01, 0, 0)).equal(black), true);
});

test('Test - checker should repeat in y', (t) => {
    const pattern = Factory.createCheckerPattern(white, black);

    t.is(pattern.patternAt(new Point(0, 0.99, 0)).equal(white), true);
    t.is(pattern.patternAt(new Point(0, 1.01, 0)).equal(black), true);
});

test('Test - checker should repeat in z', (t) => {
    const pattern = Factory.createCheckerPattern(white, black);

    t.is(pattern.patternAt(new Point(0, 0, 0.99)).equal(white), true);
    t.is(pattern.patternAt(new Point(0, 0, 1.01)).equal(black), true);
});
