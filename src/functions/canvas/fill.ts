import { AoiFunction, CanvasBuilder, CanvasManager, fillRule, ParamType, CanvasUtil, RepeatType } from '../../';
import { Image } from '@napi-rs/canvas';

export default new AoiFunction<"djs">({
    name: "$fill",
    description: "Fills the current path.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "style",
            description: "The fill style.",
            type: ParamType.String,
            typename: "Color | Gradient | Pattern"
        },
        {
            name: "rule",
            description: "The fill rule.",
            type: ParamType.Enum,
            enum: fillRule,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, style, rule = fillRule.nonzero ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name);
                
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to fill the current path in.");

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

        const oldstyle = canvas.ctx.fillStyle;

        canvas.ctx.fillStyle = style;
        await canvas.ctx.fill(
            (typeof rule === "number" ? fillRule[rule] : rule) as CanvasFillRule
        );
        canvas.ctx.fillStyle = oldstyle;

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});