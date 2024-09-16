import { CanvasManager, AoiFunction, ParamType } from '../../';
import { AttachmentBuilder } from "discord.js";
 
export default new AoiFunction<"djs">({
    name: "$attachCanvas",
    description: "Attaches the canvas.",
    params: [
        {
            name: "canvas",
            description: "The name of the canvas to attach.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "name",
            description: "The canvas attachment file name.",
            type: ParamType.String,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name, att ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name);

        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to attach.");

        ctx.files.push(new AttachmentBuilder(canvas.buffer, {
            name: (att ?? "{canvas}.png")?.replace(/\{canvas\}/g, name ?? "canvas")
        }));

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }    
});