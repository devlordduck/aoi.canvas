"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$newLinearGradient",
    description: "Creates a new linear gradient.",
    params: [
        {
            name: "gradient",
            description: "Name of the gradient.",
            type: __1.ParamType.String
        },
        {
            name: "x1",
            description: "The X coordinate of the start point.",
            type: __1.ParamType.Number
        },
        {
            name: "y1",
            description: "The Y coordinate of the start point.",
            type: __1.ParamType.Number
        },
        {
            name: "x2",
            description: "The X coordinate of the end point.",
            type: __1.ParamType.Number
        },
        {
            name: "y2",
            description: "The Y coordinate of the end point.",
            type: __1.ParamType.Number
        },
        {
            name: "stops",
            description: "Color stops of the gradient.",
            type: __1.ParamType.String,
            typename: "$addColorStop",
            rest: true,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [name, x1, y1, x2, y2] = ctx.params;
        if (!ctx.data?.colorStops)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No color stops.");
        if (!ctx.data?.gradientManager)
            ctx.data.gradientManager = new __1.GradientManager;
        if (ctx.data.gradientManager.get(name))
            return ctx.aoiError.fnError(ctx, "custom", {}, `Gradient with name "${name}" already exists.`);
        ctx.data.gradientManager.create(name, __1.GradientType.linear, [x1, y1, x2, y2]);
        ctx.data.colorStops.forEach(x => ctx.data.gradientManager?.get(name)?.addColorStop(...x));
        ctx.data.colorStops = [];
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=newLinearGradient.js.map