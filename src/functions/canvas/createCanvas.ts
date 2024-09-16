import { CanvasManager } from '../..';
import { AoiFunction, ParamType } from '../..';

export default new AoiFunction<"djs">({
    name: "$createCanvas",
    description: "Creates a new canvas.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas to create.",
            type: ParamType.String
        },
        {
            name: "width",
            description: "Width of the new canvas.",
            type: ParamType.Number
        },
        {
            name: "height",
            description: "Height of the new canvas.",
            type: ParamType.Number
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name, w, h ] = ctx.params;
        
        if (!ctx.data.canvasManager)
            ctx.data.canvasManager = new CanvasManager();

        if (ctx.data.canvasManager?.get(name))
            return ctx.aoiError.fnError(ctx, "custom", {}, `A canvas with provided name already exists.`);

        ctx.data.canvasManager.create(name, w, h);

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});