export type RGB = { r: number; g: number; b: number };
export type HSL = { h: number; s: number; l: number };

export const clamp = (n: number, min = 0, max = 255) => Math.max(min, Math.min(max, n));

export const hexToRgb = (hex: string): RGB | null => {
  const clean = hex.replace('#', '').trim();
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  if (!/^([0-9a-fA-F]{6})$/.test(full)) return null;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(v => clamp(Math.round(v)).toString(16).padStart(2, '0')).join('');
};

/** Returns a lowercase 6-digit `#rrggbb`, or null if the input isn't a valid hex color. */
export const normalizeHex = (hex: string): string | null => {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHex(rgb.r, rgb.g, rgb.b) : null;
};

export const rgbToHsl = ({ r, g, b }: RGB): HSL => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

export const formatRgb = ({ r, g, b }: RGB) => `rgb(${r}, ${g}, ${b})`;

export const formatHsl = ({ h, s, l }: HSL) => `hsl(${h} ${s}% ${l}%)`;

// WCAG relative luminance
const luminance = ({ r, g, b }: RGB) => {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

export const contrastRatio = (fg: RGB, bg: RGB) => {
  const L1 = luminance(fg) + 0.05;
  const L2 = luminance(bg) + 0.05;
  const ratio = L1 > L2 ? L1 / L2 : L2 / L1;
  return Math.round(ratio * 100) / 100;
};

const BLACK: RGB = { r: 0, g: 0, b: 0 };
const WHITE: RGB = { r: 255, g: 255, b: 255 };

/** Black or white, whichever reads better on top of `hex`. */
export const readableTextColor = (hex: string): '#000000' | '#ffffff' => {
  const bg = hexToRgb(hex) ?? BLACK;
  return contrastRatio(BLACK, bg) >= contrastRatio(WHITE, bg) ? '#000000' : '#ffffff';
};
