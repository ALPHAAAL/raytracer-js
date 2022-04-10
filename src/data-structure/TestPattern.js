import AbstractPattern from './AbstractPattern';
import Color from './Color';

export default class StripePattern extends AbstractPattern {
    // eslint-disable-next-line class-methods-use-this
    patternAt(point) {
        return new Color(point.getX(), point.getY(), point.getZ());
    }
}
