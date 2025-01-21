import * as d3 from "d3";
import { colorBox, initialValues } from "../utils/graphConst"; // colorBox,
import { setUpEvents } from "../utils/graphEvents";
import usMapData from "./usMapData.json";

export const usMap = function usMap() {
  let config = {
    ...initialValues,
    interpolateColors: [colorBox[0], colorBox[1]],
    strokeWidth: 1,
    strokeColor: "#fff",
  };

  function graph(selected) {
    selected.each(function (data) {
      usMapData.features.forEach((feature) => {
        const matchingData = data.find(
          (item) => item.label === feature.properties.STATE
        );
        if (matchingData) {
          feature.properties.value = matchingData.value;
        }
      });

      const projection = d3
        .geoAlbersUsa()
        .fitSize(
          [config.width, config.height * (config.heightRatio || 0.8)],
          usMapData
        );

      const pathGenerator = d3.geoPath().projection(projection);

      const sampleMap = usMapData.features.map((item) => {
        return Number(item.properties.value);
      });

      // Get min and max values
      const minValue = d3.min(sampleMap);
      const maxValue = d3.max(sampleMap);

      const colorScale = d3
        .scaleLinear()
        .domain([minValue, maxValue]) // pass the whole dataset to a scaleQuantile’s domain
        .range(config.interpolateColors);

      selected
        .selectAll(".usmap-path")
        .data(usMapData.features)
        .join(
          (enter) => {
            enter
              .append("path")
              .attr("class", "usmap-path")
              .attr("d", (d) => pathGenerator(d))
              .attr("stroke-width", config.strokeWidth)
              .attr("stroke", config.strokeColor)
              .style("fill", function (d, i) {
                const uRate = d.properties.value;
                return uRate ? colorScale(uRate) : config.defaultColor;
              });
          },
          (update) =>
            update
              .attr("d", (d) => pathGenerator(d))
              .attr("stroke-width", config.strokeWidth)
              .attr("stroke", config.strokeColor)
              .style("fill", function (d, i) {
                const uRate = d.properties.value;
                return uRate ? colorScale(uRate) : config.defaultColor;
              }),
          (exit) => {
            exit.remove();
          }
        );

      setUpEvents(config, selected, "usmap-path");
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
