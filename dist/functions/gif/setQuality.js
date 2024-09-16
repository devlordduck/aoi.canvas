"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$setQuality",
    description: "Sets the GIF color quality.",
    params: [
        {
            name: "gif",
            description: "Name of the GIF.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.gifManager && c.data.gifManager instanceof __1.GIFManager && c.data.gifManager.get(v)),
            checkError: () => "No GIF with provided name found."
        },
        {
            name: "quality",
            description: "The quality. (0-30)",
            type: __1.ParamType.Number,
            check: (v) => v <= 30 && v >= 0
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [name, quality] = ctx.params;
        const gif = ctx.data.gifManager?.get(name);
        if (!gif)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No gif.");
        await gif.setQuality(quality);
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=setQuality.js.map