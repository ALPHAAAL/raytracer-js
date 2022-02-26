import { Color } from '../data-structure';
import Operators from './operators';
import RayOperators from './ray-operators';

export default class Shading {
    static lighting(material, light, point, eyeVector, normalVector) {
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

        return Operators.add(ambient)(diffuse)(specular)();
    }
}
