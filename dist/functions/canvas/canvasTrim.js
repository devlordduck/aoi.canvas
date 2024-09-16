"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$canvasTrim",
    description: "Trims the canvas.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas to trim.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof __1.CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [name] = ctx.params;
        const canvas = ctx.data.canvasManager?.get(name);
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to draw a rectangle on.");
        await canvas.trim();
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=canvasTrim.js.map