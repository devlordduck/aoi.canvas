"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$stroke",
    description: "Strokes (outlines) the current path.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof __1.CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "style",
            description: "The stroke style.",
            type: __1.ParamType.String,
            typename: "Color | Gradient"
        },
        {
            name: "width",
            description: "The stroke width.",
            type: __1.ParamType.Number,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [name, style, width = 1] = ctx.params;
        const canvas = ctx.data.canvasManager?.get(name);
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to stroke the current path in.");
        const context = canvas.ctx, oldstyle = context.strokeStyle, oldwidth = context.lineWidth;
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
                image = await __1.CanvasUtil.fetchImage(repeat ? splits.join(':') : splits.join());
            else
                return ctx.aoiError.fnError(ctx, "custom", {}, "Invalid pattern type.");
            style = canvas.ctx.createPattern(image, repeat);
        }
        else if (style.startsWith("gradient://"))
            style = ctx.data.gradientManager?.get(style.split("://").slice(1).join("://")) ?? style;
        context.lineWidth = width;
        context.strokeStyle = style;
        context.stroke();
        context.lineWidth = oldwidth;
        context.strokeStyle = oldstyle;
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=stroke.js.map