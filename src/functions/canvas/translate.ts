import { AoiFunction, CanvasBuilder, CanvasManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$translate",
    description: "Adds a translation transformation.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas to add a translation transformation in.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "x",
            description: "Distance to move in the horizontal direction. positive = right, negative = left.",
            type: ParamType.Number
        },
        {
            name: "y",
            description: "Distance to move in the vertical direction. positive = right, negative = left.",
            type: ParamType.Number
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, x, y ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name);

        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to add a translation transformation in.");

        canvas.ctx.translate(x, y);

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});