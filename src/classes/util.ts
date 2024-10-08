import { Canvas, GlobalFonts, Image, loadImage } from '@napi-rs/canvas';
import { existsSync, readFileSync } from 'node:fs';
import { request } from 'undici';
import { CanvasBuilder, log } from '..';

export const fontRegex = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-,\"\sa-z]+?)\s*$/i
export function isURL (url: string) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    };
};

export class CanvasUtil {
    public static fetchImage = loadImage;
    //public static fetchImage = async (src: string | URL | Buffer | ArrayBufferLike | Uint8Array | Image) => await loadImage(src, { maxRedirects: 30 });
    /*public static fetchImage = (src: string | Image | Buffer | CanvasBuilder | Canvas): Promise<Image> => {
        return new Promise(async (resolve, reject) => {
            const image = new Image(); // worst code ever ngl... why am i such a bad progamer
            let buffer: Buffer;

            if (typeof src === 'string') {
                if (isURL(src)) {
                    const res = await request(src as string, { maxRedirections: 10 })?.catch(e => e);
                    const buf = [];

                    if (![200, 201, 202, 203, 226, 307, 308].find(x => x === res.statusCode))
                        return log(`Unexpected status code ${res.statusCode}`, 'error');

                    for await (const chunk of res.body) {
                        buf.push(chunk);
                    };
                    
                    buffer = Buffer.concat(buf);
                } else if (existsSync(src))
                    buffer = readFileSync(src);
                else return log(`Invalid image source.`);
            }
            else if (src instanceof CanvasBuilder)
                buffer = src.buffer;
            else if (src instanceof Canvas)
                buffer = src.toBuffer('image/png');
            else if (Buffer.isBuffer(src))
                buffer = src;
            else return log(`Invalid image source.`);

            image.src = buffer;
            image.onload = () => resolve(image);
            image.onerror = (e) => reject(e);
        });
    }; */

    public static isValidFont = (font: string) => {
        if (!font)
            return false;
      
        if (fontRegex.test(font)) {
            const res = fontRegex.exec(font);
          
            if (res && res[0]) {
                const families = res[6].split(',').map(x => x?.trim());

                if (families) {
                    for (const family of families) {
                        if (!GlobalFonts.has(family.replace(/['",]/g, '')))
                            return false;
                    };
                };

                return true;
            };
            return false;
        };
        return false;
    };

    public static parseFilters = (filters: string) => {
        const result = [];
      
        const regex = /(\w+)\(([^)]+)\)/g;
        let match;
      
        while ((match = regex.exec(filters)) !== null) {
            const [raw, filter, value] = match;
            result.push({ filter, value, raw });
        }
      
        return result;
    };

    public static rgbaToHex = (r: number, g: number, b: number, a?: number) => 
        "#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0") + (a && a !== undefined ? Math.round(a as number * 255).toString(16).padStart(2, "0") : "");

    public static hexToRgba = (hex: string) => 
        ({ 
            red: parseInt(hex.slice(1, 3), 16),
            green: parseInt(hex.slice(3, 5), 16),
            blue: parseInt(hex.slice(5, 7), 16),
            alpha: hex.length === 9 ? parseInt(hex.slice(7, 9), 16) : undefined
        });
};