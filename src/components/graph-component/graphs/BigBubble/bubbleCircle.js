import * as d3 from "d3";
import { initialValues } from "../utils/graphConst";
import { setUpEvents } from "../utils/graphEvents";

function getLuminance(color) {
  const rgb = d3.rgb(color);
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

function getContrastingTextColor(color) {
  if (color) {
    const luminance = getLuminance(color);
    const threshold = 0.5;
    return luminance < threshold ? "#fff" : "#777";
  }
  return "#777";
}

export const bubbleCircle = function bubbleCircle() {
  let config = {
    ...initialValues,
    hoverCircle: false,
    strokeOnHover: false,
  };

  const t = d3
    .transition()
    .delay(function (d, i) {
      return i * 3;
    })
    .duration(config.duration);

  function graph(selected) {
    selected.each(function (data) {
      const dataSet = { children: [] };
      data.forEach((element, i) => {
        dataSet.children.push({ children: element });
      });

      const packLayout = d3.pack().size([config.graphAreaW, config.graphAreaH]);

      const rootNode = d3.hierarchy(dataSet).sum(function (d) {
        return d.value;
      });

      packLayout(rootNode);

      const nodes = rootNode.descendants().filter((obj) => !obj.children);

      selected
        .selectAll("circle")
        .data(nodes)
        .join(
          (enter) =>
            enter
              .append("circle")
              .attr("class", (d) =>
                d.children ? "bubble-circle-parent" : "bubble-circle"
              )
              .style("fill", (d) => d.data.color)
              .style("opacity", config.opacity || "0.8")
              .style("stroke", "white")
              .attr("data-depth", (d) => d.depth)
              .attr("cx", (d) => d.x)
              .attr("cy", (d) => d.y)
              .attr("r", 0)
              .on("mouseover", function (event, d) {
                const fillColor = d.data.color;
                if (config.strokeOnHover) {
                  d3.select(this)
                    .attr("stroke", "#000")
                    .attr("stroke-width", 0.5);
                }

                if (config.hoverCircle) {
                  d3.select(this.parentNode)
                    .append("circle")
                    .attr("class", "hover-circle")
                    .attr("cx", d.x)
                    .attr("cy", d.y)
                    .attr("r", d.r * 1.2)
                    .style("fill", fillColor)
                    .style("opacity", 0.4)
                    .style("stroke", "none")
                    .style("pointer-events", "none");
                }
              })
              .on("mouseout", function (event, d) {
                if (config.strokeOnHover) {
                  d3.select(this).attr("stroke", "white");
                }

                if (config.hoverCircle) {
                  d3.select(this.parentNode)
                    .select("circle.hover-circle")
                    .remove();
                }
              })
              .transition(t)
              .attr("r", (d) => d.r),
          (update) => update,
          (exit) => {
            exit.transition(t).attr("r", 0).remove();
          }
        )
        .transition(t)
        .style("fill", (d) => d.data.color)
        .style("opacity", config.opacity)
        .style("stroke", "white")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => d.r);

      if (!config.hideInnerValues) {
        const bubbleLabels = selected
          .selectAll(".bubble-label")
          .data(nodes)
          .join(
            (enter) =>
              enter
                .append("text")
                .attr("class", "bubble-label")
                .style("text-anchor", "middle")
                .style("font-size", "12px")
                .style("fill", (d) => getContrastingTextColor(d.data.color))
                .text((d) => d.data.label),
            (update) => update,
            (exit) => {
              exit.transition(t).style("opacity", 0).remove();
            }
          )
          .transition(t)
          .style("opacity", 1)
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y);

        const bubbleValues = selected
          .selectAll(".bubble-value")
          .data(nodes)
          .join(
            (enter) =>
              enter
                .append("text")
                .attr("class", "bubble-value")
                .style("text-anchor", "middle")
                .style("font-size", "12px")
                .style("fill", (d) => getContrastingTextColor(d.data.color))
                .text((d) => d.data.value),
            (update) => update,
            (exit) => {
              exit.transition(t).style("opacity", 0).remove();
            }
          )
          .transition(t)
          .style("opacity", 1)
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y)
          .each(function (d) {
            const text = d3.select(this);
            const rect = text.node().getBBox();
            const { height, width } = rect;
            const dy = height * 0.8;
            text.attr("dy", dy);
            if (width > d.r || d.r < 20) {
              text.attr("visibility", "hidden");
            } else {
              text.attr("visibility", "visible");
            }
          });

        bubbleLabels.each(function (d, i) {
          const text = d3.select(this);
          const rect = text.node().getBBox();
          const { height, width } = rect;

          const label = d3.select(this);
          const value = bubbleValues.nodes()[i];
          const labelRect = label.node().getBBox();
          const valueRect = value.getBBox();

          const totalWidth = Math.max(labelRect.width, valueRect.width);
          const totalHeight = labelRect.height + valueRect.height;

          const dy = height * 0.2;
          text.attr("dy", -dy);

          if (totalWidth > d.r || totalHeight > d.r || d.r < 20) {
            label.attr("visibility", "hidden");
            value.style.visibility = "hidden";
          } else {
            label.attr("visibility", "visible");
            value.style.visibility = "visible";
          }
        });
      }

      setUpEvents(config, selected, "bubble-circle");
    });

    return selected;
  }

  graph.config = function graphConfig(val) {
    if (!arguments.length) {
      return config;
    }
    config = Object.assign(config, val);
    return graph;
  };

  return graph;
};
