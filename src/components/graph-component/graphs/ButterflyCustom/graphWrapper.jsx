import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import ResizeHandlerHOC from "../utils/resizeHandlerHOC";
import { MainWrapper } from "./index.sc";

const ButterFlyGraphCustom = ({
  data,
  barBackGroundColor,
  barHeight,
  CenterGap = 12,
  TextGap = 10,
  isPercent = true,
  labelFontSize = 14,
  iconSize = 20,
  iconSpacing = 2,
  labelFontWeight = 700,
  valueFontWeight = 700,
  categoryFontSize = 17,
  categoryFontWeight = 17,
  fontFamilyLabel = "Inter",
  fontFamilyValue = "Inter",
  // labelValueGap = 1,
  valueFontSize = 10,
  backgroundOpacity = 0.1,
  barInnerPadding = 0.2,
  labelColor = "#707c8b",
  valueColor = "#707c8b",
  categoryColor = "#000",
  events,
  textalignmentXaxis = 0.1,
  textalignmentYaxis = 0,
  backgroundOpacityShow = true,
  legendPosition = "bottom",
  customBarHeight = 11.25,
  subTitleGap = 8,
  rerender,
}) => {
  const graphRef = useRef(null);
  var backgroundOpacity = backgroundOpacityShow ? backgroundOpacity : 0;

  useEffect(() => {
    if (!data || !data.length) return;
    const svg = d3
      .select(graphRef.current)
      .append("svg")
      .attr("class", "butterfly-svg");

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = graphRef.current.clientWidth - margin.left - margin.right;
    const height = graphRef.current.clientHeight - margin.top - margin.bottom;

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const xScaleLTE = d3
      .scaleLinear()
      .domain([0, 100])
      // .domain([100, 0])
      .range([width / 2 + CenterGap / 2, width]);

    const xScale5G = d3
      .scaleLinear()
      .domain([100, 0])
      .range([0, width / 2 - CenterGap / 2]);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, height + customBarHeight])
      .padding(barInnerPadding);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Background color bar
    g.selectAll(".background")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "background")
      .attr("y", (d) => yScale(d.label))
      .attr("x", (d) => (d.category === "LTE" ? xScaleLTE(0) : xScale5G(100)))
      .attr("width", (d) =>
        d.category === "LTE"
          ? xScaleLTE(100) - xScaleLTE(0)
          : xScale5G(0) - xScale5G(100)
      )
      .attr("height", barHeight ? barHeight : yScale.bandwidth())
      .attr("fill", (d) => barBackGroundColor)
      .attr("opacity", backgroundOpacity)
      .attr("z-index", -1)
      .on("mousemove", function (e, d) {
        events.handleMouseEnter(e.clientX, e.clientY, d);
      })
      .on("mouseleave", function () {
        events.handleMouseLeave();
      });

    // colored bar
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", (d) => {
        return yScale(d.label);
      })
      .attr("x", (d) => (d.category === "LTE" ? xScaleLTE(0) : width / 2))
      .attr("width", () => 0)
      // .attr("height", yScale.bandwidth())
      .attr("fill", (d) => d.color)
      .attr("z-index", 1)
      .on("mousemove", function (e, d) {
        events.handleMouseEnter(e.clientX, e.clientY, d);
      })
      .on("mouseleave", function () {
        events.handleMouseLeave();
      })
      .transition()
      .duration(1000)
      .attr("x", (d) =>
        d.category === "LTE" ? xScaleLTE(0) : xScale5G(d.value)
      )
      .attr("width", (d) =>
        d.category === "LTE"
          ? xScaleLTE(d.value) - xScaleLTE(0)
          : xScale5G(0) - xScale5G(d.value)
      )
      .attr("height", barHeight ? barHeight : yScale.bandwidth())
      .attr("fill", (d) => d.color)
      .attr("z-index", 1);

    // Function to calculate text width
    function getTextWidth(text, fontSize) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.font = `${fontSize}px ${fontFamilyLabel}`;
      return context.measureText(text).width;
    }

    // Define spacing between logo and text
    const spacing = iconSpacing; // Adjust this value as needed

    // Select and append logo and text for "LTE" category
    g.selectAll(".label-group")
      .data(data.filter((d) => d.category === "LTE")) // Filter data to include only "LTE" category
      .enter()
      .append("g")
      .attr("class", "label-group")
      .attr("transform", (d) => {
        // Calculate text width
        const textWidth = getTextWidth(d.label, labelFontSize);

        // Define the size of the logo
        const logoSize = iconSize; // Set logo size to match text size

        // Total width of the group
        const totalWidth = textWidth + spacing;

        // Position the group based on label
        const y = yScale(d.label) - labelFontSize / 2; // Center text vertically
        const x = width / 2 - totalWidth / 2; // Center horizontally considering total width
        return `translate(${x}, ${y})`;
      })
      .each(function (d) {
        const group = d3.select(this);

        // Define the size of the logo
        const logoSize = iconSize; // Set logo size to match text size

        // Append the logo SVG
        group
          .append("g")
          .attr("class", "logo")
          .html(d.logoSVG) // Insert the SVG directly
          .attr("width", logoSize) // Set width of SVG to match text size
          .attr("height", logoSize) // Set height of SVG to match text size
          .attr(
            "transform",
            `translate(-${logoSize / 2}, -${labelFontSize / 1.3}) scale(${
              logoSize / 25
            })`
          );
        // group.select("svg").selectAll("*").attr("fill", labelColor);

        // Append the text label
        group
          .append("text")
          .attr("class", "label")
          .attr("y", 0) // Vertically align with the middle of the logo
          .attr("x", spacing+5) // Position text to the right of the logo
          .text((d) => d.label)
          .attr("text-anchor", "start") // Align text to the start
          .style("font-family", fontFamilyLabel)
          .style("font-size", labelFontSize)
          .style("fill", labelColor)
          .style("font-weight", labelFontWeight);
      });

    // values
    g.selectAll(".value")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "value")
      .attr("y", (d) => yScale(d.label) + barHeight / 2) // Center vertically
      .attr("x", (d) =>
        d.category === "LTE"
          ? width - margin.left + TextGap
          : margin.right - TextGap
      )
      .text((d) => d.value)
      .attr("text-anchor", (d) => (d.category === "LTE" ? "end" : "start"))
      .style("font-family", fontFamilyValue)
      .style("font-size", valueFontSize)
      .style("fill", valueColor)
      .style("font-weight", valueFontWeight)
      .text((d) => d.value)
      .style("font-size", function (d) {
        const barHeight = yScale.bandwidth();
        const fontSize = Math.min(valueFontSize, barHeight * 0.8);
        return fontSize;
      })
      .attr("alignment-baseline", "middle")
      .attr("dominant-baseline", "middle")
      .append("tspan")
      .text(isPercent ? "%" : "")
      .style("font-size", function (d) {
        const barHeight = yScale.bandwidth();
        const fontSize = Math.min(valueFontSize, (barHeight / 2.5) * 0.8);
        return fontSize;
      })
      .attr("dy", `${textalignmentYaxis}em`)
      .attr("dx", `${textalignmentXaxis}em`);

    // 5G
    svg
      .append("text")
      .attr("x", margin.right + xScale5G(100))
      .attr("y", margin.top - subTitleGap)
      .text("5G")
      .attr("font-size", categoryFontSize)
      .attr("text-anchor", "start")
      .style("font-family", "TeleNeo Office")
      .style("font-weight", categoryFontWeight)
      .style("fill", categoryColor);

    // LTE
    svg
      .append("text")
      .attr("x", margin.right + xScaleLTE(100))
      .attr("y", margin.top - subTitleGap)
      .text("LTE")
      .attr("font-size", categoryFontSize)
      .attr("text-anchor", "end")
      .style("font-family", "TeleNeo Office")
      .style("font-weight", categoryFontWeight)
      .style("fill", categoryColor);

    return () => {
      svg.remove();
    };
  }, [
    data,
    barBackGroundColor,
    barHeight,
    CenterGap,
    TextGap,
    isPercent,
    labelFontSize,
    iconSize,
    iconSpacing,
    labelFontWeight,
    valueFontSize,
    valueFontWeight,
    categoryFontSize,
    categoryFontWeight,
    fontFamilyLabel,
    fontFamilyValue,
    barInnerPadding,
    backgroundOpacity,
    // labelValueGap,
    categoryColor,
    valueColor,
    labelColor,
    textalignmentXaxis,
    textalignmentYaxis,
    legendPosition,
    rerender,
  ]);

  return <MainWrapper ref={graphRef}></MainWrapper>;
};

export default ResizeHandlerHOC(ButterFlyGraphCustom);
