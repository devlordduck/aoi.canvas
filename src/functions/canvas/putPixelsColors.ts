import { AoiFunction, CanvasBuilder, CanvasManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$putPixelsColors",
    description: "Places the pixel colors in the canvas.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas to place the pixels in.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "x",
            description: "The X coordinate at which to place the pixel colors in the canvas.",
            type: ParamType.Number
        },
        {
            name: "y",
            description: "The Y coordinate at which to place the pixel colors in the canvas.",
            type: ParamType.Number
        },
        {
            name: "width",
            description: "Width of the rectangle to be painted.",
            type: ParamType.Number
        },
        {
            name: "height",
            description: "Height of the rectangle to be painted.",
            type: ParamType.Number
        },
        {
            name: "pixels",
            description: "The pixel colors.",
            type: ParamType.Array
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, x, y, width, height, pixels ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name);

        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to place the pixels in.");

        await canvas.setPixelsColors(x, y, width, height, pixels);

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});