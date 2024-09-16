"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$lineTo",
    description: "Adds a straight line to the current path.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof __1.CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "x",
            description: "The X coordinate of the line's end point.",
            type: __1.ParamType.Number
        },
        {
            name: "y",
            description: "The Y coordinate of the line's end point.",
            type: __1.ParamType.Number
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [name, x, y] = ctx.params;
        const canvas = ctx.data.canvasManager?.get(name)?.ctx;
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas.");
        canvas.lineTo(x, y);
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=lineTo.js.map