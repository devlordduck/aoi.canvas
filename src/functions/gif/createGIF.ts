import { GIFManager } from '../..';
import { AoiFunction, ParamType } from '../..';
const gifencoder = require("gif-encoder-2");

export default new AoiFunction<"djs">({
    name: "$createGIF",
    description: "Creates a new GIF.",
    params: [
        {
            name: "name",
            description: "Name of the GIF to create.",
            type: ParamType.String
        },
        {
            name: "width",
            description: "Width of the gif.",
            type: ParamType.Number
        },
        {
            name: "height",
            description: "Height of the gif.",
            type: ParamType.Number
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name, w, h ] = ctx.params;

        if (!ctx.data.gifManager)
            ctx.data.gifManager = new GIFManager();

        // if (ctx.data.gifManager?.get(name))
        //     return ctx.aoiError.fnError(ctx, "custom", {}, `A gif with provided name already exists.`);

        ctx.data.gifManager.create(name, w, h);
        ctx.data.gifManager.get(name).start();

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});