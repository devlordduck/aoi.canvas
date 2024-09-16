import { AoiFunction, GIFManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$setRepeat",
    description: "Sets the number of loops GIF does.",
    params: [
        {
            name: "gif",
            description: "Name of the GIF.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.gifManager && c.data.gifManager instanceof GIFManager && c.data.gifManager.get(v)),
            checkError: () => "No GIF with provided name found."
        },
        {
            name: "loops",
            description: "The number of loops.",
            type: ParamType.Number,
            check: (v) => v >= 0
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, loops ] = ctx.params;

        const gif = ctx.data.gifManager?.get(name);
                
        if (!gif)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No gif.");
        
        await gif.setRepeat(loops);

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});