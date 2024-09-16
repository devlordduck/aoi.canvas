import { AoiFunction, CanvasBuilder, CanvasManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$resizeCanvas",
    description: "Resizes the canvas.",
    params: [
        {
            name: "canvas",
            description: "The name of the canvas to resize.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "width",
            description: "New width.",
            type: ParamType.Number
        },
        {
            name: "height",
            description: "New height.",
            type: ParamType.Number
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name, width, height ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name);

        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to resize.");

        await canvas.resize(width, height);

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }    
});