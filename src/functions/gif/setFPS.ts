import { AoiFunction, GIFManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$setFPS",
    description: "Sets the FPS (Frames Per Second) of a GIF.",
    params: [
        {
            name: "gif",
            description: "Name of the GIF.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.gifManager && c.data.gifManager instanceof GIFManager && c.data.gifManager.get(v)),
            checkError: () => "No GIF with provided name found."
        },
        {
            name: "frames",
            description: "Number of frames per second to display.",
            type: ParamType.Number,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name, fps ] = ctx.params;

        const gif = ctx.data.gifManager?.get(name);
                
        if (!gif)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No gif to set the FPS of.");
        
        gif.setFramesPerSecond(fps);

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});