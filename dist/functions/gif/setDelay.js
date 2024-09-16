"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$setDelay",
    description: "Sets the GIF display frame delay.",
    params: [
        {
            name: "gif",
            description: "Name of the GIF.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.gifManager && c.data.gifManager instanceof __1.GIFManager && c.data.gifManager.get(v)),
            checkError: () => "No GIF with provided name found."
        },
        {
            name: "delay",
            description: "Number of milliseconds to display frame",
            type: __1.ParamType.Number,
            check: (v) => v >= 0
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [name, delay] = ctx.params;
        const gif = ctx.data.gifManager?.get(name);
        if (!gif)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No gif.");
        await gif.setDelay(delay);
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=setDelay.js.map