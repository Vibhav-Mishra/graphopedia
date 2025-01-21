import {
  Bottom,
  Circle,
  Flex,
  Heading,
  Text,
  Wrapper,
  Svgshow,
} from "./index.sc";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";
import ResizeHandlerHOC from "../utils/resizeHandlerHOC";

const GaugeGraph = ({
  value,
  rangeData,
  diffData,
  titleShow,
  title,
  height,
  width,
  titleSize,
  needleFillColor,
  needleWidth = 8,
  centerTextColor = "#0000",
  centerTextWidth = 20,
  arcColor = "#00000",
  arcWidth = 2,
  targetText,
  targetTextColor,
  arrowCircleSize,
  upArrow,
  downArrow,
  currentValue,
  preVal,
  isPositiveGood,
  graphType,
  gaugeType = "default",
  needleType = "pointerNeedle",
  isNeedleGradient,
  needleGradientColor1,
  needleGradientColor2,
  innerTitle = "Title",
  innerTitleTextColor = "#00000",
  innerTitleTextSize = 20,
  isOnlyHalfDoughnutVariant,
  needleLength,
  needleOpacity,
  ...props
}) => {
  const chartRef = useRef(null);
  const needleRef = useRef(null);
  const initialRotation = useRef();
  const previousPercent = useRef(0);

  let percent = value / 100;
  let colors = [];
  let rangeArray = [];

  rangeData.forEach((range) => {
    rangeArray.push(range.from, range.to);
    colors.push(range.color);
  });

  let arcColors = [...colors];

  let colorArray = [];

  for (const item of colors) {
    colorArray.push(item, item);
  }

  const drawChart = () => {
    const el = d3.select(chartRef.current);

    const gaugeParams = {
      semicircle: {
        startAngle: -90,
        endAngle: 90,
        range: 180,
        sectionPadding: 0.02,
        sectionPercentageDivisionValue: 2,
        centerTextOffset: 0.1,
        textPosition: 50,
        rotationOffset: 0.5
      },
      default: {
        startAngle: -135,
        endAngle: 135,
        range: 270,
        sectionPadding: 0.03,
        sectionPercentageDivisionValue: 1.327,
        centerTextOffset: 0.5,
        textPosition: 80,
        rotationOffset: 1.4
      },
    };

    const numSections = 100;

    const sectionPerc =
      1 / numSections / gaugeParams[gaugeType].sectionPercentageDivisionValue;

    const padRad = gaugeParams[gaugeType].sectionPadding;

    const chartInset = 10;

    const margin = { top: 20, right: 20, bottom: -25, left: 20 };

    let width = el.node().offsetWidth - margin.left - margin.right;

    let height = el.node().offsetHeight - margin.top - margin.bottom;

    height = Math.min(width, height);

    width = Math.min(width, height);

    const barWidth = width / 16;

    const radius = (0.9 * Math.min(width, height)) / 2;

    const percToDeg = (perc) => perc * 360;

    const percToRad = (perc) => degToRad(percToDeg(perc));

    const degToRad = (deg) => (deg * Math.PI) / 180;

    const svg = el
      .append("svg")
      .attr("width", width + margin.left + margin.right + 10)
      .attr("height", height + margin.top + margin.bottom);

    const chart = svg
      .append("g")
      .attr(
        "transform",
        `translate(${(width + margin.left * 2) / 2}, ${(height + margin.top) / (gaugeType === "semicircle" ? 1.5 : 2)
        })`
      );

    // const arcColors = [...new Set(colors)]

    let lastColor = [];

    const getArcColor = (sectionIndex) => {
      if (percent == 0) return arcColor;

      if (percent >= 1) return arcColors[arcColors.length - 1]; // if value is greater than 100%

      const needlePosition = percent * numSections;

      const currentSectionPercentage = percent * numSections - needlePosition;

      let newRangeArr = [0]; // 0-100

      for (let i = 0; i < rangeArray.length; i++) {
        if (i % 2 == 1) newRangeArr.push(rangeArray[i] / 100);
      }

      if (sectionIndex <= needlePosition) {
        for (let i = 0; i < newRangeArr.length; i++) {
          if (needlePosition <= newRangeArr[i] * numSections) {
            lastColor.push(arcColors[i - 1]);
            return arcColors[i - 1];
          }
        }
      } else if (sectionIndex === Math.ceil(percent * numSections)) {
        return d3.interpolate(
          lastColor[lastColor.length - 1],
          arcColor
        )(currentSectionPercentage * 100); // Apply the shadow effect to the next arc strip
      } else {
        lastColor = [];
        return arcColor; // Gray color for sections beyond the needle position
      }
    };

    // Inside your GaugeGraph component:

    if (!isOnlyHalfDoughnutVariant) {
      for (let sectionIndex = 0; sectionIndex < numSections; sectionIndex++) {
        const arcStartRad =
          degToRad(gaugeParams[gaugeType].startAngle) +
          sectionIndex * percToRad(sectionPerc);
        const arcEndRad =
          degToRad(gaugeParams[gaugeType].startAngle) +
          (sectionIndex + 1) * percToRad(sectionPerc) -
          padRad;

        const startPadRad = sectionIndex === 0 ? 0 : 0;
        const endPadRad = sectionIndex === numSections - 1 ? 0 : 0;

        const barWid = (sectionIndex) => {
          return barWidth;
        };

        const arc = d3
          .arc()
          .outerRadius(radius - chartInset)
          .innerRadius(radius - chartInset - barWid(sectionIndex))
          .startAngle(arcStartRad + startPadRad)
          .endAngle(arcEndRad - endPadRad);

        chart
          .append("path")
          .attr("class", `arc chart-color${sectionIndex + 1}`)
          .attr("d", arc)
          .attr("fill", getArcColor(sectionIndex))
          .transition()
          .ease(d3.easeLinear)
          .duration(1000)
          .attrTween("d", function () {
            const interpolator = d3.interpolate(
              arc.startAngle()(),
              arcEndRad - endPadRad
            );
            return function (t) {
              arc.endAngle(interpolator(t));
              return arc();
            };
          });
      }
    }
    svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "needle-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%")
      .call((gradient) => {
        gradient
          .append("stop")
          .attr("offset", "30%")
          .attr("stop-color", needleGradientColor1 || "transparent");

        gradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", needleGradientColor2 || "lightgray");
      });
    ///////////////////////////text position and labels start/////////////////////

    // Text positions and labels

    let textPositions = [0];

    for (let i = 0; i < rangeArray.length; i++) {
      if (i % 2 == 1) textPositions.push(rangeArray[i] / 100);
    }

    let textLabels = textPositions.map((el) => `${el * 100}%`); // ['0%', '30%', '50%', '90%', '100%'];

    // Draw the text at specific positions
    for (let i = 0; i < textPositions.length; i++) {
      const textAngle =
        90 +
        gaugeParams[gaugeType].startAngle +
        gaugeParams[gaugeType].range * textPositions[i];
      const textX =
        -Math.cos(
          degToRad(i == textLabels.length - 1 ? textAngle - 4 : textAngle)
        ) *
        (radius - chartInset + barWidth * 2);
      const textY =
        -Math.sin(degToRad(textAngle)) * (radius - chartInset + barWidth * 1.3);

      chart
        .append("text")
        .attr("class", "target-text")
        .attr("x", textX)
        .attr("y", textY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr(
          "font-size",
          (d) => targetText || `${Math.min(height, width) / 20}px`
        )
        .style("fill", targetTextColor || "#6a6a6a")
        .text(textLabels[i]);
    }
    ///////////////////////////text position and labels end///////////////////////

    ////////////////////////drawing the new range arc start///////////////////////

    const arcSize = arcWidth; // Adjust the width of the arcs
    const dotRadiusOffset = barWidth; // Offset the dot radius to align with the arcs

    for (let i = 0; i < rangeArray.length; i++) {
      const startAngle = degToRad(
        gaugeParams[gaugeType].startAngle +
        gaugeParams[gaugeType].range * (rangeArray[i] / 100)
      );
      const endAngle =
        // i < rangeArray.length - 1
        //   ? degToRad(startAngle + 270 * (rangeArray[i + 1] / 100))
        //   :
        degToRad(gaugeParams[gaugeType].endAngle);

      const arc = d3
        .arc()
        .outerRadius(radius - chartInset + dotRadiusOffset * 0.8)
        .innerRadius(isOnlyHalfDoughnutVariant ? radius - chartInset - barWidth
          : radius - chartInset + dotRadiusOffset * 0.8 - arcSize * 2
        )
        .startAngle(startAngle)
        .endAngle(endAngle);

      chart
        .append("path")
        .attr("class", `arc ${colorArray[i]}`)
        .attr("d", arc)
        .attr("fill", colorArray[i]);
    }

    /////////////////////////////////////////draw the new arc end///////////////////////////////////////////////////

    // Class of Needle

    class Needle {
      constructor(len, width) {
        this.len = len;
        this.width = width;
      }

      drawOn(el, perc) {
        if (needleType === "rectangleNeedle") {
          el.append("rect")
            .attr("class", "needle")
            .attr("x", -this.width)
            .attr("y", -this.len)
            .attr("width", this.width)
            .attr("height", this.len)
            .attr("transform", `rotate(${initialRotation.current})`)
            .style("fill", isNeedleGradient ? "url(#needle-gradient)" : needleFillColor || "#00000")
            .style("fill-opacity", needleOpacity);
        } else if (needleType === "pointerNeedle") {
          el.append("path")
            .attr("class", "needle")
            .attr("d", this.getNeedlePath())
            .attr("transform", `rotate(${initialRotation.current})`)
            .style("fill", isNeedleGradient ? "url(#needle-gradient)" : needleFillColor || "#00000")
            .style("fill-opacity", needleOpacity);
        } else if (needleType === "none") {
          // Do nothing 
        }
        const needleTitleY = needleType === "none"
          ? radius * gaugeParams[gaugeType].centerTextOffset - gaugeParams[gaugeType].textPosition
          : radius * gaugeParams[gaugeType].centerTextOffset;

        const needleValueY = innerTitle
          ? needleTitleY + innerTitleTextSize
          : needleTitleY;

        // Title text
        el.append("text")
          .attr("class", "needle-title")
          .attr("x", "1%")
          // .attr("y", radius * gaugeParams[gaugeType].centerTextOffset)
          .attr("y", needleTitleY)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "hanging")
          .attr("font-size", (d) => `${innerTitleTextSize || Math.min(height, width) / 12}px`)
          .attr("opacity", "100%")
          .style("fill", innerTitleTextColor) // center text color
          .text(`${innerTitle}`);

        // %Value Text
        el.append("text")
          .attr("class", "needle-text")
          .attr("x", "1%")
          .attr("y", needleValueY)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "hanging")

          .attr(
            "font-size",
            (d) => `${centerTextWidth || Math.min(height, width) / 12}px`
          )

          .attr("opacity", "100%")
          .style("fill", centerTextColor || "black") // center text
          .text(`${(percent * 100).toFixed(2)}%`);
      }

      getNeedlePath() {
        const needleBaseWidth = this.width;
        const needleTipWidth = this.width / 4;
        const needleLength = this.len;
        const radius = needleBaseWidth / 2;

        return `
          M ${-needleBaseWidth / 2}, 0
          A ${radius},${radius} 0 0 0 ${needleBaseWidth / 2}, 0
          L ${needleBaseWidth / 2}, 0
          L ${needleTipWidth / 2}, ${-needleLength}
          L ${-needleTipWidth / 2}, ${-needleLength}
          Z
        `;
      }

      updateTo(el, percent) {
        const self = this;

        const previousPerc = previousPercent.current || 0;

        const i = d3.interpolate(previousPerc, percent);

        el.select(".needle")
          .attr("data-perc", percent)
          .transition()
          .ease(d3.easeBack)
          .duration(1000)
          .attrTween("transform", function () {
            return function (t) {
              const progress = i(t);
              if (self.calculateRotation(progress)) {
                return `rotate(${self.calculateRotation(progress)})`;
              } else {
                return `rotate(1)`;
              }
            };
          });
      }

      calculateRotation(perc) {
        const minAngle = gaugeParams[gaugeType].startAngle;
        const maxAngle = gaugeParams[gaugeType].endAngle;
        const angleRange = maxAngle - minAngle;
        const limitedPerc = Math.max(Math.min(perc, 1), 0);
        const rotationOffset = gaugeParams[gaugeType].rotationOffset;

        return minAngle + limitedPerc * angleRange + rotationOffset; // -135 + 0.5 * 270 = 0 // add rotationOffset to fixed small angle issue
      }
    }

    const needle = new Needle(
      // (radius - chartInset - barWidth) * 0.9,
      (radius - chartInset - barWidth + needleLength) * 1, //increase needle length
      needleWidth
    );

    // Adjusted the needle size
    needle.drawOn(chart, 0);

    needleRef.current = needle;
  };

  useEffect(() => {
    initialRotation.current = -135;

    drawChart();

    return () => {
      d3.select(chartRef.current).selectAll("svg").remove();
      d3.select(chartRef.current).selectAll("div").remove();
    };
  }, [props]);

  useEffect(() => {
    if (needleRef.current) {
      needleRef.current.updateTo(d3.select(chartRef.current), percent);
      previousPercent.current = percent;
    }
  }, [props]);

  const getChangeIndicator = (previous, current) => {
    if (isPositiveGood && previous < current) {
      return {
        isPositive: true,
        bgColor: "#22d273",
        arrowComponent: upArrow,
      };
    } else if (isPositiveGood && previous > current) {
      return {
        isPositive: true,
        bgColor: "#fc6c6c",
        arrowComponent: downArrow,
      };
    } else if (!isPositiveGood && previous < current) {
      return {
        isPositive: false,
        bgColor: "#fc6c6c",
        arrowComponent: upArrow,
      };
    } else {
      return {
        isPositive: false,
        bgColor: "#22d273",
        arrowComponent: downArrow,
      };
    }
  };

  const diffIndicator = getChangeIndicator(preVal, currentValue);

  return (
    <Flex height={height} width={width}>
      {/* {title && titleShow && <Heading fontSize={titleSize}>{title}</Heading>} */}
      <Wrapper ref={chartRef} className="chart-gauge" />
      {graphType == "Gauge Circuit" && diffData?.diffValue && (
        <Bottom width={width} height={height} bgColor={diffIndicator.bgColor}>
          <Text
            width={width}
            arrowCircleSize={arrowCircleSize}
          >{`${diffData?.diffValue}%`}</Text>

          <Circle
            arrowCircleSize={arrowCircleSize}
            bgColor={diffIndicator.bgColor}
            width={width}
          >
            <Svgshow color={diffIndicator.bgColor} size={arrowCircleSize}>
              {" "}
              {diffIndicator.arrowComponent}
            </Svgshow>
          </Circle>
        </Bottom>
      )}
    </Flex>
  );
};

export default ResizeHandlerHOC(GaugeGraph);

GaugeGraph.propTypes = {
  value: PropTypes.number.isRequired,
  rangeData: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.number.isRequired,
      to: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  diffData: PropTypes.shape({
    diffValue: PropTypes.number.isRequired,
    bgColor: PropTypes.string.isRequired,
    arrowDir: PropTypes.oneOf(["up", "down"]).isRequired,
  }),
  title: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  titleSize: PropTypes.string,
  arrowCircleSize: PropTypes.number,
};

// Default prop values
GaugeGraph.defaultProps = {
  height: "300",
  width: "300",
  titleSize: 15,
  arrowCircleSize: 18,
};
