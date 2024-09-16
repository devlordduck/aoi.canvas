import { AoiFunction, CanvasBuilder, CanvasManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$quadraticCurveTo",
    description: "Adds a quadratic bezier curve to the currect path.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "startX",
            description: "The X coordinate of the start point.",
            type: ParamType.Number
        },
        {
            name: "startY",
            description: "The Y coordinate of the start point.",
            type: ParamType.Number
        },
        {
            name: "endX",
            description: "The X coordinate of the end point.",
            type: ParamType.Number
        },
        {
            name: "endY",
            description: "The Y coordinate of the end point.",
            type: ParamType.Number
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name, cX, cY, endX, endY ] = ctx.params;

        const canvas = ctx.data.canvasManager?.get(name);

        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to draw the curve on.");

        await canvas.ctx.quadraticCurveTo(cX, cY, endX, endY);

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});