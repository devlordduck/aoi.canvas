import { AoiFunction } from '../..';
import { version } from '../../../package.json'

export default new AoiFunction<"djs">({
    name: "$canvasVersion",
    description: "Returns the aoi.canvas version.",
    params: [],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        
        data.result = version;

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});