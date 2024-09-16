import { AoiFunction, CanvasUtil, ImageManager, Param, ParamType } from '../../';
import { existsSync } from "node:fs";

export default new AoiFunction<"djs">({
    name: "$loadImage",
    description: "Loads an image.",
    params: [
        {
            name: "image",
            description: "Name of the image.",
            type: ParamType.String
        },
        {
            name: "path",
            description: "Path or url to the image.",
            type: ParamType.String,
            typename: "Path | URL",
            check: (v, c) => 
                c.checkType(c, { type: ParamType.Url } as Param, v) ? true
                    : existsSync(v) ? true : false,
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, path ] = ctx.params;

        if (!ctx.data.imageManager)
            ctx.data.imageManager = new ImageManager();

        ctx.data.imageManager.set(name, await CanvasUtil.fetchImage(path));

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});