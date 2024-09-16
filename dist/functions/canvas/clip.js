"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$clip",
    description: "Turns the current path into the current clipping region.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof __1.CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "rule",
            description: "The fill rule.",
            type: __1.ParamType.Enum,
            enum: __1.fillRule,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [name, rule] = ctx.params;
        const canvas = ctx.data.canvasManager?.get(name);
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to clip.");
        canvas.ctx.clip(__1.fillRule[rule]);
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=clip.js.map