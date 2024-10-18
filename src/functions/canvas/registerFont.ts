import { GlobalFonts } from "@napi-rs/canvas";
import { AoiFunction, ParamType, registerFonts } from '../../';
import { existsSync, statSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

export default new AoiFunction<"djs">({
    name: "$registerFont",
    description: "Registers a font.",
    params: [
        {
            name: "src",
            description: "The font source.",
            type: ParamType.String,
            typename: "Path | URL",
        },
        {
            name: "name",
            description: "The font name.",
            type: ParamType.String,
            check: (v) => !GlobalFonts.has(v),
            checkError: () => "Font with provided name already exists.",
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ src, name ] = ctx.params;

        if (!existsSync(join(process.cwd(), src)))
            return ctx.aoiError.fnError(ctx, 'custom', {}, `Invalid font source. ${resolve(process.cwd(), src)}`);

        registerFonts([{
            src: join(process.cwd(), src),
            name
        }]);

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    },
    docs: {
        example: `### Loading a font
\`\`\`aoi
$registerFont[./fonts/Arial.ttf;Arial]
\`\`\`

### Loading fonts from a directory
\`\`\`aoi
$registerFont[./fonts]
\`\`\``
    }
});