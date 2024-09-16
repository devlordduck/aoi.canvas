import { AoiFunction, CanvasBuilder, CanvasManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$resetTransform",
    description: "Resets the current transform to the identity matrix.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name);
                
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to reset the current transform in.");
        
        canvas.ctx.resetTransform();

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});