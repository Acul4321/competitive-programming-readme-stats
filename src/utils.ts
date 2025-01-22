export function formatDate(date:Date):string{
    return date.toISOString().split('T')[0].replace(/-/g, '/');
}

export type RGB = {
  r: number;
  g: number;
  b: number;
  a?: number;  // Add optional alpha channel
};

function normalizeHexColor(hex: string): { hex: string, alpha?: number } {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    let alpha: number | undefined;
    
    // Handle different formats
    if (hex.length === 8) {
        // 8 characters = RRGGBBAA
        alpha = parseInt(hex.slice(6, 8), 16) / 255;
        hex = hex.slice(0, 6);
    } else if (hex.length === 4) {
        // 4 characters = RGB[A]
        const alphaChar = hex[3];
        alpha = alphaChar ? parseInt(alphaChar + alphaChar, 16) / 255 : undefined;
        hex = hex.slice(0, 3).split('').map(char => char + char).join('');
    } else if (hex.length === 3) {
        // 3 characters = RGB
        hex = hex.split('').map(char => char + char).join('');
    }
    
    return { hex, alpha };
}

export function hexToRgb(hex: string): RGB {
    // Normalize the hex string
    const { hex: normalizedHex, alpha } = normalizeHexColor(hex);
    
    // Validate the normalized hex
    if (!/^[0-9a-fA-F]{6}$/.test(normalizedHex)) {
        throw new Error("Invalid hex color string");
    }

    const r = parseInt(normalizedHex.slice(0, 2), 16);
    const g = parseInt(normalizedHex.slice(2, 4), 16);
    const b = parseInt(normalizedHex.slice(4, 6), 16);

    return alpha !== undefined ? { r, g, b, a: alpha } : { r, g, b };
}

function normalizeColor(color: RGB): RGB {
    let { r, g, b, a } = color;

    // Find the maximum RGB value
    const maxVal = Math.max(r, g, b);

    // Scale values if the maximum is greater than 255
    if (maxVal > 255) {
        const scale = 255 / maxVal;
        r = Math.round(r * scale);
        g = Math.round(g * scale);
        b = Math.round(b * scale);
    } else {
        // Ensure values are not negative
        r = Math.max(0, Math.round(r));
        g = Math.max(0, Math.round(g));
        b = Math.max(0, Math.round(b));
    }

    // Normalize alpha to be between 0 and 1, or default to 1
    if (a !== undefined) {
        a = Math.max(0, Math.min(1, a));
    }

    return { r, g, b, a };
}

export function rgbToHex({ r, g, b, a }: RGB): string {
    // Normalize the color values
    const normalized = normalizeColor({ r, g, b, a });
    
    const toHex = (value: number) => Math.round(value).toString(16).padStart(2, "0");
    const baseHex = `#${toHex(normalized.r)}${toHex(normalized.g)}${toHex(normalized.b)}`;
    return normalized.a !== undefined ? `${baseHex}${toHex(Math.round(normalized.a * 255))}` : baseHex;
}