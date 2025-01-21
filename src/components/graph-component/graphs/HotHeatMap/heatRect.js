import * as d3 from "d3";
import { initialValues } from "../utils/graphConst";
import { setUpEvents } from "../utils/graphEvents";

export const heatRect = function heatRect() {
  let config = {
    ...initialValues,
    interpolateColors: ["red", "yellow", "blue"],
    xGutterSpace: 2,
    yGutterSpace: 2,
    enableDisplayLabels: false,
  };

  const t = d3
    .transition()
    .delay(function (d, i) {
      return i * 3;
    })
    .duration(config.duration);
  // draw the graph here
  function graph(selected) {
    selected.each(function (data) {
      // Build color scale
      const domainMaker = config.interpolateColors.map((color, i) => {
        return parseFloat(i / (config.interpolateColors.length - 1)).toFixed(2);
      });
      const colorScale = d3
        .scaleLinear()
        .domain(domainMaker)
        .range(config.interpolateColors)
        .interpolate(d3.interpolateRgb.gamma(2.2));

      selected
        .selectAll(".heat-group")
        .data(data)
        .join(
          (enter) => {
            enter.append("g").attr("class", "heat-group");
          },
          (update) => update,
          (exit) => {
            exit.remove();
          }
        );

      selected
        .selectAll(".heat-group")
        .selectAll(".column-rect")
        .data((d, i) => {
          d.map((entry) => {
            const temp = JSON.parse(JSON.stringify(entry));
            temp.labelIndex = i;
            return temp;
          });
          return d;
        })
        .join(
          (enter) => {
            enter
              .append("g")
              .attr("class", "column-rect-grp")
              .append("rect")
              .attr("class", "column-rect")
              .attr("height", 0)
              .attr("width", 0)
              .attr("x", (d) => {
                return config.xScale(d.labelText);
              })
              .attr("y", (d) => {
                return config.yScale(d.label);
              })
              .transition(t)
              .style("fill", (d, i) => {
                return colorScale(
                  d.value / (config.maxY === 0 ? 1 : config.maxY)
                );
              })
              .attr("data-ltext", (d) => d.labelText)
              .attr("data-dlabel", (d) => d.displayLabel)
              .attr("data-value", (d) => d.value)
              .attr("data-label", (d) => d.label)
              .attr("height", config.yWidth - config.xGutterSpace)
              .attr("width", config.xWidth - config.yGutterSpace);
          },
          (update) => update,
          (exit) => {
            exit.transition(t).attr("height", 0).attr("width", 0).remove();
          }
        )
        .transition(t)
        .style("fill", (d, i) =>
          colorScale(d.value / (config.maxY === 0 ? 1 : config.maxY))
        )
        .attr("data-ltext", (d) => d.labelText)
        .attr("data-dlabel", (d) => d.displayLabel)
        .attr("data-value", (d) => d.value)
        .attr("data-label", (d) => d.label)
        .attr("x", (d) => {
          return config.xScale(d.labelText);
        })
        .attr("y", (d) => {
          return config.yScale(d.label);
        })
        .attr("height", config.yWidth - config.xGutterSpace)
        .attr("width", config.xWidth - config.yGutterSpace);
      if (config.enableDisplayLabels) {
        selected
          .selectAll(".heat-group")
          .selectAll(".column-rect-grp")
          .selectAll(".column-rect-label")
          .data((d) => [d])
          .join((enter) => {
            enter
              .append("text")
              .attr("class", "column-rect-label")
              .attr("x", (d) => {
                return config.xScale(d.labelText);
              })
              .attr("y", (d) => {
                return config.yScale(d.label);
              })
              .attr("font-size", 0)
              .style("text-anchor", "middle")
              .text((d) => {
                return d.displayLabel;
              })
              .transition(t)
              .attr("x", (d) => {
                return (
                  config.xScale(d.labelText) +
                  (config.xWidth - config.yGutterSpace) / 2
                );
              })
              .attr("y", (d) => {
                return (
                  config.yScale(d.label) +
                  config.fontSize / 3 +
                  (config.yWidth - config.xGutterSpace) / 2
                );
              })
              .attr("font-size", config.fontSize);
          })
          .attr("x", (d) => {
            return config.xScale(d.labelText);
          })
          .attr("y", (d) => {
            return config.yScale(d.label);
          })
          .attr("font-size", 0)
          .style("text-anchor", "middle")
          .text((d) => {
            return d.displayLabel;
          })
          .transition(t)
          .attr("x", (d) => {
            return (
              config.xScale(d.labelText) +
              (config.xWidth - config.yGutterSpace) / 2
            );
          })
          .attr("y", (d) => {
            return (
              config.yScale(d.label) +
              config.fontSize / 3 +
              (config.yWidth - config.xGutterSpace) / 2
            );
          })
          .attr("font-size", config.fontSize);
      }
      setUpEvents(config, selected, config.selectionClass || "column-rect-grp");
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
