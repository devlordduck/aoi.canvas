import { CanvasBuilder, CanvasManager } from "../classes";
import { AoiD } from "../index"

export default {
    name: "$canvasSize",
    info: {
        description: "Returns canvas size.",
        parameters: [
            {
                name: "canvas",
                description: "The canvas name.",
                type: "string",
                required: true
            },
            {
                name: "property",
                description: "The canvas size property.",
                type: "string",
                required: true
            }
        ],
        examples: [
            /*{
                description: "This will make a canvas and then measure text.",
                code: `$measureText[mycanvas;Hello;15px Arial]
                       $createCanvas[mycanvas;300;320]`?.split("\n").map(x => x?.trim()).join("\n"),
                images: []
            }*/
        ]
    },
    code: async (d: AoiD) => {
        let data = d.util.aoiFunc(d);
        let [ canvas = "canvas", property = "width" ] = data.inside.splits;

        if (!d.data.canvases || !(d.data.canvases instanceof CanvasManager))
            return d.aoiError.fnError(d, "custom", {}, `No canvas with provided name found.`);

        let canvs: any = d.data.canvases.get(canvas);

        if (!canvs || !(canvs instanceof CanvasBuilder))
            return d.aoiError.fnError(d, "custom", {}, `No canvas with provided name found.`);
        canvs = canvs.getContext()?.canvas;

        if (property?.trim()?.toLowerCase() === "width")
            data.result = canvs.width;
        else if (property?.trim()?.toLowerCase() === "height")
            data.result = canvs.height;
        else
            return d.aoiError.fnError(d, "custom", {}, `Invalid property.`);

        return {
            code: d.util.setCode(data),
            data: d.data
        };
    }
};