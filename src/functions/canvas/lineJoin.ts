import { AoiFunction, CanvasBuilder, CanvasManager, lineJoinShape, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$lineJoin",
    description: "Sets the shape used to join two line segments where they meet.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "shape",
            description: "The new shape.",
            type: ParamType.Enum,
            enum: lineJoinShape,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, shape ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name)?.ctx;

        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas.");

        if (shape !== null && shape !== undefined)
            canvas.lineJoin = typeof shape === "number" ? lineJoinShape[shape] : shape;
        else
            data.result = canvas.lineJoin;

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});