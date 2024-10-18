import { CanvasManager } from '../..';
import { AoiFunction, ParamType } from '../..';

export default new AoiFunction<"djs">({
    name: "$createCanvas",
    description: "Creates a new canvas.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas to create.",
            type: ParamType.String
        },
        {
            name: "width",
            description: "Width of the new canvas.",
            type: ParamType.Number
        },
        {
            name: "height",
            description: "Height of the new canvas.",
            type: ParamType.Number
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name, w, h ] = ctx.params;
        
        if (!ctx.data.canvasManager)
            ctx.data.canvasManager = new CanvasManager();

        // if (ctx.data.canvasManager?.get(name))
        //     return ctx.aoiError.fnError(ctx, "custom", {}, `A canvas with provided name already exists.`);

        ctx.data.canvasManager.create(name, w, h);

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    },
    docs: {
        example: `\`\`\`aoi
$attachCanvas[mycanvas;house.png]

$stroke[mycanvas;#03a9f4;10]

$closePath[mycanvas]
$lineTo[mycanvas;250;140]
$lineTo[mycanvas;150;60]
$moveTo[mycanvas;50;140]
$beginPath[mycanvas]

$fillRect[mycanvas;#03a9f4;130;190;40;60]
$strokeRect[mycanvas;#03a9f4;75;140;150;110;10]

$createCanvas[mycanvas;300;320]
\`\`\`

![showcase](https://lam.k4scripts.xyz/cdn/aoicanvas/examples/house.png)`
    }
});