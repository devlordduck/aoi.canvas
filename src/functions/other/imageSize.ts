import { loadImage } from "@napi-rs/canvas";
import { AoiFunction, Param, ParamType, WidthOrHeight } from '../..';
import { existsSync } from "node:fs";

export default new AoiFunction<"djs">({
    name: "$imageSize",
    description: "Returns an image size.",
    params: [
        {
            name: "src",
            description: "Path or url to the image.",
            check: async (v, c) => 
                c.checkType(c, { type: ParamType.Url } as Param, v)
                || await existsSync(v),
            type: ParamType.String,
            typename: "Path | URL | Image"
        },
        {
            name: "property",
            description: "The image size property to return.",
            type: ParamType.Enum,
            enum: WidthOrHeight,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ image, property ] = ctx.params;

        if (image.toLowerCase().startsWith('images://')) {
            if (!ctx.data.imageManager || !ctx.data.imageManager?.get(image.split('://').slice(1).join('://')))
                return ctx.aoiError.fnError(ctx, 'custom', {}, 'Canvas with provided name doesn\'t exists.');

            image = ctx.data.imageManager.get(image.split('://').slice(1).join('://'));
        };

        const result: Record<string, any> = {
            width: image.width,
            height: image.height
        };
        
        data.result = property 
            ? result[typeof property === "number" ? WidthOrHeight[property] : property]
            : JSON.stringify(result);

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});