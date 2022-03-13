/* eslint-disable no-console */
import {
    Environment,
    Point,
    Projectile,
    Vector,
    Canvas,
    Color,
    Ray,
    PointLight,
    World,
} from './data-structure';
import Factory from './utils/factory';
import MatrixOperators from './utils/matrix-operators';
import Operators from './utils/operators';
import RayOperators from './utils/ray-operators';
import SceneOperators from './utils/scene-operators';
import Shading from './utils/shading';

// eslint-disable-next-line no-unused-vars
function drawParabola() {
    const e = new Environment(new Vector(0, -0.1, 0), new Vector(-0.01, 0, 0));
    const p = new Projectile(new Point(0, 1, 0), Operators.multiply(Operators.normalize(new Vector(1, 1.8, 0)), 11.25));
    const WIDTH = 900;
    const HEIGHT = 550;
    const canvas = new Canvas(WIDTH, HEIGHT);
    let count = 0;
    let isSaving = false;

    canvas.writePixel(Math.round(p.position.getX()), Math.round(HEIGHT - p.position.getY()), new Color(1, 1, 1));

    const interval = setInterval(async () => {
        if (isSaving) {
            return;
        }

        Operators.tick(e, p);
        count += 1;

        if (p.position.getY() >= 0) {
            canvas.writePixel(Math.round(p.position.getX()), Math.round(HEIGHT - p.position.getY()), new Color(1, 1, 1));
        }

        if (p.position.getY() <= 0) {
            isSaving = true;
            console.log('count: ', count);
            await canvas.save('graph', true);
            clearInterval(interval);
        }
    }, 10);
}

// eslint-disable-next-line no-unused-vars
async function drawClock() {
    const WIDTH = 100;
    const HEIGHT = 100;
    const RADIUS = 30;
    const COLOR = new Color(1, 1, 1);
    const canvas = new Canvas(WIDTH, HEIGHT);
    // The clock lies on Y-axis (meaning Z-axis 穿過 the center of clock)
    // Left-hand rule
    const twelve = new Point(0, 1, 0);

    for (let i = 0; i < 12; i++) {
        const transformationMatrix = Factory.createTransformationMatrix().rotateZ((Math.PI * i) / 6);
        const hour = MatrixOperators.multiply(transformationMatrix, twelve);

        canvas.writePixel(hour.getX() * RADIUS + WIDTH / 2, hour.getY() * RADIUS + HEIGHT / 2, COLOR);
    }

    await canvas.save('clock', true);
}

// eslint-disable-next-line no-unused-vars
async function drawShadedSphere() {
    const CANVAS_SIZE = 1000;
    const RAY_ORIGIN = new Point(0, 0, -5);
    const WALL_Z = 10;
    const WALL_SIZE = 70;
    const HALF = WALL_SIZE / 2;
    const PIXEL_SIZE = WALL_SIZE / CANVAS_SIZE;

    const canvas = new Canvas(CANVAS_SIZE, CANVAS_SIZE);
    const shape = Factory.createSphere();
    const light = new PointLight(new Point(-10, 10, -10), new Color(0.1, 1, 0.2));

    shape.setTransform(Factory.createTransformationMatrix().scale(2, 2, 2));
    shape.getMaterial().setColor(new Color(1, 0.2, 1));

    // For each row in canvas
    for (let canvasY = 0; canvasY < CANVAS_SIZE; canvasY++) {
        const worldY = HALF - canvasY * PIXEL_SIZE;
        // For each column in canvas
        for (let canvasX = 0; canvasX < CANVAS_SIZE; canvasX++) {
            const worldX = -HALF + canvasX * PIXEL_SIZE;
            const r = new Ray(RAY_ORIGIN, Operators.normalize(Operators.subtract(new Point(worldX, worldY, WALL_Z), RAY_ORIGIN)));
            const intersections = RayOperators.intersect(shape, r);
            const hit = RayOperators.hit(intersections);

            if (hit) {
                const point = RayOperators.position(r, hit.getT());
                const normal = MatrixOperators.normalAt(hit.getObject(), point);
                const eye = Operators.negate(r.getDirection());
                const newColor = Shading.lighting(hit.getObject().getMaterial(), light, point, eye, normal);

                canvas.writePixel(canvasX, canvasY, newColor);
            }
        }
    }

    canvas.save(`${Date.now()}_drawShadedSphere`, true);
}

// eslint-disable-next-line no-unused-vars
async function castRayOnSphere() {
    const CANVAS_SIZE = 100;
    const RAY_ORIGIN = new Point(0, 0, -1);
    const WALL_Z = 10;
    const WALL_SIZE = 8;
    const HALF = WALL_SIZE / 2;
    const PIXEL_SIZE = WALL_SIZE / CANVAS_SIZE;

    const canvas = new Canvas(CANVAS_SIZE, CANVAS_SIZE);
    const color = new Color(1, 0, 0);
    const shape = Factory.createSphere();

    // shape.setTransform(Factory.createTransformationMatrix().rotateZ(Math.PI / 4).scale(0.5, 1, 1));
    // shape.setTransform(Factory.createTransformationMatrix().scale(1, 0.5, 1));
    // shape.setTransform(Factory.createTransformationMatrix().scale(1, 0.5, 1));
    // shape.setTransform(Factory.createTransformationMatrix().shear(1, 0, 0, 0, 0, 0).scale(0.5, 1, 1));

    // For each row in canvas
    for (let canvasY = 0; canvasY < CANVAS_SIZE; canvasY++) {
        const worldY = HALF - canvasY * PIXEL_SIZE;
        // For each column in canvas
        for (let canvasX = 0; canvasX < CANVAS_SIZE; canvasX++) {
            const worldX = -HALF + canvasX * PIXEL_SIZE;
            const r = new Ray(RAY_ORIGIN, Operators.normalize(Operators.subtract(new Point(worldX, worldY, WALL_Z), RAY_ORIGIN)));
            const intersections = RayOperators.intersect(shape, r);
            const hit = RayOperators.hit(intersections);

            if (hit) {
                canvas.writePixel(canvasX, canvasY, color);
            }
        }
    }

    canvas.save(`${Date.now()}_castRayOnSphere`, true);
}

// eslint-disable-next-line no-unused-vars
async function drawWorld() {
    const floor = Factory.createSphere();
    // Flatten the sphere so it looks like a surface
    floor.setTransform(Factory.createTransformationMatrix().scale(10, 0.01, 10));
    floor.setMaterial(Factory.createMaterial());
    floor.getMaterial().setColor(new Color(1, 0.9, 0.9));
    floor.getMaterial().setSpecular(0);

    const leftWall = Factory.createSphere();
    leftWall.setTransform(
        Factory.createTransformationMatrix()
            .scale(10, 0.01, 10)
            .rotateX(Math.PI / 2)
            .rotateY(-Math.PI / 4)
            .translate(0, 0, 5),
    );
    leftWall.setMaterial(floor.getMaterial());

    const rightWall = Factory.createSphere();
    rightWall.setTransform(
        Factory.createTransformationMatrix()
            .scale(10, 0.01, 10)
            .rotateX(Math.PI / 2)
            .rotateY(Math.PI / 4)
            .translate(0, 0, 5),
    );
    rightWall.setMaterial(floor.getMaterial());

    const middleSphere = Factory.createSphere();
    middleSphere.setTransform(Factory.createTransformationMatrix().translate(-0.5, 1, 0.5));
    middleSphere.setMaterial(Factory.createMaterial());
    middleSphere.getMaterial().setColor(new Color(0.1, 1, 0.5));
    middleSphere.getMaterial().setDiffuse(0.7);
    middleSphere.getMaterial().setSpecular(0.3);

    const rightSphere = Factory.createSphere();
    rightSphere.setTransform(Factory.createTransformationMatrix().scale(0.5, 0.5, 0.5).translate(1.5, 0.5, -0.5));
    rightSphere.setMaterial(Factory.createMaterial());
    rightSphere.getMaterial().setColor(new Color(0.5, 1, 0.1));
    rightSphere.getMaterial().setDiffuse(0.7);
    rightSphere.getMaterial().setSpecular(0.3);

    const leftSphere = Factory.createSphere();
    leftSphere.setTransform(Factory.createTransformationMatrix().scale(0.333, 0.333, 0.333).translate(-1.5, 0.33, -0.75));
    leftSphere.setMaterial(Factory.createMaterial());
    leftSphere.getMaterial().setColor(new Color(1, 0.8, 0.1));
    leftSphere.getMaterial().setDiffuse(0.7);
    leftSphere.getMaterial().setSpecular(0.3);

    const light = new PointLight(new Point(-10, 10, -10), new Color(1, 1, 1));
    const world = new World();
    const camera = Factory.createCamera(100, 50, Math.PI / 3);
    camera.setTransform(SceneOperators.viewTransform(new Point(0, 1.5, -5), new Point(0, 1, 0), new Vector(0, 1, 0)));

    world.setLight(light);
    world.addObject(floor);
    world.addObject(leftWall);
    world.addObject(rightWall);
    world.addObject(leftSphere);
    world.addObject(middleSphere);
    world.addObject(rightSphere);

    const image = SceneOperators.render(camera, world);

    image.save('drawWorld', true);
}

// eslint-disable-next-line no-unused-vars
async function drawEclipse() {
    const floor = Factory.createSphere();
    floor.setTransform(Factory.createTransformationMatrix().scale(10, 0.01, 10));
    floor.setMaterial(Factory.createMaterial());
    floor.getMaterial().setColor(new Color(1, 0.9, 0.9));
    floor.getMaterial().setSpecular(0);

    const leftWall = Factory.createSphere();
    leftWall.setTransform(
        Factory.createTransformationMatrix()
            .scale(10, 0.01, 10)
            .rotateX(Math.PI / 2)
            .rotateY(-Math.PI / 4)
            .translate(0, 0, 5),
    );
    leftWall.setMaterial(floor.getMaterial());

    const rightWall = Factory.createSphere();
    rightWall.setTransform(
        Factory.createTransformationMatrix()
            .scale(10, 0.01, 10)
            .rotateX(Math.PI / 2)
            .rotateY(Math.PI / 4)
            .translate(0, 0, 5),
    );
    rightWall.setMaterial(floor.getMaterial());

    const bigSphere = Factory.createSphere();
    bigSphere.setTransform(Factory.createTransformationMatrix().translate(-0.5, 1, 0.5));
    bigSphere.setMaterial(Factory.createMaterial());
    bigSphere.getMaterial().setColor(new Color(0.5, 1, 0.1));
    bigSphere.getMaterial().setDiffuse(0.7);
    bigSphere.getMaterial().setSpecular(0.3);

    const smallSphere = Factory.createSphere();
    smallSphere.setTransform(Factory.createTransformationMatrix().scale(0.75, 0.75, 0.75).translate(-0.5, 1, -0.3));
    smallSphere.setMaterial(Factory.createMaterial());
    smallSphere.getMaterial().setColor(new Color(1, 0.8, 0.1));
    smallSphere.getMaterial().setDiffuse(0.7);
    smallSphere.getMaterial().setSpecular(0.3);

    const light = new PointLight(new Point(-10, 10, -10), new Color(1, 1, 1));
    const world = new World();
    const camera = Factory.createCamera(100, 50, Math.PI / 3);
    camera.setTransform(SceneOperators.viewTransform(new Point(0, 1.5, -5), new Point(0, 1, 0), new Vector(0, 1, 0)));

    world.addObject(floor);
    world.addObject(leftWall);
    world.addObject(rightWall);
    world.addObject(bigSphere);
    world.addObject(smallSphere);
    world.setLight(light);

    const image = SceneOperators.render(camera, world);

    await image.save('drawEclipse', true);
}

// eslint-disable-next-line no-unused-vars
async function drawWorldWithOnlyFloor() {
    const floor = Factory.createPlane();

    const middleSphere = Factory.createSphere();
    middleSphere.setTransform(Factory.createTransformationMatrix().translate(-0.5, 1, 0.5));
    middleSphere.setMaterial(Factory.createMaterial());
    middleSphere.getMaterial().setColor(new Color(0.1, 1, 0.5));
    middleSphere.getMaterial().setDiffuse(0.7);
    middleSphere.getMaterial().setSpecular(0.3);

    const rightSphere = Factory.createSphere();
    rightSphere.setTransform(Factory.createTransformationMatrix().scale(0.5, 0.5, 0.5).translate(1.5, 0.5, -0.5));
    rightSphere.setMaterial(Factory.createMaterial());
    rightSphere.getMaterial().setColor(new Color(0.5, 1, 0.1));
    rightSphere.getMaterial().setDiffuse(0.7);
    rightSphere.getMaterial().setSpecular(0.3);

    const leftSphere = Factory.createSphere();
    leftSphere.setTransform(Factory.createTransformationMatrix().scale(0.333, 0.333, 0.333).translate(-1.5, 0.33, -0.75));
    leftSphere.setMaterial(Factory.createMaterial());
    leftSphere.getMaterial().setColor(new Color(1, 0.8, 0.1));
    leftSphere.getMaterial().setDiffuse(0.7);
    leftSphere.getMaterial().setSpecular(0.3);

    const light = new PointLight(new Point(-10, 10, -10), new Color(1, 1, 1));
    const world = new World();
    const camera = Factory.createCamera(100, 50, Math.PI / 3);
    camera.setTransform(SceneOperators.viewTransform(new Point(0, 1.5, -5), new Point(0, 1, 0), new Vector(0, 1, 0)));

    world.setLight(light);
    world.addObject(floor);
    world.addObject(leftSphere);
    world.addObject(middleSphere);
    world.addObject(rightSphere);

    const image = SceneOperators.render(camera, world);

    image.save('drawWorldWithOnlyFloor', true);
}

drawWorldWithOnlyFloor();
