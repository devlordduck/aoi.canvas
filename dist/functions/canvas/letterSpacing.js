"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$letterSpacing",
    description: "Specifies the spacing between letters when drawing text.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas to set the letter spacing in.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof __1.CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "spacing",
            description: "The new letter spacing.",
            type: __1.ParamType.Number
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [name, spacing] = ctx.params;
        const canvas = ctx.data.canvasManager?.get(name)?.ctx;
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to set the letter spacing in.");
        canvas.letterSpacing = spacing + "px";
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=letterSpacing.js.map