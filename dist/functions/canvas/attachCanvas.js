"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
const discord_js_1 = require("discord.js");
exports.default = new __1.AoiFunction({
    name: "$attachCanvas",
    description: "Attaches the canvas.",
    params: [
        {
            name: "canvas",
            description: "The name of the canvas to attach.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof __1.CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found."
        },
        {
            name: "name",
            description: "The canvas attachment file name.",
            type: __1.ParamType.String,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [name, att] = ctx.params;
        const canvas = ctx.data.canvasManager?.get(name);
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to attach.");
        ctx.files.push(new discord_js_1.AttachmentBuilder(canvas.buffer, {
            name: (att ?? "{canvas}.png")?.replace(/\{canvas\}/g, name ?? "canvas")
        }));
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
//# sourceMappingURL=attachCanvas.js.map