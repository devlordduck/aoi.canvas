import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { AoiFunction, CanvasBuilder, CanvasManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$downloadCanvas",
    description: "Downloads the canvas.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas to download.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "path",
            description: "The download path. (file name and extension)",
            type: ParamType.String,
            typename: "Path"
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, path = "{canvas}.png" ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name);

        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to download.");

        await writeFileSync(join(process.cwd(), path?.replace(/{canvas}/g, canvas)), canvas.buffer);

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});