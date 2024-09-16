import { CanvasBuilder, CanvasManager, AoiFunction, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$lineTo",
    description: "Adds a straight line to the current path.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "x",
            description: "The X coordinate of the line's end point.",
            type: ParamType.Number
        },
        {
            name: "y",
            description: "The Y coordinate of the line's end point.",
            type: ParamType.Number
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, x, y ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name)?.ctx;
                
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas.");

        canvas.lineTo(x, y);

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});