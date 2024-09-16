"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$getPixelColors",
    description: "Returns an array of pixels. (their colors)",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas to get the pixels from.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof __1.CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "x",
            description: "The X coordinate of the top-left corner of the rectangle from which the pixel colors will be extracted.",
            type: __1.ParamType.Number
        },
        {
            name: "y",
            description: "The Y coordinate of the top-left corner of the rectangle from which the pixel colors will be extracted.",
            type: __1.ParamType.Number
        },
        {
            name: "width",
            description: "The width of the rectangle from which the pixel colors will be extracted.",
            type: __1.ParamType.Number
        },
        {
            name: "height",
            description: "The height of the rectangle from which the pixel colors will be extracted.",
            type: __1.ParamType.Number
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [name, x, y, width, height] = ctx.params;
        const canvas = ctx.data.canvasManager?.get(name);
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to get the pixels from.");
        data.result = JSON.stringify(await canvas.getPixelColors(x, y, width, height));
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=getPixelColors.js.map