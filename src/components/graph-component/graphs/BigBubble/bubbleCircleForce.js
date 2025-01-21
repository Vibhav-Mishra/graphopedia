import * as d3 from "d3";
import { initialValues } from "../utils/graphConst";
import { setUpEvents } from "../utils/graphEvents";

export const bubbleCircleForce = function bubbleCircleForce() {
  let config = {
    ...initialValues,
    spaceBetweenCircle: 3,
    forceEnable: false,
    hoverCircle: false,
    strokeOnHover: false,
  };

  function graph(selected) {
    selected.each(function (data) {
      const dataSet = { children: [] };
      data.forEach((element, i) => {
        dataSet.children.push({ children: element });
      });

      // location to centre the bubbles
      const centre = { x: config.graphAreaW / 2, y: config.graphAreaH / 2 };
      // strength to apply to the position forces
      const forceStrength = 0.03;
      // charge is dependent on size of the bubble, so bigger towards the middle
      function charge(d) {
        return Math.pow(d.radius, 2.0) * 0.01;
      }
      const spaceBetweenCircle = config.forceEnable ? 0 : 5;
      // create a force simulation and add forces to it
      const simulation = d3
        .forceSimulation()
        .force("charge", d3.forceManyBody().strength(charge))
        .force("center", d3.forceCenter(centre.x, centre.y))
        .force("x", d3.forceX().strength(forceStrength).x(centre.x))
        .force("y", d3.forceY().strength(forceStrength).y(centre.y))
        .force(
          "collision",
          d3.forceCollide().radius((d) => d.radius + spaceBetweenCircle)
        );

      // force simulation starts up automatically, which we don't want as there aren't any nodes yet
      simulation.stop();

      const packLayout = d3
        .pack()
        .size([config.graphAreaW, config.graphAreaH])
        .padding(10);

      const rootNode = d3.hierarchy(dataSet).sum(function (d) {
        return d.value;
      });

      packLayout(rootNode);

      const nodes = rootNode
        .descendants()
        .filter((obj) => !obj.children)
        .map((d) => ({
          ...d,
          radius: d.r,
          x: d3.randomInt(0, config.graphAreaW),
          y: d3.randomInt(0, config.graphAreaH),
        }));

      selected
        .selectAll(".bubble-group")
        .data(nodes, (d) => d.id)
        .join(
          (enter) => {
            const bubble = enter.append("g").attr("class", "bubble-group");

            const bubbles = bubble
              .append("circle")
              .attr("class", "bubble-group-circle")
              .classed("bubble", true)
              .attr("r", (d) => d.radius)
              .style("fill", (d, i) => d.data.color)
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
                    .attr("r", d.radius * 1.2)
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
              });

            // Add labels
            bubble
              .append("text")
              .attr("class", "bubble-label")
              .style("text-anchor", "middle")
              .style("font-size", "12px")
              .style("fill", (d) => getContrastingTextColor(d.data.color))
              .text((d) => d.data.label);

            // Add values
            bubble
              .append("text")
              .attr("class", "bubble-value")
              .style("text-anchor", "middle")
              .style("font-size", "12px")
              .style("fill", (d) => getContrastingTextColor(d.data.color))
              .text((d) => d.data.value);

            simulation.nodes(nodes).on("tick", ticked).restart();

            function ticked() {
              bubbles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

              // Position labels and values with 10px gap
              bubble
                .selectAll(".bubble-label")
                .attr("x", (d) => d.x)
                .attr("y", (d) => d.y - 7.5) // Adjust y position for the label
                .attr("visibility", (d) =>
                  d.radius < 30 ? "hidden" : "visible"
                );

              bubble
                .selectAll(".bubble-value")
                .attr("x", (d) => d.x)
                .attr("y", (d) => d.y + 7.5) // Adjust y position for the value
                .attr("visibility", (d) =>
                  d.radius < 30 ? "hidden" : "visible"
                );
            }
          },
          (update) => update,
          (exit) => {
            exit.remove();
          }
        );

      setUpEvents(config, selected, "bubble-group");
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

function getContrastingTextColor(color) {
  if (color) {
    const luminance = getLuminance(color);
    const threshold = 0.5;
    return luminance < threshold ? "#fff" : "#777";
  }
  return "#777";
}

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
