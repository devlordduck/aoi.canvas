"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$scale",
    description: "Adds a scaling transformation to the canvas units horizontally and/or vertically.",
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
            description: "Scaling factor in the horizontal direction. A value of 1 results in no horizontal scaling.",
            type: __1.ParamType.Number
        },
        {
            name: "y",
            description: "Scaling factor in the vertical direction. A value of 1 results in no vertical scaling.",
            type: __1.ParamType.Number
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [name, x, y] = ctx.params;
        const canvas = ctx.data.canvasManager?.get(name);
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas.");
        await canvas.ctx.scale(x, y);
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=scale.js.map