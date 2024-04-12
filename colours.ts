export function mixHexColors(color1, color2) {
  let hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  let rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  let color1Rgb = hexToRgb(color1);
  let color2Rgb = hexToRgb(color2);

  let mixedColorRgb = {
    r: Math.round((color1Rgb.r + color2Rgb.r) / 2),
    g: Math.round((color1Rgb.g + color2Rgb.g) / 2),
    b: Math.round((color1Rgb.b + color2Rgb.b) / 2),
  };

  return rgbToHex(mixedColorRgb.r, mixedColorRgb.g, mixedColorRgb.b);
}
