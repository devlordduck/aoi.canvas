"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$gifFinish",
    description: "Finishes the gif.",
    params: [
        {
            name: "gif",
            description: "Name of the GIF.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.gifManager && c.data.gifManager instanceof __1.GIFManager && c.data.gifManager.get(v)),
            checkError: () => "No GIF with provided name found."
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [name] = ctx.params;
        const gif = ctx.data.gifManager?.get(name);
        if (!gif)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No gif.");
        gif.finish();
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=gifFinish.js.map