import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { GraphContainer } from "./index.sc";
import ResizeHandlerHOC from "../utils/resizeHandlerHOC";

const StackedGroupColumn = ({
  data,
  events,
  rerender,
  topSpace,
  bottomTextSpace,
  gapBetweenGroups,
  strokeColor,
  labelFontSize,
  labelFontWeight,
  labelFontFamily,
  labelalignmentXaxis,
  labelalignmentYaxis,
  groupLabelFontSize,
  groupLabelFontWeight,
  groupLabelFontFamily,
  cursorPointerShow,
  groupWidth,
  padding,
  paddingOuter,
  labelColor,
  groupLabelColor,
  legendPosition,
  highlight,
}) => {
  const svgRef = useRef(null);

  const transition = (selection) => {
    return selection.transition().duration(500).ease(d3.easeCubicInOut);
  };

  const drawChart = () => {
    const svg = d3.select(svgRef.current).append("svg");
    // Clear any existing content in the SVG
    svg.selectChildren().remove();

    // Get the width and height of the parent container
    const parentNode = svg.node().parentNode;
    const parentWidth = parentNode.getBoundingClientRect().width;
    const parentHeight = parentNode.getBoundingClientRect().height;

    // Set the dimensions of the SVG container
    svg.attr("width", parentWidth).attr("height", parentHeight);

    // Prepare the data

    const transformedDataWithSeparatedGroup = data.groups.map(
      (dataset, groupIndex) => {
        return [
          data.labels.map((label, i) => ({
            label: label,
            ...data.datasets[i][groupIndex],
          })),
        ];
      }
    );

    const transformedData = data.labels.map((label, i) => {
      return {
        label: label,
        ...data.datasets[i][0],
      };
    });

    const stackDataGenerator = d3
      .stack()
      .keys(Object.keys(transformedData[0]).filter((item) => item !== "label"));

    const layers = stackDataGenerator(transformedData);
    const layersForEachGroup = transformedDataWithSeparatedGroup.map(
      (group) => {
        return stackDataGenerator(group[0]);
      }
    );

    const extentForEachGroup = layersForEachGroup.reduce(
      (acc, group) => {
        const currentExtent = [0, d3.max(group, (d) => d3.max(d, (d) => d[1]))];
        return [
          Math.min(acc[0], currentExtent[0]),
          Math.max(acc[1], currentExtent[1]),
        ];
      },
      [0, 0]
    );

    // Define scales

    const xScale = d3
      .scaleBand()
      .range([0, parentWidth])
      .padding(padding)
      .paddingOuter(paddingOuter)
      .domain(data.labels.map((d) => d));

    const xGroupScale = d3
      .scaleBand()
      .domain(data.groups)
      .range([0, xScale.bandwidth()])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain(extentForEachGroup)
      .range([parentHeight - topSpace - bottomTextSpace, 0]);

    // // Add x-axis
    // svg
    //   .append("g")
    //   .attr("transform", `translate(0,${50})`)
    //   .call(d3.axisBottom(xScale));

    // Add y-axis

    // svg
    //   .append("g")
    //   .attr("transform", `translate(30,0)`)
    //   .call(d3.axisLeft(yScale));

    const num_groups = data.groups.length;

    d3.range(num_groups).forEach((groupNum) => {
      const groupLayer = svg
        .selectAll(".layer" + groupNum)
        .data(layersForEachGroup[groupNum])
        .join(
          (enter) =>
            enter
              .append("g")
              .attr("transform", `translate(0, ${topSpace})`)
              .attr("class", "layer" + groupNum)
              .attr("fill", (layer) => data.colors[layer.key])
              .style("stroke", strokeColor)
              .selectAll("rect")
              .data((layer) => layer)
              .join("rect")
              .attr("x", (sequence) => {
                return (
                  xScale(sequence.data.label) +
                  (xScale.bandwidth() / num_groups + gapBetweenGroups / 2) *
                    groupNum
                );
              })
              .attr(
                "width",
                groupWidth
                // xScale.bandwidth() / num_groups - gapBetweenGroups / 2
              )
              .attr(
                "y",
                (sequence) => parentHeight - topSpace - bottomTextSpace
              )
              .attr("height", 0)
              .transition()
              .duration(500)
              .delay((sequence, i) => i * 50)
              .ease(d3.easeCubicInOut)
              .attr("y", (sequence) => yScale(sequence[1]))
              .attr(
                "height",
                (sequence) => yScale(sequence[0]) - yScale(sequence[1])
              ),
          (update) =>
            update
              .transition()
              .duration(500)
              .delay((sequence, i) => i * 50)
              .ease(d3.easeCubicInOut)
              .attr(
                "height",
                (sequence) => yScale(sequence[0]) - yScale(sequence[1])
              ),
          (exit) => exit.remove()
        )
        .style("cursor", cursorPointerShow ? "pointer" : " ")
        .on("mousemove", function (e, sequence) {
          events.handleMouseEnter(
            e.clientX,
            e.clientY,
            sequence.data,
            data.groups[groupNum]
          );
        })
        .on("mouseleave", function () {
          events.handleMouseLeave();
        });

      if (highlight) {
        groupLayer
          .on("mouseover", function (e, sequence) {
            d3.selectAll("rect").style("opacity", 0.4);
            const label = sequence.data.label;
            d3.selectAll(`.layer${groupNum} rect`)
              .filter((d) => d.data.label === label)
              .style("opacity", 1);
          })
          .on("mouseout", function () {
            d3.selectAll("rect").style("opacity", 1);
          });
      }

      // text labels for each group

      const groupsContainer = svg
        .selectAll(".group" + groupNum)
        .data(data.labels)
        .join("g")
        .attr("class", "layer" + groupNum);

      groupsContainer
        .append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", groupLabelFontSize)
        .attr("font-weight", groupLabelFontWeight)
        .attr("font-family", groupLabelFontFamily)
        .style("fill", groupLabelColor)
        .attr("y", parentHeight) // Adjust the y-position as needed
        .attr("x", (data) => {
          return (
            xScale(data) +
            (xScale.bandwidth() / num_groups + gapBetweenGroups / 2) *
              groupNum +
            // middle of each group
            // (xScale.bandwidth() / num_groups - gapBetweenGroups / 2) / 2
            10
          );
        })
        .text((d, i) => data.groups[groupNum]);
    });

    // top bar labels for each data points

    svg
      .selectAll(".top-bar-labels")
      .data(data.labels)
      .join("text")
      .attr("class", "top-bar-labels")
      .attr("text-anchor", "middle")
      .attr("x", (d) => xScale(d) + xScale.bandwidth() / labelalignmentXaxis)
      .attr("y", labelalignmentYaxis)
      .style("font-size", labelFontSize)
      .style("font-weight", labelFontWeight)
      .style("font-family", labelFontFamily)
      .style("fill", labelColor)
      .text((d) => d.toUpperCase());
  };

  useEffect(() => {
    drawChart();

    return () => {
      d3.select(svgRef.current).selectChildren().remove();
    };
  }, [
    data,
    rerender,
    topSpace,
    bottomTextSpace,
    groupWidth,
    gapBetweenGroups,
    strokeColor,
    labelFontSize,
    labelFontWeight,
    labelFontFamily,
    labelalignmentXaxis,
    labelalignmentYaxis,
    groupLabelFontSize,
    groupLabelFontWeight,
    groupLabelFontFamily,
    cursorPointerShow,
    groupWidth,
    padding,
    paddingOuter,
    labelColor,
    groupLabelColor,
    legendPosition,
    highlight,
  ]);

  return <GraphContainer ref={svgRef} />;
};

export default ResizeHandlerHOC(StackedGroupColumn);
