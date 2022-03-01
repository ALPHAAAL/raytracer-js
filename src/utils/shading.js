import { Color, Ray } from '../data-structure';
import Operators from './operators';
import RayOperators from './ray-operators';

export default class Shading {
    static lighting(material, light, point, eyeVector, normalVector, inShadow = false) {
        const effectiveColor = Operators.hadamardProduct(material.getColor(), light.getIntensity());
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
    static shadeHit(world, comps) {
        const isShadowed = Shading.isShadowed(world, comps.overPoint);

        return Shading.lighting(comps.object.getMaterial(), world.getLight(), comps.point, comps.eyeVector, comps.normalVector, isShadowed);
    }

    static colorAt(world, ray) {
        const intersections = RayOperators.intersectWorld(ray, world);
        const hit = RayOperators.hit(intersections);

        if (hit) {
            const comps = RayOperators.prepareComputations(hit, ray);

            return Shading.shadeHit(world, comps);
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

        if (hit && hit.getT() < distanceBetweenPointAndLight) {
            return true;
        }

        return false;
    }
}
