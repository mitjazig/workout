/** Stories-ready delilna kartica (canvas → PNG). */

export interface ShareCardInput {
  dayNumber: number;
  title: string;
  streak: number;
  percent?: number;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function renderShareCard(input: ShareCardInput): HTMLCanvasElement {
  const w = 1080;
  const h = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Background
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, w, h);

  // Accent glow
  const glow = ctx.createRadialGradient(w * 0.75, h * 0.18, 40, w * 0.75, h * 0.18, 420);
  glow.addColorStop(0, 'rgba(250, 84, 0, 0.35)');
  glow.addColorStop(1, 'rgba(250, 84, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Brand
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '700 36px "DM Sans", system-ui, sans-serif';
  ctx.letterSpacing = '10px';
  ctx.fillText('IZZIV 10', 96, 180);

  // Big day
  ctx.fillStyle = '#ffffff';
  ctx.font = '400 220px "Bebas Neue", "Arial Narrow", Impact, sans-serif';
  ctx.fillText(`DAN ${input.dayNumber}`, 96, 460);

  // Title
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '600 52px "DM Sans", system-ui, sans-serif';
  const title = input.title.length > 42 ? `${input.title.slice(0, 40)}…` : input.title;
  wrapText(ctx, title, 96, 560, w - 192, 64);

  // Accent bar
  ctx.fillStyle = '#FA5400';
  ctx.fillRect(96, 720, 220, 14);

  // Stats box
  roundRect(ctx, 96, 820, w - 192, 280, 16);
  ctx.fillStyle = '#1a1a1a';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '400 120px "Bebas Neue", "Arial Narrow", Impact, sans-serif';
  ctx.fillText(String(input.streak), 140, 980);

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '700 28px "DM Sans", system-ui, sans-serif';
  ctx.fillText('DNI NIZA', 140, 1035);

  if (typeof input.percent === 'number') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '400 120px "Bebas Neue", "Arial Narrow", Impact, sans-serif';
    ctx.fillText(`${input.percent}%`, 560, 980);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '700 28px "DM Sans", system-ui, sans-serif';
    ctx.fillText('IZZIV', 560, 1035);
  }

  // Footer
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '600 30px "DM Sans", system-ui, sans-serif';
  ctx.fillText('Doma. Brez opreme. Nadaljujem.', 96, h - 160);

  return canvas;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ');
  let line = '';
  let yy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}

export async function shareOrDownloadCard(input: ShareCardInput): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const canvas = renderShareCard(input);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png'),
  );
  if (!blob) return 'cancelled';

  const file = new File([blob], `izziv-10-dan-${input.dayNumber}.png`, { type: 'image/png' });
  const nav = navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
    share?: (data: ShareData) => Promise<void>;
  };

  if (nav.share && (!nav.canShare || nav.canShare({ files: [file] }))) {
    try {
      await nav.share({
        files: [file],
        title: `Izziv 10 – Dan ${input.dayNumber}`,
        text: `Opravil/a sem dan ${input.dayNumber}: ${input.title}`,
      });
      return 'shared';
    } catch {
      /* fall through to download / cancel */
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);
  return 'downloaded';
}
