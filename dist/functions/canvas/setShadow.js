"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$setShadow",
    description: "Sets the shadow (blur, style, offset) in a canvas.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas to set the shadow in.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof __1.CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "blur",
            description: "The shadow blur.",
            type: __1.ParamType.Number
        },
        {
            name: "style",
            description: "The shadow style.",
            type: __1.ParamType.String,
            typename: "Color"
        },
        {
            name: "offset",
            description: "The shadow offset",
            type: __1.ParamType.Number,
            rest: true,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [name, blur, style, offset] = ctx.params;
        const canvas = ctx.data.canvasManager?.get(name);
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to set the fill style in.");
        await canvas.setShadow(blur, style, offset);
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=setShadow.js.map