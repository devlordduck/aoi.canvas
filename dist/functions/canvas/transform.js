"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$transform",
    description: "Multiplies the current transformation with the matrix described by the arguments of this method.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas to transform.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof __1.CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "a",
            description: "The cell in the first row and first column of the matrix.",
            type: __1.ParamType.Number
        },
        {
            name: "b",
            description: "The cell in the second row and first column of the matrix.",
            type: __1.ParamType.Number
        },
        {
            name: "c",
            description: "The cell in the first row and second column of the matrix.",
            type: __1.ParamType.Number
        },
        {
            name: "d",
            description: "The cell in the second row and second column of the matrix.",
            type: __1.ParamType.Number
        },
        {
            name: "e",
            description: "The cell in the first row and third column of the matrix.",
            type: __1.ParamType.Number
        },
        {
            name: "f",
            description: "The cell in the second row and third column of the matrix.",
            type: __1.ParamType.Number
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [name, a, b, c, d, e, f] = ctx.params;
        const canvas = ctx.data.canvasManager?.get(name);
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to add a translation transformation in.");
        canvas.ctx.transform(a, b, c, d, e, f);
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=transform.js.map