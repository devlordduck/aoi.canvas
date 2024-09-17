import { GlobalFonts, Image } from "@napi-rs/canvas";
import { AoiFunction, CanvasBuilder, CanvasManager, CanvasUtil, FillOrStrokeOrClear, ParamType, RepeatType, textAlign, textBaseline } from '../../';

export default new AoiFunction<"djs">({
    name: "$strokeText",
    description: "Draws a stroked (outlined) text.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas to draw the text on.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "text",
            description: "The text to draw.",
            type: ParamType.String
        },
        {
            name: "style",
            description: "The text style.",
            type: ParamType.String,
            typename: "Color | Gradient | Pattern"
        },
        {
            name: "font",
            description: "The text font.",
            type: ParamType.String,
            check: (font) => CanvasUtil.isValidFont(font),
            checkError: () => "Either you provided a non-existent font or incorrect font syntax.",
            optional: true
        },
        {
            name: "x",
            description: "The X coordinate of the text.",
            type: ParamType.Number
        },
        {
            name: "y",
            description: "The Y coordinate of the text.",
            type: ParamType.Number
        },
        {
            name: "lineWidth",
            description: "The stroke (outline) width.",
            type: ParamType.Number,
            optional: true
        },
        {
            name: "maxWidth",
            description: "The text max width.",
            type: ParamType.Number,
            optional: true
        },
        {
            name: "align",
            description: "The text align.",
            type: ParamType.Enum,
            enum: textAlign,
            optional: true
        },
        {
            name: "baseline",
            description: "The text baseline.",
            type: ParamType.Enum,
            enum: textBaseline,
            optional: true
        },
        {
            name: "multiline",
            description: "Indicates if the text should be drawn in multiple lines if it exceeds the maximum width.",
            type: ParamType.Boolean,
            optional: true
        },
        {
            name: "wrap",
            description: "Wraps the text if true.",
            type: ParamType.Boolean,
            optional: true
        },
        {
            name: "lineOffset",
            description: "The line offset.",
            type: ParamType.Number,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, text, style, font = "15px " + GlobalFonts.families[0].family, x, y, width, maxWidth, align, baseline, multiline, wrap, offset ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name);

        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to draw a circular arc in.");

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

        canvas.strokeText(
            style,
            text,
            x,
            y,
            font,
            width,
            maxWidth,
            align,
            baseline,
            multiline,
            wrap,
            offset
        );

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});