import { Canvas, Image } from '@napi-rs/canvas';
import { CanvasBuilder } from '..';
export declare const fontRegex: RegExp;
export declare function isURL(url: string): boolean;
export declare class CanvasUtil {
    static fetchImage: (src: string | Image | Buffer | CanvasBuilder | Canvas) => Promise<Image>;
    static isValidFont: (font: string) => boolean;
    static parseFilters: (filters: string) => {
        filter: string;
        value: string;
        raw: string;
    }[];
    static rgbaToHex: (r: number, g: number, b: number, a?: number) => string;
    static hexToRgba: (hex: string) => {
        red: number;
        green: number;
        blue: number;
        alpha: number | undefined;
    };
}
//# sourceMappingURL=util.d.ts.map