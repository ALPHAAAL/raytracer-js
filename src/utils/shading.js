import { Color, Ray } from '../data-structure';
import Operators from './operators';
import RayOperators from './ray-operators';

export default class Shading {
    static lighting(material, light, point, eyeVector, normalVector, inShadow = false) {
        let color = material.getColor();

        if (material.getPattern()) {
            color = material.getPattern().patternAt(point);
        }

        const effectiveColor = Operators.hadamardProduct(color, light.getIntensity());
        const lightVector = Operators.normalize(Operators.subtract(light.position, point));
        const ambient = Operators.multiply(effectiveColor, material.getAmbient());
        // Cosine of the angle between light vector and normal vector
        const lightDotNormal = Operators.dotProduct(lightVector, normalVector);
        let diffuse = new Color(0, 0, 0);
        let specular = new Color(0, 0, 0);

        // If light is not behind the object surface (normal vector)
        if (lightDotNormal >= 0) {
            diffuse = Operators.multiply(effectiveColor, material.getDiffuse() * lightDotNormal);

            const reflectVector = RayOperators.reflect(Operators.negate(lightVector), normalVector);
            const reflectDotEye = Operators.dotProduct(reflectVector, eyeVector);

            // If light doesn't reflect away from the eye
            if (reflectDotEye > 0) {
                const factor = reflectDotEye ** material.getShininess();

                specular = Operators.multiply(light.getIntensity(), material.getSpecular() * factor);
            }
        }

        return inShadow ? ambient : Operators.add(ambient)(diffuse)(specular)();
    }

    // TODO: think how to do multi light source
    static shadeHit(world, comps, remaining) {
        const isShadowed = Shading.isShadowed(world, comps.overPoint);
        const surfaceColor = Shading.lighting(comps.object.getMaterial(), world.getLight(), comps.point, comps.eyeVector, comps.normalVector, isShadowed);
        const reflectedColor = Shading.reflectedColor(world, comps, remaining);
        const refractedColor = Shading.refractedColor(world, comps, remaining);

        const { material } = comps.object;

        if (material.getReflective() > 0 && material.getTransparency() > 0) {
            const reflectance = Shading.schlick(comps);

            return Operators.add(surfaceColor)(Operators.multiply(reflectedColor, reflectance))(Operators.multiply(refractedColor, (1 - reflectance)))();
        }

        return Operators.add(surfaceColor)(reflectedColor)(refractedColor)();
    }

    static colorAt(world, ray, remaining) {
        const intersections = RayOperators.intersectWorld(ray, world);
        const hit = RayOperators.hit(intersections);

        if (hit) {
            const comps = RayOperators.prepareComputations(hit, ray);

            return Shading.shadeHit(world, comps, remaining);
        }

        // Return black if there are no hits
        return new Color(0, 0, 0);
    }

    static isShadowed(world, point) {
        const v = Operators.subtract(world.getLight().getPosition(), point);
        const distanceBetweenPointAndLight = Operators.magnitude(v);
        const directionFromPointToLight = Operators.normalize(v);
        const ray = new Ray(point, directionFromPointToLight);
        const hit = RayOperators.hit(RayOperators.intersectWorld(ray, world));

        if (hit && hit.getT() < distanceBetweenPointAndLight && hit.getObject().getHasShadow()) {
            return true;
        }

        return false;
    }

    /**
     * Return the reflected color
     * @param {World} world
     * @param {object} comps
     * @param {number} remaining the number of reflection
     * @returns {Color}
     */
    static reflectedColor(world, comps, remaining = 5) {
        if (remaining < 1) {
            return new Color(0, 0, 0);
        }

        const reflectiveness = comps.object.getMaterial().getReflective();
        if (reflectiveness === 0) {
            return new Color(0, 0, 0);
        }

        const reflectedRay = new Ray(comps.overPoint, comps.reflectVector);
        const color = Shading.colorAt(world, reflectedRay, remaining - 1);

        return Operators.multiply(color, reflectiveness);
    }

    /**
     * Return the refracted color
     * @param {World} world
     * @param {object} comps
     * @param {number} remaining the number of refractions
     * @returns {Color}
     */
    static refractedColor(w, comps, remaining) {
        if (remaining < 1) {
            return new Color(0, 0, 0);
        }

        const {
            n1, n2, object, eyeVector, normalVector, underPoint,
        } = comps;

        const transparency = object.getMaterial().getTransparency();

        if (transparency === 0) {
            return new Color(0, 0, 0);
        }

        // Snell's Law
        // sin(i) / sin(t) = n2 / n1
        // i = angle of incoming ray, t = angle of refracted ray
        const nRatio = n1 / n2;
        const cosI = Operators.dotProduct(eyeVector, normalVector);
        const sintSquare = nRatio * nRatio * (1 - cosI * cosI);

        // Total internal refraction
        if (sintSquare > 1) {
            return new Color(0, 0, 0);
        }

        const cosT = Math.sqrt(1.0 - sintSquare);
        // Direction of the refracted ray
        const direction = Operators.subtract(Operators.multiply(normalVector, (nRatio * cosI - cosT)), Operators.multiply(eyeVector, nRatio));
        const refractedRay = new Ray(underPoint, direction);

        return Operators.multiply(Shading.colorAt(w, refractedRay, remaining - 1), object.getMaterial().getTransparency());
    }

    // Fresnel effect, but use Schlick algorithm
    // Fresnel effect means when the angle between the eye and the surface is large, the amount of light reflected will be small, and vice versa
    // Example: Looking straight down a pool vs looking towards a far side of the pool
    /**
     * @param {object} comps
     * @returns {number} The reflectance, a number between 0 and 1 which represetns what fraction of light is reflected
     */
    static schlick(comps) {
        const {
            eyeVector, normalVector, n1, n2,
        } = comps;

        // Find the cosine of the angle between the eye and the normal vector
        let cos = Operators.dotProduct(eyeVector, normalVector);

        // When it is total internal reflection
        if (n1 > n2) {
            const n = n1 / n2;
            const sintSquare = (n ** 2) * (1.0 - cos ** 2);

            if (sintSquare > 1.0) {
                return 1.0;
            }

            // 1 - cos^2 = sin^2
            const cosT = Math.sqrt(1.0 - sintSquare);

            cos = cosT;
        }

        const r0 = ((n1 - n2) / (n1 + n2)) ** 2;

        return r0 + (1 - r0) * ((1 - cos) ** 5);
    }
}
