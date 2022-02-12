import lodash from 'lodash';
import fs from 'fs-extra';
import Color from './Color';

const { inRange, range, chunk } = lodash;

export default class Canvas {
    constructor(w, h) {
        this.width = w;
        this.height = h;
        this.pixels = chunk(range(0, this.width * this.height).map(() => new Color(0, 0, 0)), this.width);
    }

    isInRange(x, y) {
        return inRange(x, 0, this.width) && inRange(y, 0, this.height);
    }

    writePixel(x, y, c) {
        if (!this.isInRange(x, y)) {
            throw new Error(`Invalid coordinate ${x} ${y}`);
        }

        if (!(c instanceof Color)) {
            throw new Error('No color provided');
        }

        this.pixels[y][x] = c;
    }

    pixelAt(x, y) {
        if (!this.isInRange(x, y)) {
            throw new Error('Invalid coordinate');
        }

        return this.pixels[y][x];
    }

    // Save as PPM format
    // Header format:
    // P3 <- magic number
    // 80 40 <- image <width> <height> in pixel
    // 255 <- maximum color value (0 - 255)
    // row of color code
    async save(filename = 'out', isSafeToFile = false) {
        let data = `P3\n${this.width} ${this.height}\n255\n`;
        this.pixels.forEach((row) => {
            data += `${row.map((col) => col.toString()).join(' ')}\n`;
        });

        if (isSafeToFile) {
            await fs.writeFile(`out/${Date.now()}_${filename}.ppm`, data);
        }

        return data;
    }
}
