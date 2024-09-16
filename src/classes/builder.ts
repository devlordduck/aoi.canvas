import { SKRSContext2D, createCanvas, Image } from '@napi-rs/canvas';
import { CanvasUtil, fontRegex } from './util';
import { FillOrStrokeOrClear, FilterMethod, Filters, textAlign, textBaseline } from '../typings';

// Builder
export class CanvasBuilder {
  public ctx: SKRSContext2D;
  public util = CanvasUtil;

  public readonly width: number;
  public readonly height: number;

  constructor (width: number, height: number) {
    this.ctx = createCanvas(width, height).getContext('2d');
    this.width = width;
    this.height = height;
  };

  rect (type: FillOrStrokeOrClear.none | FillOrStrokeOrClear.fill | FillOrStrokeOrClear, style: string | CanvasGradient | CanvasPattern, x: number, y: number, width?: number, height?: number, radius?: number | number[]): void;
  rect (type: FillOrStrokeOrClear.stroke, style: string | CanvasGradient | CanvasPattern, x: number, y: number, width?: number, height?: number, lineWidth?: number, radius?: number | number[]): void;
  public rect (type: FillOrStrokeOrClear, style: string | CanvasGradient | CanvasPattern, x: number, y: number, width?: number, height?: number, a?: number | number[], b?: number | number[]) {
    const ctx = this.ctx;
    width??= ctx.canvas.width;
    height??= ctx.canvas.height;

    const s = type === FillOrStrokeOrClear.fill ? 'fillStyle' : 'strokeStyle';
    const oldstyle = ctx[s];
    
    ctx[s] = style;

    if (type === FillOrStrokeOrClear.none)
      return (ctx.roundRect(x, y, width, height, a), ctx[s] = oldstyle);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, type !== FillOrStrokeOrClear.stroke ? a : b);
    
    ({
      [FillOrStrokeOrClear.clear]: () => ctx.clearRect(x, y, width, height),
      [FillOrStrokeOrClear.fill]: () => ctx.fill(),
      [FillOrStrokeOrClear.stroke]: () => {
        ctx.lineWidth = a as number;
        ctx.stroke();
      }
    })[type]();

    ctx.restore();
    ctx[s] = oldstyle;
  };

  public async fillText (
    style: string | CanvasGradient, 
    text: string, 
    x: number, 
    y: number, 
    font: string, 
    maxWidth?: number, 
    align?: textAlign, 
    baseline?: textBaseline, 
    multiline?: boolean, 
    wrap?: boolean, 
    lineOffset?: number
  ) {
    const ctx = this.ctx;
    const oldfont = ctx.font;
    const oldstyle = ctx.fillStyle;
    const oldalign = ctx.textAlign;
    const oldbaseline = ctx.textBaseline;

    ctx.font = font;
    ctx.fillStyle = style;
    ctx.textAlign = align ?? oldalign;
    ctx.textBaseline = (baseline ?? oldbaseline) as any;
  
    const lines = multiline ? text.split('\n') : [text];
    let offset = y;
    
    lines.forEach((line) => {
      if (wrap && maxWidth) {
        const words = line.split(' ');
        let currentLine = '';
  
        words.forEach((word, i) => {
          const testLine = currentLine + word + ' ';
          const width = ctx.measureText(testLine).width;
          if (width > maxWidth && i > 0) {
            ctx.fillText(currentLine, x, offset, maxWidth);
            currentLine = word + ' ';
            offset += parseFloat(ctx.font) + (lineOffset ?? 0);
          } else currentLine = testLine;
        });
  
        ctx.fillText(currentLine, x, offset, maxWidth);
      } else ctx.fillText(line, x, offset, maxWidth);

      offset += parseFloat(ctx.font) + (lineOffset ?? 0);
    });

    ctx.font = oldfont;
    ctx.fillStyle = oldstyle;
    ctx.textAlign = oldalign;
    ctx.textBaseline = oldbaseline;
  };  

  public async strokeText (style: string | CanvasGradient, text: string, x: number, y: number, font: string, strokeWidth?: number, maxWidth?: number, align?: textAlign, baseline?: textBaseline, multiline?: boolean, wrap?: boolean, lineOffset?: number) {
    const ctx = this.ctx;
    const oldfont = ctx.font;
    const oldstyle = ctx.strokeStyle;
    const oldalign = ctx.textAlign;
    const oldbaseline = ctx.textBaseline;
    const oldwidth = ctx.lineWidth;

    ctx.font = font;
    ctx.strokeStyle = style;
    ctx.lineWidth = strokeWidth ?? oldwidth;
    ctx.textAlign = align ?? oldalign;
    ctx.textBaseline = (baseline ?? oldbaseline) as any;
  
    const lines = multiline ? text.split('\n') : [text];
    let offset = y;
    
    lines.forEach((line) => {
      if (wrap && maxWidth) {
        const words = line.split(' ');
        let currentLine = '';
  
        words.forEach((word, i) => {
          const testLine = currentLine + word + ' ';
          const width = ctx.measureText(testLine).width;
          if (width > maxWidth && i > 0) {
            ctx.strokeText(currentLine, x, offset, maxWidth);
            currentLine = word + ' ';
            offset += parseFloat(ctx.font) + (lineOffset ?? 0);
          } else currentLine = testLine;
        });
  
        ctx.strokeText(currentLine, x, offset, maxWidth);
      } else ctx.strokeText(line, x, offset, maxWidth);
      
      offset += parseFloat(ctx.font) + (lineOffset ?? 0);
    });

    ctx.font = oldfont;
    ctx.strokeStyle = oldstyle;
    ctx.textAlign = oldalign;
    ctx.textBaseline = oldbaseline;
  };

  public async drawImage (image: string | Image, x: number, y: number, width?: number, height?: number, radius?: number | number[]) {
    const ctx = this.ctx;
    if (typeof image === 'string')
      image = await CanvasUtil.fetchImage(image);

    if (!image) return;
    
    width??= image.width;
    height??= image.height;

    if (!radius)
      return ctx.drawImage(image, x, y, width, height);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.clip();
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();
  };

  public measureText (text: string, font: string) {
    const ctx = this.ctx,
          oldfont = ctx.font;
    
    ctx.font = font;
    
    const metrics = ctx.measureText(text);

    ctx.font = oldfont;

    return metrics;
  };

  public filter (method: FilterMethod, filter?: Filters, value?: number) {
    const ctx = this.ctx;

    if (filter && typeof filter === 'string')
      filter = Filters[filter] as unknown as Filters;

    if (method === FilterMethod.add) {
      if (!filter || !value) return;

      const PxOrPerc =
          filter === Filters.grayscale || filter === Filters.sepia ? '%' : 
            (filter === Filters.blur ? 'px' : '');

      ctx.filter = CanvasUtil.parseFilters((ctx.filter === 'none' ? '' : ctx.filter) + `${Filters[filter]}(${value + PxOrPerc})`)?.map(x => x?.raw)?.join(' ')?.trim()
    }
    else if (method === FilterMethod.set) {
      if (!filter || !value) return;

      const PxOrPerc =
          filter === Filters.grayscale || filter === Filters.sepia ? '%' : 
            (filter === Filters.blur ? 'px' : '');

      ctx.filter = `${Filters[filter]}(${value + PxOrPerc})`
    }
    else if (method === FilterMethod.remove) {
      if (!filter) return;

      let filters = CanvasUtil.parseFilters(ctx.filter);

      const index = filters.findIndex((obj: { filter: string, raw: string, value: string }) => obj?.filter === Filters[filter])

      if (index !== -1)
        filters.splice(index, 1);

      ctx.filter = filters.length > 0 ? filters?.map(x => x?.raw)?.join(' ')?.trim() : 'none'
    }
    else if (method === FilterMethod.clear)
      ctx.filter = 'none';
    else if (method === FilterMethod.get)
      return ctx.filter;
    else if (method === FilterMethod.parse)
      return CanvasUtil.parseFilters(ctx.filter);
  };

  public setShadow (blur: number, color: string, offset?: number | number[]) {
    const ctx = this.ctx;

    ctx.shadowBlur = blur;
    ctx.shadowColor = color;
    
    if (offset && !Array.isArray(offset)) {
      ctx.shadowOffsetX = offset;
      ctx.shadowOffsetY = offset;
    } else if (offset && Array.isArray(offset)) {
      const [ x = 0, y = 0 ] = offset;

      ctx.shadowOffsetX = x;
      ctx.shadowOffsetY = y;
    };
  };

  public rotate (angle: number) {
    const ctx = this.ctx;

    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    ctx.translate(centerX, centerY);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
  };

  public trim () {
    let ctx = this.ctx,
        canvas = ctx.canvas,
        pixels = ctx.getImageData(0, 0, canvas.width, canvas.height),
        l = pixels.data.length,
        i,
        bound = {
            top: canvas.height,
            left: canvas.width,
            right: 0,
            bottom: 0
        },
        x, y;

    for (i = 0; i < l; i += 4) {
        if (pixels.data[i + 3] === 0)
            continue;

        x = (i / 4) % canvas.width;
        y = Math.floor((i / 4) / canvas.width);

        if (x < bound.left) bound.left = x;
        if (y < bound.top) bound.top = y;
        if (y > bound.bottom) bound.bottom = y;
        if (x > bound.right) bound.right = x;
    }

    const height = bound.bottom - bound.top + 1;
    const width = bound.right - bound.left + 1;
    const trimmed = ctx.getImageData(bound.left, bound.top, width, height);

    canvas.width = width;
    canvas.height = height;

    ctx.putImageData(trimmed, 0, 0);
  };

  public getPixelColors (x: number, y: number, width: number, height: number) {
    const ctx = this.ctx;
    width??= ctx.canvas.width;
    height??= ctx.canvas.height;

    const data = ctx.getImageData(x, y, width, height).data;
    const colors = [];

    for (let i = 0; i < data.length; i += 4) {
      colors.push(CanvasUtil.rgbaToHex(
        data[i],
        data[i + 1],
        data[i + 2],
        data[i + 3] / 255
      ));
    };

    return colors;
  };

  public setPixelsColors (x: number, y: number, width: number, height: number, colors: string[]) {
    const ctx = this.ctx;
    width??= ctx.canvas.width;
    height??= ctx.canvas.height;

    const data = ctx.createImageData(width, height);

    colors?.forEach((hex, i) => {
      const colors = CanvasUtil.hexToRgba(hex);
      i = i * 4;

      data.data[i] = colors.red;
      data.data[i + 1] = colors.green;
      data.data[i + 2] = colors.blue;
      data.data[i + 3] = colors.alpha ?? 255;
    });
    
    ctx.putImageData(data, x, y);
  };

  public resize (width: number, height: number) {
    const ctx = this.ctx,
          data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.putImageData(data, 0, 0);
  };

  public get buffer () { return this.ctx.canvas.toBuffer('image/png') };
};