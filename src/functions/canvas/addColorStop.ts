import { AoiFunction, GradientManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$addColorStop",
    description: "Adds a color stop to the gradient.",
    params: [
        {
            name: "gradient",
            description: "Name of the gradient.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.gradientManager && c.data.gradientManager instanceof GradientManager && c.data.gradientManager.get(v)),
            checkError: () => "No canvas with provided name found.",
            optional: true,
        },
        {
            name: "offset",
            description: "The color stop offset.",
            check: (v) => v / 100 >= 0 && v / 100 <= 1,
            type: ParamType.Number
        },
        {
            name: "color",
            description: "Color of the stop.",
            type: ParamType.Color
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name, offset, color ] = ctx.params;

        const gradient = name ? ctx.data.gradientManager?.get(name) : null;
        
        if (!gradient) {
            ctx.data.colorStops = ctx.data?.colorStops
                ? [...ctx.data.colorStops, [offset / 100, color]] 
                : [[offset / 100, color]];
        } else gradient.addColorStop(offset, color);

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});