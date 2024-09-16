import { AoiFunction, CanvasBuilder, CanvasManager, lineJoinShape, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$imageSmoothing",
    description: "Enables or disables image smoothing.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "enabled",
            description: "Determines whether scaled images are smoothed or not.",
            type: ParamType.Boolean,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, enabled ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name)?.ctx;

        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas.");

        if (enabled !== null && enabled !== undefined)
            canvas.imageSmoothingEnabled = enabled;
        else
            data.result = canvas.imageSmoothingEnabled;

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});