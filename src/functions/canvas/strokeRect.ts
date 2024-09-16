import { CanvasManager, AoiFunction, ParamType, CanvasBuilder, FillOrStrokeOrClear } from '../../';
import { Image, ImageData } from '@napi-rs/canvas';
import { CanvasUtil, RepeatType } from '../../';

export default new AoiFunction<"djs">({
    name: "$strokeRect",
    description: "Draws a stroked (outlined) rectangle.",
    params: [
        {
            name: "canvas",
            description: "The canvas name to draw rect on.",
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found.",
            type: ParamType.String
        },
        {
            name: "style",
            description: "The rect style.",
            type: ParamType.String,
            typename: "Color | Gradient | Pattern"
        },
        {
            name: "x",
            description: "The rect start X coordinate.",
            type: ParamType.Number
        },
        {
            name: "y",
            description: "The rect start Y coordinate.",
            type: ParamType.Number
        },
        {
            name: "width",
            description: "The rect width.",
            type: ParamType.Number
        },
        {
            name: "height",
            description: "The rect height.",
            type: ParamType.Number
        },
        {
            name: "strokeWidth",
            description: "The stroke (outline) width.",
            type: ParamType.Number,
            optional: true
        },
        {
            name: "radius",
            description: "The rect corners radius.",
            type: ParamType.Number,
            check: (x) => !!(x >= 0),
            checkError: () => "Radius must be positive.",
            rest: true,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, style, x, y, width, height, strokeWidth = 1, radius ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name);

        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to draw a stroked rectangle in.");

        if (style.startsWith("pattern://")) {
            const splits: string[] = style.split("://").slice(1).join('://').split(':'),
                  type = splits.shift()?.toLowerCase(),
                  repeat = splits.length > 0 && ["repeat", "repeat-x", "repeat-y", "no-repeat"].includes(splits[splits.length - 1]) ? splits.pop() : null;
            let image: Image | ImageData;
        
            if (type === "canvas") {
                const canvas_2 = ctx.data.canvasManager?.get(repeat ? splits.slice(0, -1).join(":") : splits.join())?.ctx;
        
                if (!canvas_2)
                    return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas with provided name found. (pattern)");
        
                image = canvas_2.getImageData(0, 0, canvas_2.canvas.width, canvas_2.canvas.height);
            } else if (type === "images") {
                const img = ctx.data.imageManager?.get(repeat ? splits.slice(0, -1).join(":") : splits.join());
        
                if (!img)
                    return ctx.aoiError.fnError(ctx, "custom", {}, "No image with provided name found. (pattern)");
        
                image = img;
            } else if (type === "image") 
                image = await CanvasUtil.fetchImage(repeat ? splits.join(':') : splits.join());
            else return ctx.aoiError.fnError(ctx, "custom", {}, "Invalid pattern type.");

            style = canvas.ctx.createPattern(image, repeat as RepeatType);
        } else if (style.startsWith("gradient://"))
            style = ctx.data.gradientManager?.get(style.split("://").slice(1).join("://")) ?? style;

        await canvas.rect(
            FillOrStrokeOrClear.stroke,
            style,
            x,
            y,
            width,
            height,
            strokeWidth,
            radius && radius.length === 1 ? radius[0] : radius
        );

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});