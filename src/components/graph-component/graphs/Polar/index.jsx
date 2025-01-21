import * as d3 from "d3";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
// import { ReactComponent as TipIcon } from "./assets/arrow-tip.svg";
import * as Styles from "./index.sc";
import ResizeHandlerHOC from "../utils/resizeHandlerHOC";

// const TipIcon = () => (
//   <svg
//     fill="#fff"
//     height="10px"
//     width="10px"
//     viewBox="0 0 490 490"
//     xml:space="preserve"
//   >
//     <path d="M245,10 Q230,0 215,10 L10,460 Q0,475 20,490 L470,490 Q490,475 480,460 Z" />
//   </svg>
// );

const PolarGraph = ({
  data,
  angleOfRotation = -Math.PI / 8,
  radialAxisColors = [
    { color: "#68B266", rangeMax: 0.3 },
    { color: "#FFA500", rangeMax: 0.7 },
    { color: "#DA0000", rangeMax: 1 },
  ],
  onSectorSelect,
  onSectorUnSelect,
  graphWrapStyle,
  rerender,
  innerGraphRadiusPercent,
  tooltipNode,
  onMouseOver,
  onMouseLeave,
  radialAxisDashArray,
  backgroundFillColor,
  axialLineStrokes,
  showSectorDividers,
  radialAxis,
  highlight,
  showLabel,
  labelFontColor,
  labelFontSize,
  labelFontWeight,
  labelFontFamily,
  showAxisLabel = true,
  axisLabelFontSize = "8.17px",
  axisLabelFontColor = "#718A9A",
  axisLabelFontFamily = "Inter",
  axisLabelFontWeight = "500",
}) => {
  const parentRef = useRef();
  const graphRef = useRef();
  const tooltipRef = useRef();
  const tipRef = useRef();
  const [activeSector, setActiveSector] = useState(null);
  const memData = useMemo(() => JSON.stringify(data), [data]);

  useEffect(() => {
    const data = JSON.parse(memData);
    const { sectors, centerSummaryInnerHTML } = data;
    const parentWidth = graphRef.current.parentNode.offsetWidth;
    const parentHeight = graphRef.current.parentNode.offsetHeight;
    const width = Math.min(parentHeight, parentWidth);
    const height = width;
    const graphRadius = Math.min(parentWidth, parentHeight) / 2 - 20;
    const innerGraphRadius = graphRadius * (innerGraphRadiusPercent || 0.25);
    const PI = Math.PI;
    const anglePerSector = (2 * PI) / sectors.length;
    const handleMouseOver = (event, data, parentIndex, count) => {
      const angles = getDataArcAngles(parentIndex, data.index, count);
      const center = angles[0] + (angles[1] - angles[0]) / 2;
      const radius =
        innerGraphRadius + (radiiScale(data.value) - innerGraphRadius) / 2;
      const [x, y] = polar2Cartesian(radius, center);

      const position = getTooltipPos(center);
      let dx = "0%";
      let dy = "0%";
      let dx2 = "0%";
      let dy2 = "0%";
      let tipRotation = 0;
      if (position === "top") {
        dx = "-50% ";
        dy = "calc(-100% - 10px)";
        dx2 = "-50% ";
        dy2 = "-100%";
      } else if (position === "left") {
        dx = "10px";
        dy = "-50%";
        dx2 = "0";
        dy2 = "-50%";
        tipRotation = 90;
      } else if (position === "bottom") {
        dx = "-50%";
        dy = "10px";
        dx2 = "-50%";
        dy2 = "0";
        tipRotation = 180;
      } else {
        dx = "calc(-100% - 9px)";
        dy = "-50%";
        dx2 = "-10px";
        dy2 = "-50%";
        tipRotation = -90;
      }

      const svgElement = d3.select(graphRef.current);
      const svgRect = svgElement.node().getBoundingClientRect();
      const tooltip = tooltipRef.current;
      const svgCenterX = svgRect.x + svgRect.width / 2;
      const svgCenterY = svgRect.y + svgRect.height / 2;
      if (tooltip) {
        tooltip.style.left = svgCenterX + x + "px";
        tooltip.style.top = svgCenterY + y + "px";
        tooltip.style.display = "flex";
        tooltip.style.transform = `translate(${dx}, ${dy})`;
      }

      const tip = tipRef.current;
      if (tip) {
        d3.select(tip)
          .select("svg")
          .attr("transform", `rotate(${tipRotation + 180})`);
        tip.style.left = svgCenterX + x + "px";
        tip.style.top = svgCenterY + y + "px";
        tip.style.transform = `translate(${dx2},${dy2})`;
        tip.style.display = "block";
      }
      if (highlight) {
        d3.selectAll(".polar-graph-data-arc")
          .transition()
          .duration(200)
          .style("opacity", 0.3);
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .style("opacity", 1);
      }
      onMouseOver &&
        typeof onMouseOver === "function" &&
        onMouseOver(event, data, parentIndex, count);
    };

    const splitLabel = (label, maxLength) => {
      if (label.length <= maxLength) return [label];
      const words = label.split(" ");
      const lines = [];
      let currentLine = words[0];

      words.slice(1).forEach((word) => {
        if ((currentLine + " " + word).length > maxLength) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine += " " + word;
        }
      });

      lines.push(currentLine);
      return lines;
    };

    const handleMouseLeave = (e, d, i) => {
      const tooltip = tooltipRef.current;
      const tip = tipRef.current;
      if (tooltip) tooltip.style.display = "none";
      if (tip) tip.style.display = "none";
      if (highlight) {
        d3.selectAll(".polar-graph-data-arc")
          .transition()
          .duration(200)
          .style("opacity", 1);
        onMouseLeave &&
          typeof onMouseLeave === "function" &&
          onMouseLeave(e, d, i);
      }
    };

    const svg = d3
      .select(graphRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    //For drop shadow
    const defs = svg.append("defs");
    const filter = defs
      .append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "150%")
      .attr("width", "150%");

    filter
      .append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 2.045)
      .attr("result", "blurred");

    filter
      .append("feOffset")
      .attr("in", "blurred")
      .attr("dx", 0)
      .attr("dy", 4.09)
      .attr("result", "offsetBlur");

    filter
      .append("feFlood")
      .attr("flood-color", "rgba(0,0,0,0.3)")
      .attr("result", "color");

    filter
      .append("feComposite")
      .attr("in", "color")
      .attr("in2", "offsetBlur")
      .attr("operator", "in")
      .attr("result", "shadow");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "shadow");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // basic util functions

    const normalizeAngle = (angle) => angle + angleOfRotation;

    const getAngleRange = (sector) => [
      normalizeAngle(sector * anglePerSector),
      normalizeAngle(2 * PI + sector * anglePerSector),
    ];

    const getDataArcAngles = (parentIndex, index, count) => {
      const startAngle = getAngleRange(parentIndex)[0];
      const thickness = anglePerSector / count;
      return [
        startAngle + thickness * index,
        startAngle + thickness * (index + 1),
      ];
    };
    const polar2Cartesian = (radius, angle) => [
      radius * Math.sin(angle),
      radius * -Math.cos(angle),
    ];

    const getRadius = (percent) =>
      innerGraphRadius + (graphRadius - innerGraphRadius) * percent;

    const getTooltipPos = (angle) => {
      let position = "top";
      if (angle <= 0.25 * PI && angle >= 0) {
        position = "top";
      } else if (angle < 0.75 * PI && angle > 0.25 * PI) {
        position = "left";
      } else if (angle < 1.25 * PI && angle > 0.75 * PI) {
        position = "bottom";
      } else if (angle < 1.75 * PI && angle > 1.25 * PI) {
        position = "right";
      }
      return position;
    };

    // scales

    const radiiScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([innerGraphRadius, graphRadius]);

    // sector data arcs

    const sectorArc = d3
      .arc()
      .innerRadius(innerGraphRadius)
      .outerRadius((d) => radiiScale(d.value))
      .startAngle(
        (d, i, parentIndex, count) => getDataArcAngles(parentIndex, i, count)[0]
      )
      .endAngle(
        (d, i, parentIndex, count) => getDataArcAngles(parentIndex, i, count)[1]
      );

    const sectorBGArc = d3
      .arc()
      .innerRadius(innerGraphRadius)
      .outerRadius(graphRadius)
      .startAngle(
        (d, i, parentIndex, count) => getDataArcAngles(parentIndex, i, count)[0]
      )
      .endAngle(
        (d, i, parentIndex, count) => getDataArcAngles(parentIndex, i, count)[1]
      );

    svg
      .selectAll(".polar-graph-sector-group-bg")
      .data(sectors)
      .enter()
      .append("g")
      .attr("class", "polar-graph-sector-group-bg")
      .each(function (data, sectorIndex) {
        const sector = d3.select(this);
        sector
          .selectAll(".polar-graph-data-arc-bg")
          .data(data.carriers)
          .enter()
          .append("path")
          .attr("class", "polar-graph-data-arc-bg")
          .attr("d", (d, i) =>
            sectorBGArc(d, i, sectorIndex, data.carriers.length)
          )
          .attr("fill", backgroundFillColor)
          .transition()
          .duration(1000)
          .attrTween("d", (d, i) => {
            const interpolateRadii = d3.interpolate(
              innerGraphRadius,
              graphRadius
            );
            return (t) => {
              sectorArc
                .innerRadius(innerGraphRadius)
                .outerRadius(interpolateRadii(t));
              return sectorBGArc(d, i, sectorIndex, data.carriers.length);
            };
          });
      });
    if (!radialAxis) {
      const radialAxis = svg
        .append("g")
        .selectAll("g")
        .data(radialAxisColors)
        .enter()
        .append("g")
        .attr("class", "polar-graph-radial-axis");

      radialAxis
        .append("circle")
        .attr("class", "polar-graph-radial-axis-circle")
        .attr("r", (d, i) => {
          return getRadius(d.rangeMax || i);
        })

        .attr("stroke", (d) => d.color)
        .attr("fill", "none")
        .attr("stroke-width", graphRadius * 0.01)
        .attr(
          "stroke-dasharray",
          `${graphRadius * radialAxisDashArray},${
            graphRadius * radialAxisDashArray
          }`
        )
        .style("opacity", 0.8)
        .style("pointer-events", "none");
    }

    svg
      .selectAll(".polar-graph-sector-group")
      .data(sectors)
      .enter()
      .append("g")
      .attr("class", "polar-graph-sector-group")
      .each(function (data, sectorIndex) {
        const sector = d3.select(this);
        sector
          .selectAll(".polar-graph-data-arc")
          .data(
            data.carriers.map((carrier, index) => {
              return {
                ...carrier,
                index,
                peakUtilizationPercentageFromGraphComp: carrier.value,
              };
            })
          )
          .enter()
          .append("path")
          .attr("class", "polar-graph-data-arc")
          .attr("d", (d, i) =>
            sectorArc(d, i, sectorIndex, data.carriers.length)
          )
          .attr("fill", (d) => d.color)
          .attr("fill-opacity", 0.8)
          .on("mouseover", (e, d) =>
            handleMouseOver(e, d, sectorIndex, data.carriers.length)
          )
          .on("mouseout", handleMouseLeave)
          .transition()
          .duration(1000)
          .attrTween("d", (d, i) => {
            const interpolateRadii = d3.interpolate(
              innerGraphRadius,
              radiiScale(d.value)
            );
            return (t) => {
              sectorArc
                .innerRadius(innerGraphRadius)
                .outerRadius(interpolateRadii(t));
              return sectorArc(d, i, sectorIndex, data.carriers.length);
            };
          });
      });

    // Adding labels to the sectors with automatic line breaks
    if (showLabel) {
      sectors.forEach((sector, sectorIndex) => {
        sector.carriers.forEach((carrier, index) => {
          const startAngle =
            (sectorIndex + index / sector.carriers.length) * anglePerSector;
          const endAngle =
            (sectorIndex + (index + 1) / sector.carriers.length) *
            anglePerSector;
          const angle = (startAngle + endAngle) / 2;
          const labelRadius =
            innerGraphRadius + (graphRadius - innerGraphRadius) * 0.9;
          const [x, y] = polar2Cartesian(labelRadius, angle);

          const labelParts = splitLabel(carrier.label, 15);
          const textSelection = svg
            .append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", "-0.1em")
            .attr("text-anchor", "middle")
            .style("font-size", labelFontSize)
            .style("fill", labelFontColor)
            .style("font-weight", labelFontWeight)
            .style("font-family", labelFontFamily);

          labelParts.forEach((part, i) => {
            textSelection
              .append("tspan")
              .attr("x", x)
              .attr("dy", `${i > 0 ? 1.1 : 0}em`)
              .text(part);
          });

          // Rotate labels according to their position
          textSelection.attr("transform", () => {
            const adjustedAngle = (angle * 180) / Math.PI;
            if (adjustedAngle <= 180) {
              return `rotate(${adjustedAngle - 90}, ${x}, ${y})`;
            } else {
              return `rotate(${adjustedAngle - 270}, ${x}, ${y})`;
            }
          });
        });
      });
    }

    // sector divider
    if (showSectorDividers) {
      svg
        .selectAll(".polar-graph-sector-group-divider")
        .data(sectors)
        .enter()
        .append("g")
        .attr("class", "polar-graph-sector-group-divider")
        .each(function (data, sectorIndex) {
          if (data.carriers.length > 1) {
            const sector = d3.select(this);
            sector
              .selectAll(".polar-graph-data-arc-divider")
              .data(data.carriers)
              .enter()
              .append("line")
              .attr("class", "polar-graph-data-arc-divider")
              .attr(
                "x2",
                (d, i) =>
                  polar2Cartesian(
                    graphRadius,
                    getDataArcAngles(sectorIndex, i, data.carriers.length)[0]
                  )[0]
              )
              .attr(
                "y2",
                (d, i) =>
                  polar2Cartesian(
                    graphRadius,
                    getDataArcAngles(sectorIndex, i, data.carriers.length)[0]
                  )[1]
              )
              .attr("stroke-width", graphRadius * 0.0175)
              .attr("stroke", "#fff");
          }
        });
    } else {
      svg
        .selectAll(".polar-graph-sector-divider")
        .data(sectors)
        .enter()
        .append("line")
        .attr("class", "polar-graph-sector-divider")
        .attr(
          "x2",
          (d, i) => polar2Cartesian(graphRadius, getAngleRange(i)[0])[0]
        )
        .attr(
          "y2",
          (d, i) => polar2Cartesian(graphRadius, getAngleRange(i)[0])[1]
        )
        .attr("stroke-width", graphRadius * 0.0175)
        .attr("stroke", "#fff");
    }

    // overlay arc for non-highlighted section

    if (activeSector !== null) {
      const overlayArc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(graphRadius)
        .startAngle(getAngleRange(activeSector + 1)[0])
        .endAngle(getAngleRange(activeSector)[1]);

      svg
        .append("path")
        .attr("class", "polar-graph-non-highlight-overlay-arc")
        .attr("d", overlayArc)
        .attr("fill", "#fff")
        .style("opacity", 0.6)
        .style("cursor", "not-allowed");
      // .transition()
      // .duration(1000)
      // .attrTween('d', () => {
      //   const interpolate = d3.interpolate(
      //     normalizeAngle((activeSector + 1) * anglePerSector),
      //     normalizeAngle(2 * PI + activeSector * anglePerSector)
      //   )
      //   return (t) => {
      //     overlayArc.endAngle(interpolate(t))
      //     return overlayArc()
      //   }
      // })

      // uncomment the above code to add overlay transition
    }

    // radial axis
    if (radialAxis) {
      const radialAxis = svg
        .append("g")
        .selectAll("g")
        .data(radialAxisColors)
        .enter()
        .append("g")
        .attr("class", "polar-graph-radial-axis");

      radialAxis
        .append("circle")
        .attr("class", "polar-graph-radial-axis-circle")
        .attr("r", (d, i) => {
          return getRadius(d.rangeMax || i);
        })

        .attr("stroke", (d) => d.color)
        .attr("fill", "none")
        .attr("stroke-width", graphRadius * 0.01)
        .attr(
          "stroke-dasharray",
          `${graphRadius * radialAxisDashArray},${
            graphRadius * radialAxisDashArray
          }`
        )
        .style("opacity", 0.8)
        .style("pointer-events", "none");
    }

    if (showAxisLabel) {
      const radialAxis = svg
        .append("g")
        .selectAll("g")
        .data(radialAxisColors)
        .enter()
        .append("g")
        .attr("class", "polar-graph-radial-axis");

      radialAxis
        .append("text")
        .attr("class", "polar-graph-radial-axis-label")
        .attr("x", 0)
        .attr("y", (d, i) => getRadius(d.rangeMax || i) + 6)
        .attr("dy", "-0.35em")
        .style("text-anchor", "middle")
        .style("font-size", axisLabelFontSize)
        .style("fill", axisLabelFontColor)
        .style("font-family", axisLabelFontFamily)
        .style("font-weight", axisLabelFontWeight)
        .text((d, i) => (i + 1) * 100)
        .each(function (d, i) {
          const bbox = this.getBBox();
          const width = 20.35;
          const height = 11.24;

          const rectX = bbox.x + bbox.width / 2 - width / 2;
          const rectY = bbox.y + bbox.height / 2 - height / 2;

          d3.select(this.parentNode)
            .insert("rect", "text")
            .attr("x", rectX)
            .attr("y", rectY)
            .attr("width", width)
            .attr("height", height)
            .attr("rx", 2.04)
            .attr("ry", 2.04)
            .attr("fill", "white")
            .style("opacity", 0.5)
            .attr("filter", "url(#drop-shadow)");
        });
    }

    if (sectors.length > 1)
      svg
        .selectAll(".polar-graph-sector-axial-axis-line")
        .data(sectors)
        .enter()
        .append("line")
        .attr("class", "polar-graph-sector-axial-axis-line")
        .attr("x2", (d, i) => {
          return polar2Cartesian(
            graphRadius + graphRadius * 0.125,
            getAngleRange(i)[0]
          )[0];
        })
        .attr(
          "y2",
          (d, i) =>
            polar2Cartesian(
              graphRadius + graphRadius * 0.125,
              getAngleRange(i)[0]
            )[1]
        )
        .attr("stroke-width", graphRadius * 0.0225)
        .attr("stroke", axialLineStrokes)
        .style("pointer-events", "none")
        .style("cursor", activeSector ? "not-allowed" : "default");

    svg
      .selectAll(".polar-graph-sector-labels")
      .data(
        sectors.map((sector, index) => {
          return {
            ...sector,
            index,
          };
        })
      )
      .enter()
      .append("text")
      .attr("class", "polar-graph-sector-labels")
      .attr("text-anchor", (d, i) => {
        const angle = getAngleRange(i)[0] + PI / 2.75;
        return angle > PI ? "end" : "start";
      })
      .attr(
        "x",
        (d, i) =>
          polar2Cartesian(
            graphRadius + graphRadius * 0.1,
            getAngleRange(i)[0] + PI / 2.75
          )[0]
      )
      .attr(
        "y",
        (d, i) =>
          polar2Cartesian(
            graphRadius + graphRadius * 0.1,
            getAngleRange(i)[0] + PI / 2.75
          )[1]
      )
      .text((d) => d.name)
      .style("fill", "#e20074")
      .style("opacity", (d, i) =>
        i === activeSector || activeSector === null ? "1" : "0.5"
      )
      .style("font-size", `${graphRadius / 150}rem`)
      .style("cursor", "pointer")
      .on("click", (e, d) => {
        if (activeSector === d.index) {
          onSectorUnSelect &&
            typeof onSectorUnSelect === "function" &&
            onSectorUnSelect(e, d);
          setActiveSector(null);
        } else {
          onSectorSelect &&
            typeof onSectorSelect === "function" &&
            onSectorSelect(e, d);
          setActiveSector(d.index);
        }
      });

    const centerCircle = svg
      .append("g")
      .attr("class", "polar-graph-center-circle");
    const getCenterRectSide = (radius) => Math.sqrt(2) * radius;
    centerCircle
      .append("circle")
      .attr("r", innerGraphRadius)
      .attr("fill", "#fff");

    if (centerSummaryInnerHTML) {
      const centerCircleWrap = centerCircle
        .append("foreignObject")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", getCenterRectSide(innerGraphRadius))
        .attr("height", getCenterRectSide(innerGraphRadius))
        .style("overflow", "visible")
        .style("pointer-events", "none");

      centerCircleWrap
        .append("xhtml:div")
        .attr("class", "polar-graph-center-container-wrapper")
        .style("width", getCenterRectSide(innerGraphRadius) + "px")
        .style("height", getCenterRectSide(innerGraphRadius) + "px")
        .html(centerSummaryInnerHTML);
    }

    return () => {
      svg.selectAll("*").remove();
    };
  }, [
    memData,
    angleOfRotation,
    activeSector,
    showSectorDividers,
    backgroundFillColor,
    innerGraphRadiusPercent,
    radialAxisDashArray,
    axialLineStrokes,
    rerender,
    radialAxis,
    highlight,
    showLabel,
    labelFontColor,
    labelFontSize,
    labelFontWeight,
    labelFontFamily,
    showAxisLabel,
    axisLabelFontSize,
    axisLabelFontColor,
    axisLabelFontFamily,
    axisLabelFontWeight,
  ]);

  return (
    <Styles.Container ref={parentRef} style={graphWrapStyle}>
      <svg ref={graphRef} />
      {ReactDOM.createPortal(
        <Styles.TooltipContainer className="polar-graph-tooltip-wrap-container">
          <Styles.TooltipWrap
            className="polar-graph-tooltip-wrap"
            ref={tooltipRef}
          >
            {tooltipNode}
          </Styles.TooltipWrap>
          {/* <Styles.Tip className="polar-graph-tooltip-arrow-tip" ref={tipRef}>
            <TipIcon />
          </Styles.Tip> */}
        </Styles.TooltipContainer>,
        document.body
      )}
    </Styles.Container>
  );
};

export default ResizeHandlerHOC(PolarGraph);

PolarGraph.propTypes = {
  data: PropTypes.object.isRequired,
  angleOfRotation: PropTypes.number,
  radialAxisColors: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      rangeMax: PropTypes.number,
    })
  ),
  onSectorSelect: PropTypes.func,
  onSectorUnSelect: PropTypes.func,
  graphWrapStyle: PropTypes.object,
  innerGraphRadiusPercent: PropTypes.number,
  tooltipNode: PropTypes.node,
  onMouseOver: PropTypes.func,
  onMouseLeave: PropTypes.func,
};
