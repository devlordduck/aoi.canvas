import { AoiFunction, GIFManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$setThreshold",
    description: "Sets if the color table should be reused if current frame matches previous frame.",
    params: [
        {
            name: "gif",
            description: "Name of the GIF.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.gifManager && c.data.gifManager instanceof GIFManager && c.data.gifManager.get(v)),
            checkError: () => "No GIF with provided name found."
        },
        {
            name: "percentage",
            description: "Threshold percentage.",
            type: ParamType.Number,
            check: (v) => v <= 100 && v >= 0
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, percentage ] = ctx.params;

        const gif = ctx.data.gifManager?.get(name);
                
        if (!gif)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No gif.");
        
        await gif.setThreshold(percentage);

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});