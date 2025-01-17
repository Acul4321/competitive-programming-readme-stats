export function formatDate(date:Date):string{
    return date.toISOString().split('T')[0].replace(/-/g, '/');
}

export type RGB = {
  r: number;
  g: number;
  b: number;
};

export function hexToRgb(hex: string): RGB {
  // Ensure the hex string is valid
  const normalizedHex = hex.startsWith("#") ? hex.slice(1) : hex;
  const hexRegex = /^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

  if (!hexRegex.test(normalizedHex)) {
    throw new Error("Invalid hex color string");
  }

  // Expand shorthand hex format (#abc -> #aabbcc)
  const fullHex = normalizedHex.length === 3
    ? normalizedHex.split("").map(char => char + char).join("")
    : normalizedHex;

  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);

  return { r, g, b };
}

export function rgbToHex({ r, g, b }: RGB): string {
  if (
    r < 0 || r > 255 ||
    g < 0 || g > 255 ||
    b < 0 || b > 255
  ) {
    throw new Error("RGB values must be between 0 and 255");
  }

  const toHex = (value: number) => value.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}