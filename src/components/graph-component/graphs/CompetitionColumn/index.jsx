import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

const CompetitionColumn = ({ data, config }) => {
  const [sortedData, setSortedData] = useState([]);
  const svgRef = useRef(null);

  useEffect(() => {
    if (config.enableRankSorted) {
      // Sort the data array by downloadSpeed in descending order
      const sorted = [...data].sort(
        (a, b) => b.downloadSpeed - a.downloadSpeed
      );

      // Rearrange the array: second highest at index 0, max at index 1, min at index 2
      if (sorted.length >= 3) {
        const maxData = sorted[0]; // Max value
        const secondMaxData = sorted[1]; // Second highest value
        const minData = sorted[sorted.length - 1]; // Min value
        const restData = sorted.slice(2, sorted.length - 1); // Rest of the data

        const rearrangedData = [secondMaxData, maxData, minData, ...restData];

        setSortedData(rearrangedData);
      } else {
        setSortedData(sorted);
      }
    } else {
      setSortedData(data);
    }
  }, [data]);

  const getFontSizeByPercentage = (percentage, baseFontSize) => {
    return `${baseFontSize * (percentage / 100)}px`;
  };

  useEffect(() => {
    if (!sortedData.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 10, right: 0, bottom: 20, left: 0 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const maxDownloadSpeed = d3.max(sortedData, (d) => d.downloadSpeed);

    // Calculate the percentage of each bar height relative to the maximum download speed
    const percentageData = sortedData.map((d) => ({
      company: d.company,
      percentage: Math.round((d.downloadSpeed / maxDownloadSpeed) * 100),
    }));

    const xScale = d3
      .scaleBand()
      .domain(sortedData.map((d) => d.company))
      .range([0, innerWidth])
      .padding(config.barPadding || 0); // Small padding for visual separation

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(sortedData, (d) => d.downloadSpeed)])
      .nice()
      .range([innerHeight, 0]);

    const svgContent = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svgContent
      .selectAll(".bar")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.company))
      .attr("y", innerHeight) // Start at the bottom
      .attr("width", xScale.bandwidth())
      .attr("height", 0) // Initial height is zero
      .attr("fill", (d) => d.color)
      .transition() // Add transition for animation
      .duration(1000)
      .attr("y", (d) => yScale(d.downloadSpeed))
      .attr("height", (d) => innerHeight - yScale(d.downloadSpeed));

    // Create a group for download speed and "mbps" text
    svgContent
      .selectAll(".textGroup")
      .data(sortedData)
      .enter()
      .append("g")
      .attr("class", "textGroup")
      .attr(
        "transform",
        (d) =>
          `translate(${xScale(d.company) + xScale.bandwidth() / 3 - 4}, ${
            yScale(d.downloadSpeed) - 7
          })`
      ); // Position the group

    // Add download speed text
    svgContent
      .selectAll(".textGroup")
      .append("text")
      .attr("class", "downloadSpeed")
      .attr("x", 0) // Centered within the group
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("font-size", config.valueNumberFontSize || "14px")
      .attr("fill", config.valueNumberFontColor || "#000")
      .attr("font-weight", config.valueNumberFontWeight || "normal") // Default to 'normal' if not specified
      .attr("font-family", config.valueNumberFontFamily || "Arial") // Default to 'Arial' if not specified
      .text((d) => `${d.downloadSpeed}`);

    // Add "mbps" text
    svgContent
      .selectAll(".textGroup")
      .append("text")
      .attr("class", "downloadSpeedUnit")
      .attr("x", config.unitNumberSpace) // Position based on download speed text width + spacing
      .attr("y", 0)
      .attr("text-anchor", "start")
      .attr("font-size", config.unitNumberFontSize || "12px") // Different size for "mbps"
      .attr("fill", config.unitNumberFontColor || "#000")
      .attr("font-weight", config.unitNumberFontWeight || "normal") // Default to 'normal' if not specified
      .attr("font-family", config.unitNumberFontFamily || "Arial") // Default to 'Arial' if not specified
      .text((d) => d.unit);

    // Add company name text
    svgContent
      .selectAll(".companyName")
      .data(sortedData)
      .enter()
      .append("text")
      .attr("class", "companyName")
      .attr("x", (d) => xScale(d.company) + xScale.bandwidth() / 2)
      .attr("y", innerHeight + 15)
      .attr("text-anchor", "middle")
      .attr("font-size", config.companyFontSize || "12px") // Different size for "mbps"
      .attr("fill", config.companyFontColor || "#000")
      .attr("font-weight", config.companyFontWeight || "normal") // Default to 'normal' if not specified
      .attr("font-family", config.companyFontFamily || "Arial") // Default to 'Arial' if not specified
      .text((d) => d.company);

    // Sort data by downloadSpeed to assign ranking
    const sortedDataRank = sortedData
      .slice()
      .sort((a, b) => b.downloadSpeed - a.downloadSpeed);

    // Add ranking number text
    svgContent
      .selectAll(".ranking")
      .data(sortedData)
      .enter()
      .append("text")
      .attr("class", "ranking")
      .attr("x", (d) => xScale(d.company) + xScale.bandwidth() / 2)
      .attr("y", innerHeight - config.rankNumberPositionY)
      .attr("text-anchor", "middle")
      .attr("font-size", (d) => {
        if (config.enableRankTextResizer) {
          const percentage = percentageData.find(
            (item) => item.company === d.company
          ).percentage;
          return getFontSizeByPercentage(percentage, config.rankNumberFontSize);
        } else {
          return config.rankNumberFontSize;
        }
      })
      .attr("font-weight", config.rankNumberFontWeight || "normal") // Default to 'normal' if not specified
      .attr("font-family", config.rankNumberFontFamily || "Arial") // Default to 'Arial' if not specified
      .attr("fill", `rgba(255, 255, 255,0.7)`)
      .text(
        (d) =>
          sortedDataRank.findIndex((item) => item.company === d.company) + 1
      );
  }, [data, sortedData, config]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
    </div>
  );
}

CompetitionColumn.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      company: PropTypes.string.isRequired,
      downloadSpeed: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  config: PropTypes.shape({
    barPadding: PropTypes.number,
    rankNumberFontSize: PropTypes.number,
    rankNumberFontWeight: PropTypes.number,
    rankNumberFontFamily: PropTypes.string,
    rankNumberPositionY: PropTypes.number,
    enableRankTextResizer: PropTypes.bool,
    enableRankSorted: PropTypes.bool,
    valueNumberFontSize: PropTypes.number,
    valueNumberFontWeight: PropTypes.number,
    valueNumberFontFamily: PropTypes.string,
    valueNumberFontColor: PropTypes.string,
    unitNumberFontSize: PropTypes.number,
    unitNumberFontWeight: PropTypes.number,
    unitNumberFontFamily: PropTypes.string,
    unitNumberFontColor: PropTypes.string,
    unitNumberSpace: PropTypes.number,
    companyFontSize: PropTypes.number,
    companyFontWeight: PropTypes.number,
    companyFontFamily: PropTypes.string,
    companyFontColor: PropTypes.string,
  }),
};

export default CompetitionColumn;
