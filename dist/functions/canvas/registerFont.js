"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("@napi-rs/canvas");
const __1 = require("../../");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
exports.default = new __1.AoiFunction({
    name: "$registerFont",
    description: "Registers a font.",
    params: [
        {
            name: "src",
            description: "The font source.",
            type: __1.ParamType.String,
            typename: "Path | URL",
        },
        {
            name: "name",
            description: "The font name.",
            type: __1.ParamType.String,
            check: (v) => !canvas_1.GlobalFonts.has(v),
            checkError: () => "Font with provided name already exists.",
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [src, name] = ctx.params;
        if (!(0, node_fs_1.existsSync)((0, node_path_1.join)(process.cwd(), src)))
            return ctx.aoiError.fnError(ctx, 'custom', {}, `Invalid font source. ${(0, node_path_1.resolve)(process.cwd(), src)}`);
        (0, __1.registerFonts)([{
                src: (0, node_path_1.join)(process.cwd(), src),
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
//# sourceMappingURL=registerFont.js.map