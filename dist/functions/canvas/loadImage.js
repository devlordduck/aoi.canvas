"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
const node_fs_1 = require("node:fs");
exports.default = new __1.AoiFunction({
    name: "$loadImage",
    description: "Loads an image.",
    params: [
        {
            name: "image",
            description: "Name of the image.",
            type: __1.ParamType.String
        },
        {
            name: "path",
            description: "Path or url to the image.",
            type: __1.ParamType.String,
            typename: "Path | URL",
            check: (v, c) => c.checkType(c, { type: __1.ParamType.Url }, v) ? true
                : (0, node_fs_1.existsSync)(v) ? true : false,
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [name, path] = ctx.params;
        if (!ctx.data.imageManager)
            ctx.data.imageManager = new __1.ImageManager();
        ctx.data.imageManager.set(name, await __1.CanvasUtil.fetchImage(path));
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=loadImage.js.map