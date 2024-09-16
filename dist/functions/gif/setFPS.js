"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$setFPS",
    description: "Sets the FPS (Frames Per Second) of a GIF.",
    params: [
        {
            name: "gif",
            description: "Name of the GIF.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.gifManager && c.data.gifManager instanceof __1.GIFManager && c.data.gifManager.get(v)),
            checkError: () => "No GIF with provided name found."
        },
        {
            name: "frames",
            description: "Number of frames per second to display.",
            type: __1.ParamType.Number,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [name, fps] = ctx.params;
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
//# sourceMappingURL=setFPS.js.map