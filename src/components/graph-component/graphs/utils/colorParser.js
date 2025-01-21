const ColorParser = (color) => {
  if (!color) return color;
  return color.startsWith('color') ? `var(--mr-${color})` : color;
};

export default ColorParser;
