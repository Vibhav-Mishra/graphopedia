import * as d3 from "d3";

export const getGraphUtils = (config, data) => {
  let maxX = 0;
  let minX = 0;
  let maxY = 0;
  let minY = 0;
  const graphAreaL = config.yLabelAlignment + config.padding.left;
  const graphAreaH =
    config.height -
    (config.xLabelAlignment + config.padding.bottom + config.padding.top);
  const graphAreaW =
    config.width -
    (config.yLabelAlignment + config.padding.left + config.padding.right);

  if (config.xAxisType !== "text") {
    maxX = +d3.max(data, function (d) {
      return +d.label;
    });

    minX = +d3.min(data, function (d) {
      return +d.label;
    });
    maxY = +d3.max(data, function (d) {
      if (d.positiveAcc) {
        return +d.positiveAcc;
      }
      return +d.value;
    });

    minY = +d3.min(data, function (d) {
      if (config.beginAtZero) return 0;
      if (d.negativeAcc) {
        return +d.negativeAcc;
      }
      return +d.value;
    });
    minY = minY < 0 ? minY + 0.05 * minY : 0;
  } else {
    maxY = +d3.max(data, function (d) {
      if (d.positiveAcc) {
        return +d.positiveAcc;
      }
      return +d.value;
    });

    minY = +d3.min(data, function (d) {
      if (config.beginAtZero) return 0;
      if (d.negativeAcc) {
        return +d.negativeAcc;
      }
      return +d.value;
    });
  }

  if (config.percentage) {
    minY = 0;
    maxY = 100;
  }

  return {
    graphAreaL,
    graphAreaW,
    graphAreaH,
    maxX,
    minX,
    maxY,
    minY,
  };
};

export const getMinMax = (data) => {
  const max = +d3.max(data, function (d) {
    return +d.value;
  });

  const min = +d3.min(data, function (d) {
    return +d.value;
  });

  return { max, min };
};

export const TextLength = (function () {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  /**
   * Measures the rendered width of arbitrary text given the font size and font face
   * @param {string} text The text to measure
   * @param {number} fontSize The font size in pixels
   * @param {string} fontFace The font face ("Arial", "Helvetica", etc.)
   * @returns {number} The width of the text
   **/
  function getWidth(text, fontSize, fontFace) {
    context.font = fontSize + "px " + fontFace;
    return context.measureText(text).width;
  }

  return {
    getWidth,
  };
})();

// Wraps SVG text
export const wrap = (text, width) => {
  text.each(function () {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    let word;
    let line = [];
    let lineNumber = 0;
    const lineHeight = 1.4; // ems
    const y = text.attr("y");
    const x = text.attr("x");
    const dy = parseFloat(text.attr("dy"));
    let tspan = text
      .text(null)
      .append("tspan")
      .attr("x", x)
      .attr("y", y)
      .attr("dy", dy + "em");
    const wordsLength = word?.split(" ").length;

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (wordsLength > 0 && tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", (++lineNumber / 1.25) * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
};

export function debounce(func) {
  let timer;
  return function (event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, 100, event);
  };
}

export function calculateMaxCharacters(width, fontSize, padding = 0.9) {
  const availableWidth = width * padding; // Adjust padding as needed
  const avgCharacterWidth = fontSize * 0.55; // Adjust factor as needed
  return Math.floor(availableWidth / avgCharacterWidth);
}
