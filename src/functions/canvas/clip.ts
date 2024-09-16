import { AoiFunction, CanvasBuilder, CanvasManager, fillRule, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$clip",
    description: "Turns the current path into the current clipping region.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "rule",
            description: "The fill rule.",
            type: ParamType.Enum,
            enum: fillRule,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name, rule ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name);
                
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to clip.");
        
        canvas.ctx.clip(fillRule[rule] as CanvasFillRule);

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});