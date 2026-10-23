// رسم بياني بسيط على canvas يتبع ألوان الوضع الحالي (فاتح/ليلي)

export type View = { xmin: number; xmax: number; ymin: number; ymax: number };

export const css = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export class Plot {
  ctx: CanvasRenderingContext2D;
  w = 0;
  h = 0;
  constructor(public canvas: HTMLCanvasElement, public view: View) {
    this.ctx = canvas.getContext('2d')!;
    canvas.setAttribute('dir', 'ltr');
  }
  /** يضبط الحجم حسب العرض الفعلي وكثافة الشاشة */
  fit(aspect = 0.62) {
    const dpr = window.devicePixelRatio || 1;
    const w = this.canvas.clientWidth || 600;
    const h = Math.round(w * aspect);
    this.canvas.style.height = `${h}px`;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.direction = 'ltr';
    this.w = w;
    this.h = h;
  }
  X = (x: number) => ((x - this.view.xmin) / (this.view.xmax - this.view.xmin)) * this.w;
  Y = (y: number) => this.h - ((y - this.view.ymin) / (this.view.ymax - this.view.ymin)) * this.h;

  clear() {
    this.ctx.clearRect(0, 0, this.w, this.h);
  }
  grid(step = 1, labelEvery = 1, stepY = step) {
    const { ctx, view } = this;
    ctx.lineWidth = 1;
    ctx.strokeStyle = css('--line');
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    for (let x = Math.ceil(view.xmin / step) * step; x <= view.xmax; x += step) {
      ctx.moveTo(this.X(x) + 0.5, 0);
      ctx.lineTo(this.X(x) + 0.5, this.h);
    }
    for (let y = Math.ceil(view.ymin / stepY) * stepY; y <= view.ymax; y += stepY) {
      ctx.moveTo(0, this.Y(y) + 0.5);
      ctx.lineTo(this.w, this.Y(y) + 0.5);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
    // المحاور
    ctx.strokeStyle = css('--muted');
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, this.Y(0));
    ctx.lineTo(this.w, this.Y(0));
    ctx.moveTo(this.X(0), 0);
    ctx.lineTo(this.X(0), this.h);
    ctx.stroke();
    // أرقام المحاور
    ctx.fillStyle = css('--muted');
    ctx.font = '11px "Noto Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let x = Math.ceil(view.xmin / (step * labelEvery)) * step * labelEvery; x <= view.xmax; x += step * labelEvery) {
      if (Math.abs(x) < 1e-9) continue;
      ctx.fillText(String(+x.toFixed(2)), this.X(x), Math.min(Math.max(this.Y(0) + 4, 2), this.h - 14));
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = Math.ceil(view.ymin / (stepY * labelEvery)) * stepY * labelEvery; y <= view.ymax; y += stepY * labelEvery) {
      if (Math.abs(y) < 1e-9) continue;
      ctx.fillText(String(+y.toFixed(2)), Math.max(Math.min(this.X(0) - 4, this.w - 4), 24), this.Y(y));
    }
  }
  fn(f: (x: number) => number, color = css('--plot-curve'), width = 2.6, dash: number[] = []) {
    const { ctx, view } = this;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    let pen = false;
    const steps = Math.max(200, this.w);
    for (let k = 0; k <= steps; k++) {
      const x = view.xmin + ((view.xmax - view.xmin) * k) / steps;
      const y = f(x);
      if (!Number.isFinite(y) || y > view.ymax + 50 || y < view.ymin - 50) {
        pen = false;
        continue;
      }
      if (pen) ctx.lineTo(this.X(x), this.Y(y));
      else ctx.moveTo(this.X(x), this.Y(y));
      pen = true;
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }
  dot(x: number, y: number, color = css('--plot-hot'), r = 5, hollow = false) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.arc(this.X(x), this.Y(y), r, 0, Math.PI * 2);
    if (hollow) {
      ctx.fillStyle = css('--surface');
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      ctx.fillStyle = color;
      ctx.fill();
    }
  }
  label(x: number, y: number, text: string, color = css('--ink'), align: CanvasTextAlign = 'left') {
    const { ctx } = this;
    ctx.fillStyle = color;
    ctx.font = '600 13px "Noto Sans", sans-serif';
    ctx.textAlign = align;
    ctx.textBaseline = 'bottom';
    ctx.fillText(text, this.X(x), this.Y(y) - 6);
  }
}

/** يعيد الرسم عند تغيّر الحجم أو الوضع الليلي */
export function onRedraw(el: Element, draw: () => void) {
  new ResizeObserver(() => draw()).observe(el);
  window.addEventListener('themechange', () => requestAnimationFrame(draw));
}

export const fmt = (v: number, d = 2) => {
  const r = +v.toFixed(d);
  return Object.is(r, -0) ? '0' : String(r);
};
