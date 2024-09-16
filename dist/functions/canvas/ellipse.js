"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$ellipse",
    description: "Adds an elliptical arc to the current path.",
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
            description: "The X coordinate of the elliptical arc.",
            type: __1.ParamType.Number
        },
        {
            name: "y",
            description: "The Y coordinate of the elliptical arc.",
            type: __1.ParamType.Number
        },
        {
            name: "radiusX",
            description: "The ellipse's major-axis radius.",
            check: (x) => !!(x >= 0),
            checkError: () => "RadiusX must be positive.",
            type: __1.ParamType.Number
        },
        {
            name: "radiusY",
            description: "The ellipse's minor-axis radius.",
            check: (x) => !!(x >= 0),
            checkError: () => "RadiusY must be positive.",
            type: __1.ParamType.Number
        },
        {
            name: "rotation",
            description: "The rotation of the ellipse, expressed in radians.",
            type: __1.ParamType.Number
        },
        {
            name: "startAngle",
            description: "The eccentric angle at which the ellipse starts, measured clockwise from the positive x-axis and expressed in radians.",
            type: __1.ParamType.Number
        },
        {
            name: "endAngle",
            description: "The eccentric angle at which the ellipse ends, measured clockwise from the positive x-axis and expressed in radians.",
            type: __1.ParamType.Number
        },
        {
            name: "counterclockwise",
            description: "If true, draws the ellipse counterclockwise (anticlockwise).",
            type: __1.ParamType.Boolean,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [name, x, y, rX, rY, rotation, sAngle, eAngle, counterclockwise] = ctx.params;
        const canvas = ctx.data.canvasManager?.get(name);
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to add a translation transformation in.");
        canvas.ctx.ellipse(x, y, rX, rY, rotation, sAngle, eAngle, counterclockwise);
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=ellipse.js.map