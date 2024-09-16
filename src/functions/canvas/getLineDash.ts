import { AoiFunction, CanvasBuilder, CanvasManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$getLineDash",
    description: "Returns the line dash pattern used when stroking lines.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas to set the line dash in.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name);

        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to get the line dash from.");

        data.result = JSON.stringify(canvas.ctx.getLineDash());

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});