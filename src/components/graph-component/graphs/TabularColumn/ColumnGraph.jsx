import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const ColumnGraph = ({ data, config }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous content

    const width = ref.current.clientWidth;
    const height = ref.current.clientHeight;
    const margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
    const graphHeight = height - margin.top - margin.bottom;
    const graphWidth = width - margin.left - margin.right;

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.type))
      .range([0, graphWidth])
      .padding(config.barGap || 0.5);

    const y = d3
      .scaleLinear()
      .domain([0, 100]) // Use max values for scaling
      .nice()
      .range([graphHeight, 0]);

    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left + config.barAlignMentXOffset},${
          margin.top + config.barAlignMentYOffset
        })`
      );

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.type))
      .attr("y", (d) => graphHeight)
      .attr("width", config.barWidth ? config.barWidth : x.bandwidth())
      .attr("height", 0)
      .attr("fill", (d) => d.color)
      .transition()
      .duration(500) // Duration of animation
      .attr("y", (d) => y(d.value)) // Final y position
      .attr("height", (d) => graphHeight - y(d.value)); // Final height
  }, [data]);

  return <svg ref={ref} width="100%" height="100%" viewBox="0 0 100 150"></svg>;
};

export default ColumnGraph;
