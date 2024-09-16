import { AoiFunction, CanvasBuilder, CanvasManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$moveTo",
    description: "Begins a new path at the point specified by the given (x, y) coordinates.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas to begin a new path in.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "x",
            description: "The X coordinate.",
            type: ParamType.Number
        },
        {
            name: "y",
            description: "The Y coordinate.",
            type: ParamType.Number
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name, x, y ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name);

        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to begin a new path in.");

        await canvas.ctx.moveTo(x, y);

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }    
});