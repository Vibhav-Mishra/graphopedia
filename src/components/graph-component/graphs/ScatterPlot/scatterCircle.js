import * as d3 from "d3";
import ColorParser from "../utils/colorParser";
import { initialValues } from "../utils/graphConst";
import { setUpEvents } from "../utils/graphEvents";

export const scatterCircle = function scatterCircle() {
  let config = {
    ...initialValues,
    highlight: false,
    shape: "circle",
    strokeOnHover: false,
    hoverCircle: false,
    transformOnHover: false,
  };

  const shapePaths = {
    triangle: (size) => {
      const height = Math.sqrt(3) * size;
      return `M 0 ${-height / 2} L ${-size} ${height / 2} L ${size} ${
        height / 2
      } Z`;
    },
    square: (size) =>
      `M ${-size} ${-size} L ${size} ${-size} L ${size} ${size} L ${-size} ${size} Z`,
    circle: (size) =>
      d3
        .symbol()
        .type(d3.symbolCircle)
        .size(size * size)(),
  };

  // draw the graph here
  function graph(selected) {
    selected.each(function (data) {
      // const circleGrps = selected.selectAll("circle").data(data);
      // circleGrps.exit().remove();

      // circleGrps
      //   .enter()
      //   .append("circle")
      //   .merge(circleGrps)
      //   .attr("cx", config.x)
      //   .attr("cy", config.graphAreaH)
      //   .attr("r", config.r)
      //   .style("fill", function (d) {
      //     return d.color ? ColorParser(d.color) : "#000";
      //   })
      //   .transition()
      //   .delay(function (d, i) {
      //     return i * 3;
      //   })
      //   .duration(config.duration)
      //   .attr("cy", config.y);

      const t = d3
        .transition()
        .delay(function (d, i) {
          return i * 3;
        })
        .duration(config.duration);
      const thresholdScale = d3
        .scaleLinear()
        .domain([
          d3.min(data, (d) => d.thresholdValue),
          d3.max(data, (d) => d.thresholdValue),
        ])
        .range([3, 9]);
      selected
        .selectAll("path.shape")
        .data(data)
        .join(
          (enter) => {
            enter
              .append("path")
              .attr("class", "shape")
              .attr("d", (d) => {
                const size =
                  d.thresholdValue > d.value
                    ? thresholdScale(d.thresholdValue)
                    : config.r;
                return shapePaths[config.shape](size);
              })
              .attr(
                "transform",
                (d) => `translate(${config.x(d)},${config.graphAreaH})`
              )
              .style("fill", function (d) {
                return d.color ? ColorParser(d.color) : "#000";
              })
              .on("mouseover", function (event, d) {
                const fillColor = d.color ? ColorParser(d.color) : "#000";
                if (config.transformOnHover) {
                  d3.select(this)
                    .transition()
                    .duration(200)
                    .attr(
                      "transform",
                      (d) =>
                        `translate(${config.x(d)},${config.y(d)}) scale(1.5)`
                    );
                }

                if (config.strokeOnHover) {
                  d3.select(this)
                    .attr("stroke", "#000")
                    .attr("stroke-width", 0.5);
                }

                if (config.hoverCircle) {
                  d3.select(this.parentNode)
                    .append("circle")
                    .attr("class", "hover-circle")
                    .attr("cx", config.x(d))
                    .attr("cy", config.y(d))
                    .attr("r", config.r * 3)
                    .style("fill", fillColor)
                    .style("opacity", 0.2)
                    .style("stroke", "none")
                    .style("pointer-events", "none");
                }

                if (config.highlight) {
                  const selectedColor = ColorParser(d.color);
                  d3.selectAll("path.shape").style("opacity", 0.2);
                  d3.selectAll("path.shape")
                    .filter(function (data) {
                      return ColorParser(data.color) === selectedColor;
                    })
                    .style("opacity", 1);
                }
              })
              .on("mouseout", function (event, d) {
                if (config.transformOnHover) {
                  d3.select(this)
                    .transition()
                    .duration(200)
                    .attr(
                      "transform",
                      (d) => `translate(${config.x(d)},${config.y(d)}) scale(1)`
                    );
                }

                if (config.strokeOnHover) {
                  d3.select(this).attr("stroke", "none");
                }

                if (config.hoverCircle) {
                  d3.select(this.parentNode)
                    .select("circle.hover-circle")
                    .remove();
                }

                if (config.highlight) {
                  d3.selectAll("path.shape").style("opacity", 1);
                }
              })
              .transition(t)
              .attr(
                "transform",
                (d) => `translate(${config.x(d)},${config.y(d)})`
              );
          },
          (update) => update,
          (exit) => exit.transition(t).attr("d", "").remove()
        );

      setUpEvents(config, selected, "shape");
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
