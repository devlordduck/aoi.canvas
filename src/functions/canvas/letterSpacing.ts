import { AoiFunction, CanvasBuilder, CanvasManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$letterSpacing",
    description: "Specifies the spacing between letters when drawing text.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas to set the letter spacing in.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "spacing",
            description: "The new letter spacing.",
            type: ParamType.Number
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, spacing ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name)?.ctx;

        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to set the letter spacing in.");

        canvas.letterSpacing = spacing + "px";

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});