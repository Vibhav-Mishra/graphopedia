import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import ResizeHandlerHOC from "../../utils/resizeHandlerHOC";
import { MainWrapper } from "./index.sc";

const ButterFlyGraph = ({
  data,
  CenterGap = 12,
  TextGap = 10,
  isPercent = true,
  labelFontSize = 7,
  labelFontWeight = 700,
  valueFontWeight = 700,
  categoryFontSize = 17,
  categoryFontWeight = 17,
  fontFamilyLabel = "TeleNeo Office",
  fontFamilyValue = "TeleNeo Office",
  labelValueGap = 1,
  valueFontSize = 14,
  backgroundOpacity = 0.1,
  barInnerPadding = 0.2,
  TextTopMargin = 8,
  labelColor = "#000",
  valueColor = "#000",
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
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => d.color)
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
      .attr("height", yScale.bandwidth())
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
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => d.color)
      .attr("z-index", 1);

    // Text label
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr(
        "y",
        (d) => yScale(d.label) + yScale.bandwidth() / 3.5
        // labelFontSize +
        // TextTopMargin
      )
      .attr("x", (d) =>
        d.category === "LTE"
          ? width - margin.left + TextGap
          : margin.right - TextGap
      )
      .text((d) => d.label)
      .attr("text-anchor", (d) => (d.category === "LTE" ? "end" : "start"))
      .style("font-family", fontFamilyLabel)
      // .style("font-size", labelFontSize)
      .style("font-size", function (d) {
        const barHeight = yScale.bandwidth();
        const fontSize = Math.min(labelFontSize, barHeight / 3);
        return fontSize;
      })
      .attr("alignment-baseline", "middle")
      .attr("dominant-baseline", "middle")
      .style("fill", labelColor)
      .style("font-weight", labelFontWeight);

    // values
    g.selectAll(".value")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "value")
      .attr("y", function (d) {
        const barHeight = yScale.bandwidth();
        const fontSize = Math.min(labelFontSize, barHeight / 3);

        return (
          yScale(d.label) + +labelValueGap + yScale.bandwidth() / 2.5 + fontSize
        );
      })
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
      .attr("x", margin.left + xScale5G(0))
      .attr("y", margin.top - subTitleGap)
      .text("5G")
      .attr("font-size", categoryFontSize)
      .attr("text-anchor", "end")
      .style("font-family", "TeleNeo Office")
      .style("font-weight", categoryFontWeight)
      .style("fill", categoryColor);

    // LTE
    svg
      .append("text")
      .attr("x", margin.left + xScaleLTE(0))
      .attr("y", margin.top - subTitleGap)
      .text("LTE")
      .attr("font-size", categoryFontSize)
      .attr("text-anchor", "start")
      .style("font-family", "TeleNeo Office")
      .style("font-weight", categoryFontWeight)
      .style("fill", categoryColor);

    return () => {
      svg.remove();
    };
  }, [
    data,
    CenterGap,
    TextGap,
    isPercent,
    labelFontSize,
    labelFontWeight,
    valueFontSize,
    valueFontWeight,
    categoryFontSize,
    categoryFontWeight,
    fontFamilyLabel,
    fontFamilyValue,
    barInnerPadding,
    backgroundOpacity,
    labelValueGap,
    categoryColor,
    valueColor,
    labelColor,
    textalignmentXaxis,
    textalignmentYaxis,
    TextTopMargin,
    legendPosition,
    rerender,
  ]);

  return <MainWrapper ref={graphRef}></MainWrapper>;
};

export default ResizeHandlerHOC(ButterFlyGraph);
