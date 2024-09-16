import { AoiFunction, GradientManager, GradientType, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$newLinearGradient",
    description: "Creates a new linear gradient.",
    params: [
        {
            name: "gradient",
            description: "Name of the gradient.",
            type: ParamType.String
        },
        {
            name: "x1",
            description: "The X coordinate of the start point.",
            type: ParamType.Number
        },
        {
            name: "y1",
            description: "The Y coordinate of the start point.",
            type: ParamType.Number
        },
        {
            name: "x2",
            description: "The X coordinate of the end point.",
            type: ParamType.Number
        },
        {
            name: "y2",
            description: "The Y coordinate of the end point.",
            type: ParamType.Number
        },
        {
            name: "stops",
            description: "Color stops of the gradient.",
            type: ParamType.String,
            typename: "$addColorStop",
            rest: true,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name, x1, y1, x2, y2 ] = ctx.params;

        if (!ctx.data?.colorStops)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No color stops.");

        if (!ctx.data?.gradientManager)
            ctx.data.gradientManager = new GradientManager;

        if (ctx.data.gradientManager.get(name))
            return ctx.aoiError.fnError(ctx, "custom", {}, `Gradient with name "${name}" already exists.`);

        ctx.data.gradientManager.create(name, GradientType.linear, [x1, y1, x2, y2]);
        ctx.data.colorStops.forEach(x => ctx.data.gradientManager?.get(name)?.addColorStop(...x));
        ctx.data.colorStops = [];

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});