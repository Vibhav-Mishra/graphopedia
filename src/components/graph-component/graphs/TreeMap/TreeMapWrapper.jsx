import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

const TreeMap = ({
    defaultTreeColor,
    isDefaultTreeColor,
    noChildrenOpacity,
    data,
    tile,
    width,
    height,
    TextAnchorTypeX,
    TextAnchorTypeY,
    textSize,
    textColor,
    textFontWeight,
    showValue,
    valueTextSize,
    valueTextColor,
    valueTextFontWeight,
    paddingInner,
    paddingOuter,
    valueType,
    showValueType,
    animationDuration,
    animationDurationText,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    onMouseClick,
    enableTooltip,
    highlightRect,
    legendPosition,
    enableLegend,
    ...props
}) => {
    const svgRef = useRef(null);

    const treeParams = {
        textOffset: showValue ? valueTextSize * 2 : 0,
        textCoodinateY: showValue ? 25 : 10,
        valueType: showValueType === "value" ? "value" : "count"
    }

    useEffect(() => {
        drawTreemap(data);
    }, [
        defaultTreeColor,
        isDefaultTreeColor,
        noChildrenOpacity,
        data,
        tile,
        width,
        height,
        TextAnchorTypeX,
        TextAnchorTypeY,
        textSize,
        textColor,
        textFontWeight,
        showValue,
        valueTextSize,
        valueTextColor,
        valueTextFontWeight,
        paddingInner,
        paddingOuter,
        valueType,
        showValueType,
        animationDuration,
        animationDurationText,
        enableLegend && legendPosition,
        enableLegend,
    ]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const rects = svg.selectAll(".rect");
        rects
            .classed("tooltip-enabled", enableTooltip)
            .on("mouseenter", function (e, d) {
                if (highlightRect) {
                    rects.classed("reverse-highlighted", true);
                    d3.select(this).classed("highlighted", true).classed("reverse-highlighted", false);
                } else {
                    d3.select(this).classed("highlighted", true)
                }
                onMouseEnter(e, d.data);
            })
            .on("mousemove", function (e) {
                onMouseMove(e);
            })
            .on("mouseleave", function () {
                if (highlightRect) {
                    rects.classed("reverse-highlighted", false);
                }
                d3.select(this).classed("highlighted", false);
                onMouseLeave();
            })
            .on("click", function (event, d) {
                onMouseClick(event, d);
            });
    }, [
        enableTooltip,
        highlightRect,
        onMouseEnter,
        onMouseMove,
        onMouseLeave,
        onMouseClick,
    ]);

    const getTextXCoordinate = (d, TextAnchorTypeX) => {
        if (TextAnchorTypeX === "middle") {
            return (d.x1 - d.x0) / 2;
        } else if (TextAnchorTypeX === "start") {
            return textSize + 2
        } else if (TextAnchorTypeX === "end") {
            return (d.x1 - d.x0) - (textSize + 2);
        }
    };

    const getTextYCoodinate = (d, TextAnchorTypeY) => {
        if (TextAnchorTypeY === "middle") {
            return (d.y1 - d.y0) / 2;
        } else if (TextAnchorTypeY === "top") {
            return textSize + 10
        } else if (TextAnchorTypeY === "bottom") {
            return (d.y1 - d.y0) - (showValue && d.data.value ? textSize + valueTextSize + 10 : textSize + 10);
        }
    }


    const drawTreemap = (data) => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const root = d3
            .hierarchy(data)
            .sum((d) => d[valueType || "value"])
            .sort((a, b) => b[valueType || "value"] - a[valueType || "value"]);

        const treemap = d3
            .treemap()
            .tile(d3[tile])
            .size([width, height])
            .paddingOuter(paddingOuter)
            .paddingInner(paddingInner);

        treemap(root);

        const nodes = svg
            .selectAll("g")
            .data(root.children)
            .enter()
            .append("g")
            .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

        nodes
            .append("rect")
            .attr("class", "rect")
            .attr("x", 1)
            .attr("y", 1)
            .attr("width", 0)
            .attr("height", 0)
            .attr("fill", (d) => isDefaultTreeColor ? defaultTreeColor : d.data.color || defaultTreeColor)
            .classed("overlay", (d) => d.data.children)
            .attr("opacity", (d) => {
                return d.data.children ? 1 : noChildrenOpacity;
            })
            .transition()
            .duration(animationDuration)
            .attr("width", (d) => d.x1 - d.x0 - 2)
            .attr("height", (d) => d.y1 - d.y0 - 2)
            .on("end", function () {
                const parentNode = d3.select(this.parentNode);
                // First text element for the label
                parentNode
                    .append("text")
                    .attr("x", 1)
                    .attr("y", 1)
                    .attr("dy", ".35em")
                    .attr("text-anchor", TextAnchorTypeX)
                    .style("fill", textColor || "black")
                    .style("font-size", `${textSize}px` || "12px")
                    .style("font-weight", textFontWeight || "500")
                    .text((d) => d.data.label?.toUpperCase())
                    .transition()
                    .duration(animationDurationText)
                    .attr("x", (d) => getTextXCoordinate(d, TextAnchorTypeX))
                    .attr("y", (d) => getTextYCoodinate(d, TextAnchorTypeY))
                // Second text element for the value
                {
                    showValue &&
                        parentNode
                            .append("text")
                            .attr("x", textSize)
                            .attr("y", textSize)
                            .attr("dy", ".35em")
                            .attr("text-anchor", TextAnchorTypeX)
                            .style("fill", valueTextColor || "black")
                            .style("font-size", `${valueTextSize}px` || "12px")
                            .style("font-weight", valueTextFontWeight || "600")
                            .text((d) => d.data[treeParams.valueType] && `${d.data[treeParams.valueType]}${treeParams.valueType === "value" ? d?.data?.unit && d?.data?.unit : ""}`)
                            .transition()
                            .duration(animationDurationText)
                            .attr("x", (d) => getTextXCoordinate(d, TextAnchorTypeX))
                            .attr("y", (d) => getTextYCoodinate(d, TextAnchorTypeY) + (textSize * 1.2)) // Slightly below the first text
                }

                parentNode.
                    each(function (d) {
                        const label = d3.select(this).select("text")?.node();
                        const value = d3.select(this).select("text:nth-of-type(2)")?.node();

                        const textWidth = Math.max(
                            label?.getComputedTextLength(),
                            value?.getComputedTextLength() || 0
                        );
                        const textHeight = showValue ? label?.getBBox().height + value?.getBBox().height : label?.getBBox().height;
                        const rectWidth = d.x1 - d.x0;
                        const rectHeight = d.y1 - d.y0;
                        if (textWidth * 1.5 > rectWidth || textHeight * 2 > rectHeight) {
                            d3.select(label)?.attr("visibility", "hidden");
                            d3.select(value)?.attr("visibility", "hidden");
                        }
                    })


            })
    };

    return (
        <svg width={width} height={height} ref={svgRef}></svg>
    );
};

TreeMap.propTypes = {
    data: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
};

export default TreeMap;
