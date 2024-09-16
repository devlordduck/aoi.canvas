"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
const __2 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$strokeRect",
    description: "Draws a stroked (outlined) rectangle.",
    params: [
        {
            name: "canvas",
            description: "The canvas name to draw rect on.",
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof __1.CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found.",
            type: __1.ParamType.String
        },
        {
            name: "style",
            description: "The rect style.",
            type: __1.ParamType.String,
            typename: "Color | Gradient | Pattern"
        },
        {
            name: "x",
            description: "The rect start X coordinate.",
            type: __1.ParamType.Number
        },
        {
            name: "y",
            description: "The rect start Y coordinate.",
            type: __1.ParamType.Number
        },
        {
            name: "width",
            description: "The rect width.",
            type: __1.ParamType.Number
        },
        {
            name: "height",
            description: "The rect height.",
            type: __1.ParamType.Number
        },
        {
            name: "strokeWidth",
            description: "The stroke (outline) width.",
            type: __1.ParamType.Number,
            optional: true
        },
        {
            name: "radius",
            description: "The rect corners radius.",
            type: __1.ParamType.Number,
            check: (x) => !!(x >= 0),
            checkError: () => "Radius must be positive.",
            rest: true,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [name, style, x, y, width, height, strokeWidth = 1, radius] = ctx.params;
        const canvas = ctx.data.canvasManager?.get(name);
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to draw a stroked rectangle in.");
        if (style.startsWith("pattern://")) {
            const splits = style.split("://").slice(1).join('://').split(':'), type = splits.shift()?.toLowerCase(), repeat = splits.length > 0 && ["repeat", "repeat-x", "repeat-y", "no-repeat"].includes(splits[splits.length - 1]) ? splits.pop() : null;
            let image;
            if (type === "canvas") {
                const canvas_2 = ctx.data.canvasManager?.get(repeat ? splits.slice(0, -1).join(":") : splits.join())?.ctx;
                if (!canvas_2)
                    return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas with provided name found. (pattern)");
                image = canvas_2.getImageData(0, 0, canvas_2.canvas.width, canvas_2.canvas.height);
            }
            else if (type === "images") {
                const img = ctx.data.imageManager?.get(repeat ? splits.slice(0, -1).join(":") : splits.join());
                if (!img)
                    return ctx.aoiError.fnError(ctx, "custom", {}, "No image with provided name found. (pattern)");
                image = img;
            }
            else if (type === "image")
                image = await __2.CanvasUtil.fetchImage(repeat ? splits.join(':') : splits.join());
            else
                return ctx.aoiError.fnError(ctx, "custom", {}, "Invalid pattern type.");
            style = canvas.ctx.createPattern(image, repeat);
        }
        else if (style.startsWith("gradient://"))
            style = ctx.data.gradientManager?.get(style.split("://").slice(1).join("://")) ?? style;
        await canvas.rect(__1.FillOrStrokeOrClear.stroke, style, x, y, width, height, strokeWidth, radius && radius.length === 1 ? radius[0] : radius);
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=strokeRect.js.map