"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$arcTo",
    description: "Adds a circular arc to the current path.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof __1.CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "x1",
            description: "The X coordinate of the first control point.",
            type: __1.ParamType.Number
        },
        {
            name: "y1",
            description: "The Y coordinate of the first control point.",
            type: __1.ParamType.Number
        },
        {
            name: "x2",
            description: "The X coordinate of the second control point.",
            type: __1.ParamType.Number
        },
        {
            name: "y2",
            description: "The Y coordinate of the second control point.",
            type: __1.ParamType.Number
        },
        {
            name: "radius",
            description: "The arc's radius",
            type: __1.ParamType.Number,
            check: (x) => x >= 0,
            checkError: () => "The radius must be positive."
        },
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [name, x1, y1, x2, y2, radius] = ctx.params;
        const canvas = ctx.data.canvasManager?.get(name);
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to draw a circular arc in.");
        canvas.ctx.arcTo(x1, y1, x2, y2, radius);
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=arcTo.js.map