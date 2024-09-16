"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
const node_fs_1 = require("node:fs");
exports.default = new __1.AoiFunction({
    name: "$drawImage",
    description: "Draws an image on the canvas.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof __1.CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "path",
            description: "Path or url to the image.",
            type: __1.ParamType.String,
            typename: "Path | URL | Canvas | Image",
            check: (v, c) => c.checkType(c, { type: __1.ParamType.Url }, v) ? true
                : (0, node_fs_1.existsSync)(v) ? true
                    : (v?.toLowerCase().startsWith('canvas://')
                        ? (c.data.canvasManager
                            && c.data.canvasManager instanceof __1.CanvasManager
                            && c.data.canvasManager.get(v.split(':').slice(1).join())) : undefined) ? true
                        : (v?.toLowerCase().startsWith('images://')
                            ? (c.data.imageManager
                                && c.data.imageManager instanceof __1.CanvasManager
                                && c.data.imageManager.get(v.split(':').slice(1).join())) : undefined) ? true : false
        },
        {
            name: "x",
            description: "The X coordinate of the image.",
            type: __1.ParamType.Number
        },
        {
            name: "y",
            description: "The Y coordinate of the image.",
            type: __1.ParamType.Number
        },
        {
            name: "width",
            description: "The image width.",
            type: __1.ParamType.Number,
            optional: true
        },
        {
            name: "height",
            description: "The image height.",
            type: __1.ParamType.Number,
            optional: true
        },
        {
            name: "radius",
            description: "The image corners radius.",
            type: __1.ParamType.Number,
            check: (x) => x >= 0,
            checkError: () => "The radius must be positive.",
            rest: true,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [name, path, x, y, width, height, radius] = ctx.params;
        const canvas = ctx.data.canvasManager?.get(name);
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to draw an image on.");
        const a = path.split('://').slice(1).join('://');
        if (path.toLowerCase().startsWith('canvas://'))
            path = ctx.data.canvasManager?.get(a)?.buffer;
        else if (path.toLowerCase().startsWith('images://'))
            path = ctx.data.imageManager?.get(a);
        await canvas.drawImage(path, x, y, width, height, radius);
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=drawImage.js.map