"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("@napi-rs/canvas");
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$strokeText",
    description: "Draws a stroked (outlined) text.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas to draw the text on.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof __1.CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "text",
            description: "The text to draw.",
            type: __1.ParamType.String
        },
        {
            name: "style",
            description: "The text style.",
            type: __1.ParamType.String,
            typename: "Color | Gradient | Pattern"
        },
        {
            name: "font",
            description: "The text font.",
            type: __1.ParamType.String,
            check: (font) => __1.CanvasUtil.isValidFont(font),
            checkError: () => "Either you provided a non-existent font or incorrect font syntax.",
            optional: true
        },
        {
            name: "x",
            description: "The X coordinate of the text.",
            type: __1.ParamType.Number
        },
        {
            name: "y",
            description: "The Y coordinate of the text.",
            type: __1.ParamType.Number
        },
        {
            name: "lineWidth",
            description: "The stroke (outline) width.",
            type: __1.ParamType.Number,
            optional: true
        },
        {
            name: "maxWidth",
            description: "The text max width.",
            type: __1.ParamType.Number,
            optional: true
        },
        {
            name: "align",
            description: "The text align.",
            type: __1.ParamType.Enum,
            enum: __1.textAlign,
            optional: true
        },
        {
            name: "baseline",
            description: "The text baseline.",
            type: __1.ParamType.Enum,
            enum: __1.textBaseline,
            optional: true
        },
        {
            name: "multiline",
            description: "Indicates if the text should be drawn in multiple lines if it exceeds the maximum width.",
            type: __1.ParamType.Boolean,
            optional: true
        },
        {
            name: "wrap",
            description: "Wraps the text if true.",
            type: __1.ParamType.Boolean,
            optional: true
        },
        {
            name: "lineOffset",
            description: "The line offset.",
            type: __1.ParamType.Number,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [name, text, style, font = "15px " + canvas_1.GlobalFonts.families[0].family, x, y, width, maxWidth, align, baseline, multiline, wrap, offset] = ctx.params;
        const canvas = ctx.data.canvasManager?.get(name);
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to draw a circular arc in.");
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
        canvas.strokeText(style, text, x, y, font, width, maxWidth, align, baseline, multiline, wrap, offset);
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=strokeText.js.map