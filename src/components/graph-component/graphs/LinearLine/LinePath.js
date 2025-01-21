import * as d3 from "d3";
import { colorBox, initialValues } from "../utils/graphConst";
import { setUpEvents } from "../utils/graphEvents";
import { formatNumber } from "../utils/graphGrid";

export const linePath = function linePath() {
  let config = {
    ...initialValues,
    enableCurve: false,
    enableStep: false,
    areaLineStroke: "#8676FF",
    areaLineStrokeWidth: 2,
    r: 5,
    enablePointCircle: false,
    fillOpacity: 1,
    // pointCircleFill: "none",
    pointCircleStroke: "#8676FF",
    pointCircleStrokeWidth: 2,
    enableThreshold: false,
    thresholdStroke: "red",
    thresholdStrokeWidth: 2,
    enableGradient: false,
    disableCircleLabel: true,
  };

  // render pointer style
  const renderShape = (lineCircleGrp, pointerStyle, config, d) => {
    // Helper function to create star path
    const starPath = (size) => {
      const starPoints = 5;
      let path = "";
      for (let i = 0; i < starPoints; i++) {
        const angle = (i * 2 * Math.PI) / starPoints;
        const x = size * Math.cos(angle);
        const y = size * Math.sin(angle);
        path += `${x},${y} `;
        const nextAngle = ((i + 1) * 2 * Math.PI) / starPoints;
        const innerX = (size / 2) * Math.cos(nextAngle);
        const innerY = (size / 2) * Math.sin(nextAngle);
        path += `${innerX},${innerY} `;
      }
      return path.trim();
    };
    // Function to append text above the shape
    const appendText = (group, yOffset) => {
      group
        .append("text")
        .attr("class", "pointer-text")
        .attr("x", config.pointerTextPositionOffsetX)// Adjust the xOffset as needed
        .attr("y", -yOffset * config.pointerTextPositionOffsetY) // Adjust the yOffset as needed
        .attr("text-anchor", "middle")
        .text(formatNumber(d.value))
        .style("fill", config.pointerTextColor || "#000")
        .style("font-size", `${config.pointerTextSize || 10}px`)
        .style("font-family", config.pointerTextFontFamily || config.fontFamily || "sans-serif")
        .style("font-weight", config.pointerTextFontWeight || "normal");
    };

    switch (pointerStyle.toLowerCase()) {
      case 'circle':
        if (config.radialEffectOnSelectedPoint) {
          lineCircleGrp
            .append("circle")
            .attr("class", "line-circle-outer")
            .attr("r", d.value > 0 ? 2.5 * config.r : 0)
            .style("fill", d.label === config.activeXLabel ? d.color : "none")
            .style("opacity", 0.3)
            .style("pointer-events", "none");
        }

        lineCircleGrp
          .append("circle")
          .attr("class", "line-circle")
          // .attr("r", (d) => d.value > 0 ? config.r : 0)
          .attr("r", d.value > 0 ? config.r : 0)
          // .style("stroke", (d) => config.pointCircleStroke || d.dashLineColor || d.color1 || d.color)
          .style("stroke", config.pointCircleStroke || d.dashLineColor || d.color1 || d.color)
          .style("stroke-width", config.pointCircleStrokeWidth)
          .style("fill", config.pointCircleFill || "#fff")
          .style("fill", d.label === config.activeXLabel && config.pointerFillEffectOnSelect ? config.pointCircleFill || d.color : "#fff")
          .style("opacity", config.activeLineColor && d.color !== config.activeLineColor && config.highlightHoverLine ? 0.3 : config.fillOpacity)
          .style("cursor", "pointer")
          .on("mousemove", function (event) {
            config.handleMouseMove(event, d, config, "", true); // 'isPointer' toggler is set to true here
            if (config.enablePointResizingAnimation) {
              d3.selectAll(".line-circle")
                .transition()
                .duration(300)
                .ease(d3.easeCubicInOut)
                .attr("r", d.label === config.activeXLabel ? 1.25 * config.r : config.r)
            }

          })
          .on("mouseenter", function (event) {
            if (config.showPointerValueOnHover && d.label === config.activeXLabel) {
              appendText(lineCircleGrp, config.r);
            }
          })
          .on("mouseleave", function (event) {
            config.handleMouseLeave(event, d, config)
            config.showPointerValueOnHover && d3.selectAll(".pointer-text").remove();
          });
        if (config.enablePointResizingAnimation) {
          lineCircleGrp
            .selectAll(".line-circle")
            // .transition()
            // .duration(300)
            // .ease(d3.easeCubicInOut)
            .attr("r", d.label === config.activeXLabel ? 1.25 * config.r : config.r)
        }
        if (config.showAllPointerValueOnHover &&
          config.activeLineColor !== null &&
          config.activeLineColor === d.color) {
          appendText(lineCircleGrp, config.r)
        }
        if (config.showPointerValue) {
          appendText(lineCircleGrp, config.r);
        }
        break;
      case 'diamond':
        if (config.radialEffectOnSelectedPoint) {
          lineCircleGrp
            .append("circle")
            .attr("class", "line-circle-outer")
            .attr("r", d.value > 0 ? 2.5 * config.r : 0)
            .style("fill", d.label === config.activeXLabel ? d.color : "none")
            .style("opacity", 0.3)
            .style("pointer-events", "none");
        }

        lineCircleGrp
          .append("polygon")
          .attr("class", "line-rhombus")
          .attr("points", () => {
            const sideLength = d.value > 0 ? config.r : 0;
            return `
                    0,${-sideLength}
                    ${sideLength},0
                    0,${sideLength}
                    ${-sideLength},0
                  `;
          })
          .style("stroke", config.pointCircleStroke || d.dashLineColor || d.color1 || d.color)
          .style("stroke-width", config.pointCircleStrokeWidth)
          .style("fill", config.pointCircleFill || "#fff")
          .style("fill", d.label === config.activeXLabel && config.pointerFillEffectOnSelect ? config.pointCircleFill || d.color : "#fff")
          .style("opacity", config.activeLineColor && d.color !== config.activeLineColor && config.highlightHoverLine ? 0.3 : config.fillOpacity)
          .style("cursor", "pointer")
          .on("mousemove", function (event) {
            config.handleMouseMove(event, d, config, "", true); // 'isPointer' toggler is set to true here
            if (config.enablePointResizingAnimation) {
              d3.selectAll(".line-rhombus")
                .transition()
                .duration(300)
                .ease(d3.easeCubicInOut)
                // .style("fill", d.label === config.activeXLabel && config.pointerFillEffectOnSelect ? d.color : "#fff")
                .attr("points", () => {
                  const sideLength = d.label === config.activeXLabel ? 1.5 * config.r : config.r;
                  return `
                    0,${-sideLength}
                    ${sideLength},0
                    0,${sideLength}
                    ${-sideLength},0
                  `;
                });
            }
          })
          .on("mouseenter", function (event) {
            if (config.showPointerValueOnHover && d.label === config.activeXLabel) {
              appendText(lineCircleGrp, config.r);
            }
          })
          .on("mouseleave", function (event) {
            config.handleMouseLeave(event, d, config)
            config.showPointerValueOnHover && d3.selectAll(".pointer-text").remove();
          });

        // Apply resizing animation if enabled
        if (config.enablePointResizingAnimation) {
          lineCircleGrp
            .selectAll(".line-rhombus")
            // .transition()
            // .duration(300)
            // .ease(d3.easeCubicInOut)
            // .style("fill", d.label === config.activeXLabel && config.pointerFillEffectOnSelect ? d.color : "#fff")
            .attr("points", () => {
              const sideLength = d.label === config.activeXLabel ? 1.5 * config.r : config.r;
              return `
                  0,${-sideLength}
                  ${sideLength},0
                  0,${sideLength}
                  ${-sideLength},0
                `;

            });
        }
        if (config.showAllPointerValueOnHover &&
          config.activeLineColor !== null &&
          config.activeLineColor === d.color) {
          appendText(lineCircleGrp, config.r)
        }
        if (config.showPointerValue) {
          appendText(lineCircleGrp, config.r);
        }
        break;
      case 'triangle':
        if (config.radialEffectOnSelectedPoint) {
          lineCircleGrp
            .append("circle")
            .attr("class", "line-circle-outer")
            .attr("r", d.value > 0 ? 2.5 * config.r : 0)
            .style("fill", d.label === config.activeXLabel ? d.color : "none")
            .style("opacity", 0.3)
            .style("pointer-events", "none");
        }

        lineCircleGrp
          .append("polygon")
          .attr("class", "line-triangle")
          .attr("points", () => {
            const sideLength = d.value > 0 ? 2 * config.r : 0;
            const halfSide = sideLength / 2;
            return `
                    0,${-halfSide}
                    ${halfSide},${halfSide}
                    ${-halfSide},${halfSide}
                  `;
          })
          .style("stroke", config.pointCircleStroke || d.dashLineColor || d.color1 || d.color)
          .style("stroke-width", config.pointCircleStrokeWidth)
          .style("fill", config.pointCircleFill || "#fff")
          .style("fill", d.label === config.activeXLabel && config.pointerFillEffectOnSelect ? config.pointCircleFill || d.color : "#fff")
          .style("opacity", config.activeLineColor && d.color !== config.activeLineColor && config.highlightHoverLine ? 0.3 : config.fillOpacity)
          .style("cursor", "pointer")
          .on("mousemove", function (event) {
            config.handleMouseMove(event, d, config, "", true);// 'isPointer' toggler is set to true here
            if (config.enablePointResizingAnimation) {
              d3.selectAll(".line-triangle")
                .transition()
                .duration(300)
                .ease(d3.easeCubicInOut)
                // .style("fill", d.label === config.activeXLabel && config.pointerFillEffectOnSelect ? d.color : "#fff")
                .attr("points", () => {
                  const sideLength = d.label === config.activeXLabel ? 2.5 * config.r : 2 * config.r;
                  const halfSide = sideLength / 2;
                  return `
                      0,${-halfSide}
                      ${halfSide},${halfSide}
                      ${-halfSide},${halfSide}
                    `;
                });
            }
          })
          .on("mouseenter", function (event) {
            if (config.showPointerValueOnHover && d.label === config.activeXLabel) {
              appendText(lineCircleGrp, config.r);
            }
          })
          .on("mouseleave", function (event) {
            config.handleMouseLeave(event, d, config)
            config.showPointerValueOnHover && d3.selectAll(".pointer-text").remove();
          });

        // Apply resizing animation if enabled
        if (config.enablePointResizingAnimation) {
          lineCircleGrp
            .selectAll(".line-triangle")
            // .transition()
            // .duration(300)
            // .ease(d3.easeCubicInOut)
            // .style("fill", d.label === config.activeXLabel && config.pointerFillEffectOnSelect ? d.color : "#fff")
            .attr("points", () => {
              const sideLength = d.label === config.activeXLabel ? 2.5 * config.r : 2 * config.r;
              const halfSide = sideLength / 2;
              return `
                    0,${-halfSide}
                    ${halfSide},${halfSide}
                    ${-halfSide},${halfSide}
                  `;
            });
        }
        if (config.showAllPointerValueOnHover &&
          config.activeLineColor !== null &&
          config.activeLineColor === d.color) {
          appendText(lineCircleGrp, config.r)
        }
        if (config.showPointerValue) {
          appendText(lineCircleGrp, config.r);
        }
        break;
      case 'square':
        if (config.radialEffectOnSelectedPoint) {
          lineCircleGrp
            .append("circle")
            .attr("class", "line-circle-outer")
            .attr("r", d.value > 0 ? 2.5 * config.r : 0)
            .style("fill", d.label === config.activeXLabel ? d.color : "none")
            .style("opacity", 0.3)
            .style("pointer-events", "none");
        }

        lineCircleGrp
          .append("rect")
          .attr("class", "line-square")
          .attr("width", d.value > 0 ? 2 * config.r : 0)
          .attr("height", d.value > 0 ? 2 * config.r : 0)
          .attr("x", -config.r)
          .attr("y", -config.r)
          .style("stroke", config.pointCircleStroke || d.dashLineColor || d.color1 || d.color)
          .style("stroke-width", config.pointCircleStrokeWidth)
          .style("fill", config.pointCircleFill || "#fff")
          .style("fill", d.label === config.activeXLabel && config.pointerFillEffectOnSelect ? config.pointCircleFill || d.color : "#fff")
          .style("opacity", config.activeLineColor && d.color !== config.activeLineColor && config.highlightHoverLine ? 0.3 : config.fillOpacity)
          .style("cursor", "pointer")
          .on("mousemove", function (event) {
            config.handleMouseMove(event, d, config, "", true); // 'isPointer' toggler is set to true here
            if (config.enablePointResizingAnimation) {
              d3.selectAll(".line-square")
                .transition()
                .duration(300)
                .ease(d3.easeCubicInOut)
                // .style("fill", d.label === config.activeXLabel && config.pointerFillEffectOnSelect ? d.color : "#fff")
                .attr("x", () => d.label === config.activeXLabel ? -1.2 * config.r : -config.r)
                .attr("y", () => d.label === config.activeXLabel ? -1.2 * config.r : -config.r)
                .attr("width", () => d.label === config.activeXLabel ? 2.5 * config.r : 2 * config.r)
                .attr("height", () => d.label === config.activeXLabel ? 2.5 * config.r : 2 * config.r);
            }
          })
          .on("mouseenter", function (event) {
            if (config.showPointerValueOnHover && d.label === config.activeXLabel) {
              appendText(lineCircleGrp, config.r);
            }
          })
          .on("mouseleave", function (event) {
            config.handleMouseLeave(event, d, config)
            config.showPointerValueOnHover && d3.selectAll(".pointer-text").remove();
          });

        // Apply resizing animation if enabled
        if (config.enablePointResizingAnimation) {
          lineCircleGrp
            .selectAll(".line-square")
            // .transition()
            // .duration(300)
            // .ease(d3.easeCubicInOut)
            // .style("fill", d.label === config.activeXLabel && config.pointerFillEffectOnSelect ? d.color : "#fff")
            .attr("x", () => d.label === config.activeXLabel ? -1.2 * config.r : -config.r)
            .attr("y", () => d.label === config.activeXLabel ? -1.2 * config.r : -config.r)
            .attr("width", () => d.label === config.activeXLabel ? 2.5 * config.r : 2 * config.r)
            .attr("height", () => d.label === config.activeXLabel ? 2.5 * config.r : 2 * config.r);
        }
        if (config.showAllPointerValueOnHover &&
          config.activeLineColor !== null &&
          config.activeLineColor === d.color) {
          appendText(lineCircleGrp, config.r)
        }
        if (config.showPointerValue) {
          appendText(lineCircleGrp, config.r);
        }
        break;
      case 'star':
        if (config.radialEffectOnSelectedPoint) {
          lineCircleGrp
            .append("circle")
            .attr("class", "line-circle-outer")
            .attr("r", d.value > 0 ? 2.5 * config.r : 0)
            .style("fill", d.label === config.activeXLabel ? d.color : "none")
            .style("opacity", 0.3)
            .style("pointer-events", "none");
        }

        lineCircleGrp
          .append("polygon")
          .attr("class", "line-star")
          .attr("points", starPath(d.value > 0 ? config.r : 0))
          .style("stroke", config.pointCircleStroke || d.dashLineColor || d.color1 || d.color)
          .style("stroke-width", config.pointCircleStrokeWidth)
          .style("fill", config.pointCircleFill || "#fff")
          .style("fill", d.label === config.activeXLabel && config.pointerFillEffectOnSelect ? config.pointCircleFill || d.color : "#fff")
          .style("opacity", config.activeLineColor && d.color !== config.activeLineColor && config.highlightHoverLine ? 0.3 : config.fillOpacity)
          .style("cursor", "pointer")
          .on("mousemove", function (event) {
            config.handleMouseMove(event, d, config, "", true); // 'isPointer' toggler is set to true here
            if (config.enablePointResizingAnimation) {
              d3.selectAll(".line-star")
                .transition()
                .duration(300)
                .ease(d3.easeCubicInOut)
                .attr("points", starPath(d.label === config.activeXLabel ? 1.5 * config.r : config.r));
            }
          })
          .on("mouseenter", function (event) {
            if (config.showPointerValueOnHover && d.label === config.activeXLabel) {
              appendText(lineCircleGrp, config.r);
            }
          })
          .on("mouseleave", function (event) {
            config.handleMouseLeave(event, d, config)
            config.showPointerValueOnHover && d3.selectAll(".pointer-text").remove();
          });

        if (config.enablePointResizingAnimation) {
          lineCircleGrp
            .selectAll(".line-star")
            .attr("points", starPath(d.label === config.activeXLabel ? 1.5 * config.r : config.r));
        }
        if (config.showAllPointerValueOnHover &&
          config.activeLineColor !== null &&
          config.activeLineColor === d.color) {
          appendText(lineCircleGrp, config.r)
        }
        if (config.showPointerValue) {
          appendText(lineCircleGrp, config.r);
        }
        break;
      default:
        return
    };

  }

  // type of line
  function setLineCurve(config, lineConst, areaConst) {
    switch (config.curveType.toLowerCase()) {
      case 'curvemonotonex':
        lineConst.curve(d3.curveMonotoneX);
        areaConst.curve(d3.curveMonotoneX);
        break;
      case 'curvemonotoney':
        lineConst.curve(d3.curveMonotoneY);
        areaConst.curve(d3.curveMonotoneY);
        break;
      case 'curvestep':
        lineConst.curve(d3.curveStep);
        areaConst.curve(d3.curveStep);
        break;
      case 'curvestepafter':
        lineConst.curve(d3.curveStepAfter);
        areaConst.curve(d3.curveStepAfter);
        break;
      case 'curvestepbefore':
        lineConst.curve(d3.curveStepBefore);
        areaConst.curve(d3.curveStepBefore);
        break;
      case 'curvebasis':
        lineConst.curve(d3.curveBasis);
        areaConst.curve(d3.curveBasis);
        break;
      case 'curvebasisclosed':
        lineConst.curve(d3.curveBasisClosed);
        areaConst.curve(d3.curveBasisClosed);
        break;
      case 'curvebasisopen':
        lineConst.curve(d3.curveBasisOpen);
        areaConst.curve(d3.curveBasisOpen);
        break;
      case 'curvecardinal':
        lineConst.curve(d3.curveCardinal);
        areaConst.curve(d3.curveCardinal);
        break;
      case 'curvenatural':
        lineConst.curve(d3.curveNatural);
        areaConst.curve(d3.curveNatural);
        break;
      case 'curvebumpx':
        lineConst.curve(d3.curveBumpX);
        areaConst.curve(d3.curveBumpX);
        break;
      case 'curvebumpy':
        lineConst.curve(d3.curveBumpY);
        areaConst.curve(d3.curveBumpY);
        break;
      case 'curvebundle':
        lineConst.curve(d3.curveBundle);
        areaConst.curve(d3.curveCardinal);
        break;
      // case 'curvebundlebeta':
      //   lineConst.curve(d3.curveBundle.beta(config.curveBetaAlphaTension));
      //   areaConst.curve(d3.curveBundle.beta(config.curveBetaAlphaTension));
      //   break;
      case 'curvecardinal':
        lineConst.curve(d3.curveCardinal);
        areaConst.curve(d3.curveCardinal);
        break;
      case 'curvecardinalclosed':
        lineConst.curve(d3.curveCardinalClosed);
        areaConst.curve(d3.curveCardinalClosed);
        break;
      case 'curvecardinalopen':
        lineConst.curve(d3.curveCardinalOpen);
        areaConst.curve(d3.curveCardinalOpen);
        break;
      // case 'curvecardinaltension':
      //   lineConst.curve(d3.curveCardinal.tension(config.curveBetaAlphaTension));
      //   areaConst.curve(d3.curveCardinal.tension(config.curveBetaAlphaTension));
      case 'curvecatmullrom':
        lineConst.curve(d3.curveCatmullRom);
        areaConst.curve(d3.curveCatmullRom);
        break;
      case 'curvecatmullRomclosed':
        lineConst.curve(d3.curveCatmullRomClosed);
        areaConst.curve(d3.curveCatmullRomClosed);
        break;
      case 'curvecatmullromopen':
        lineConst.curve(d3.curveCatmullRomOpen);
        areaConst.curve(d3.curveCatmullRomOpen);
        break;
      // case 'curvecatmullromalpha':
      //   lineConst.curve(d3.curveCatmullRom.alpha(config.curveBetaAlphaTension));
      //   areaConst.curve(d3.curveCatmullRom.alpha(config.curveBetaAlphaTension));
      //   break;
      case 'curvelinearclosed':
        lineConst.curve(d3.curveLinearClosed);
        areaConst.curve(d3.curveLinearClosed);
        break;
      case 'curvelinear':
      default:
        lineConst.curve(d3.curveLinear);
        areaConst.curve(d3.curveLinear);
        break;
    }
  }

  // draw the graph here
  function graph(selected) {
    selected.each(function (data) {
      const t = d3.transition().duration(config.duration);

      selected
        .selectAll(".line-bg-rect")
        .data((d, i) => {
          const accumulatedData = d.flat().reduce((acc, ele) => {
            const existingEle = acc.find(
              (e) => e.rawData.label === ele.rawData.label
            );
            if (existingEle) {
              existingEle.accValue += ele.value;
            } else {
              const newEle = { ...ele };
              newEle.accValue = newEle.value;
              acc.push(newEle);
            }
            return acc;
          }, []);
          return accumulatedData.map((ele, ii) => {
            const newEle = { ...ele };
            for (let iii = 0; iii < d.length; iii++) {
              newEle[d[iii][ii]?.labelText] = d[iii][ii]?.value;
              newEle[`${d[iii][ii]?.labelText}Color`] = d[iii][ii]?.color;
              newEle[`d[iii][ii]?.pointerStyle`] = d[iii][ii]?.pointerStyle;
            }
            return newEle;
          });
        })
        .join(
          (enter) => {
            enter
              .append("rect")
              .attr("class", "line-bg-rect")
              .attr("fill", "transparent")
              .attr("x", (d, i) =>
                i === 0
                  ? config.xScale.step() * i
                  : config.xScale.step() / 2 + config.xScale.step() * (i - 1)
              )
              .attr("width", (d, i) =>
                i === 0
                  ? config.xScale.step() / 2
                  : data[0].length - 1 === i
                    ? config.xScale.step() / 2
                    : config.xScale.step()
              )
              .attr("height", config.graphAreaH);
          },
          (update) => update,
          (exit) => {
            exit.remove();
          }
        )
        .attr("x", (d, i) =>
          i === 0
            ? config.xScale.step() * i
            : config.xScale.step() / 2 + config.xScale.step() * (i - 1)
        )
        .attr("width", (d, i) =>
          i === 0
            ? config.xScale.step() / 2
            : data[0].length - 1 === i
              ? config.xScale.step() / 2
              : config.xScale.step()
        )
        .attr("height", config.graphAreaH);

      function mapValueToHex(value) {
        // Ensure the value is between 0 and 1
        value = Math.max(0, Math.min(1, value));

        // Convert the value to a hexadecimal string
        const hex = Math.floor(value * 0xff)
          .toString(16)
          .padStart(2, "0");
        return hex;
      }

      function lg(eleRef) {
        const gradientOffset = eleRef
          // .attr("cx", "25%")
          // .attr("cy", "25%")
          // .attr("r", "65%")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "0%")
          .attr("y2", "100%")
          .attr("id", function (d, i) {
            return "gradOffset-" + i;
          });

        gradientOffset
          .selectAll(".stop")
          .data((d) => {
            return [d];
          })
          .join(
            (enter) => {
              enter
                .append("stop")
                .attr("class", "stop")
                .attr("offset", "0%")
                .attr("stop-color", (d) => d[0]?.color)
                .attr("stop-opacity", (d) => d[0]?.colorOpacity || 0.5);
            },
            (update) => {
              update
                .attr("offset", "0%")
                .attr("stop-color", (d) => d[0]?.color)
                .attr("stop-opacity", (d) => d[0]?.colorOpacity || 0.5);
            },
            (exit) => exit.remove()
          );
        gradientOffset
          .selectAll(".stop1")
          .data((d) => {
            return [d];
          })
          .join(
            (enter) => {
              enter
                .append("stop")
                .attr("class", "stop")
                .attr("offset", "100%")
                .attr("stop-color", (d) => " #fff")
                .attr("stop-opacity", (d) => d[0]?.colorOpacity || 0.5);
            },
            (update) => {
              update
                .attr("offset", "100%")
                .attr("stop-color", (d) => " #fff")
                .attr("stop-opacity", (d) => d[0]?.colorOpacity || 0.5);
            },
            (exit) => exit.remove()
          );
      }

      function createDefs(elementRef) {
        elementRef
          .selectAll(".gradientOffset")
          .data((d) => {
            return d;
          })
          .join(
            (enter) => {
              enter
                .append("linearGradient")
                .attr("class", "gradientOffset")
                .call(lg);
            },
            (update) => update.call(lg),
            (exit) => exit.remove()
          )
          .call(lg);
      }

      selected
        .selectAll(".defs")
        .data((d) => {
          return [d];
        })
        .join(
          (enter) => {
            enter.append("defs").attr("class", "defs").call(createDefs);
          },
          (update) => update.call(createDefs),
          (exit) => exit.remove()
        )
        .call(createDefs);

      const lineConst = d3.line().x(function (d, i) {
        return config.xScale(d.label);
      });

      const areaConsts = d3.area().x(function (d, i) {
        return config.xScale(d.label);
      });

      // if (config.enableCurve) {
      //   areaConsts.curve(d3.curveMonotoneX);
      //   lineConst.curve(d3.curveMonotoneX); // apply smoothing to the line
      // } else if (config.enableStep) {
      //   areaConsts.curve(d3.curveStepAfter);
      //   lineConst.curve(d3.curveStepAfter); // apply smoothing to the line
      // }
      setLineCurve(config, lineConst, areaConsts);

      const lineFunc = function (datum, boolean) {
        return lineConst.y(function (d) {
          return config.yScale(boolean ? d.value : config.minY);
        })(datum);
      };

      const slineFunc = function (datum, boolean) {
        return lineConst.y(function (d) {
          return config.yScale(boolean ? d.accValue : config.minY);
        })(datum);
      };

      const area = function (datum, boolean) {
        return areaConsts
          .y0(function (d, i) {
            return config.yScale(boolean ? d.value : config.minY);
          })
          .y1(function (d, i) {
            return config.yScale(config.minY);
          })(datum);
      };
      // Construct an stacked area generator.
      const sarea = function (datum, boolean) {
        return areaConsts
          .y0(function (d) {
            return config.yScale(boolean ? d.accValue : config.minY);
          })
          .y1(function (d) {
            return config.yScale(
              boolean
                ? d.accValue === d.value
                  ? config.minY
                  : d.accValue - d.value
                : config.minY
            );
          })(datum);
      };

      // Construct an range area generator.
      const rband = function () {
        return areaConsts
          .y0(function (d, i) {
            return config.yScale(d.value);
          })
          .y1(function (d) {
            return config.yScale(d.lastLineValue);
          });
      };

      if (config.graphType === "rband") {
        selected
          .selectAll(".band-bg")
          .data((d, i) => {
            d.map((entry, j) => {
              const temp = entry.map((ele, k) => {
                const t = JSON.parse(JSON.stringify(ele));
                t.lastLineValue = d[d.length - 1][k].value;
                return t;
              });
              return temp;
            });
            return [d[0]];
          })
          .join(
            (enter) => {
              enter
                .append("path")
                .attr("class", "band-bg")
                .attr("fill", config.bandBGColor || "#f6f6f6")
                .transition(t)
                .attr("d", rband());
            },
            (update) => update,
            (exit) => {
              exit.remove();
            }
          )
          .transition(t)
          .attr("d", rband());
      }

      function mainBaseFunc(elementRef) {
        elementRef
          .selectAll(".line-path")
          .style("opacity", (d) => {
            return config.activeLineColor && d[0].color !== config.activeLineColor && config.highlightHoverLine ? 0.3 : config.fillOpacity;
          })
          .data((d, i) => {
            d.map((entry) => {
              const temp = entry.map((ele) => {
                const t = JSON.parse(JSON.stringify(ele));
                t.lastIndex = entry.length;
                return t;
              });
              return temp;
            });
            const filterD = [];
            d.forEach((element) => {
              filterD.push(element.filter((ele) => ele.value >= 0));
            });
            return filterD;
          })

          .join(
            (enter) => {
              const base = enter.append("path").attr("class", "line-path");
              if (config.graphType === "area" || config.graphType === "sarea") {
                base
                  .attr(
                    "fill",
                    config.graphType === "line" || config.graphType === "rband"
                      ? "none"
                      : (d, i) => {
                        return config.enableGradient
                          ? `url(#gradOffset-${i})`
                          : d[0].color
                            ? d[0].color
                            : colorBox[(i % colorBox.length) - 1];
                      }
                  )
                  .attr("d", (d) =>
                    config.graphType === "area"
                      ? area(d, false)
                      : sarea(d, false)
                  )
                  .style("opacity", (d) => {
                    return config.activeLineColor && d[0].color !== config.activeLineColor && config.highlightHoverLine ? 0.3 : config.fillOpacity;
                  })
                  .transition(t)
                  .attr("fill", (d, i) =>
                    config.enableGradient
                      ? `url(#gradOffset-${i})`
                      : d[0].color
                        ? d[0].color
                        : colorBox[(i % colorBox.length) - 1]
                  )
                  // .style("opacity", config.fillOpacity)
                  .attr("d", (d) =>
                    config.graphType === "area" ? area(d, true) : sarea(d, true)
                  );
              } else {
                base
                  .attr(
                    "fill",
                    config.graphType === "line" || config.graphType === "rband"
                      ? "none"
                      : (d, i) =>
                        d[0].color
                          ? d[0].color
                          : colorBox[(i % colorBox.length) - 1]
                  )
                  .attr("stroke", (d, i) => {
                    const colorsArr = d.map((colorEle) => colorEle.color);
                    const colorVal = colorsArr.filter(function (felement) {
                      return felement !== undefined;
                    });

                    return colorVal.length > 1
                      ? colorVal[i]
                      : colorBox[(i % colorBox.length) - 1];
                  })
                  .attr("stroke-width", config.lineStrokeWidth || 2.5)
                  .attr("stroke-dasharray", config.lineType === 'normal' ? 'none' : config.dashPattern)
                  .attr("d", (d) => lineFunc(d, false))
                  .transition(t)
                  .attr("d", (d) => lineFunc(d, true))
                  .attr("stroke-dasharray", config.lineType === 'normal' ? 'none' : config.dashPattern)
                  .attr("stroke-dashoffset", 0)
                  .style("opacity", (d) => {
                    return config.activeLineColor && d[0].color !== config.activeLineColor && config.highlightHoverLine ? 0.3 : config.fillOpacity;
                  })
              }
            },
            (update) => {
              if (config.graphType === "area" || config.graphType === "sarea") {
                update
                  .attr("fill", (d, i) =>
                    config.enableGradient
                      ? `url(#gradOffset-${i})`
                      : d[0].color
                        ? d[0].color
                        : colorBox[(i % colorBox.length) - 1]
                  )
                  .style("opacity", (d) => {
                    return config.activeLineColor && d[0].color !== config.activeLineColor && config.highlightHoverLine ? 0.3 : config.fillOpacity;
                  })
                  .transition(t)
                  // .style("opacity", config.fillOpacity)
                  .attr("fill", (d, i) =>
                    config.enableGradient
                      ? `url(#gradOffset-${i})`
                      : d[0].color
                        ? d[0].color
                        : colorBox[(i % colorBox.length) - 1]
                  )
                  .attr("d", (d) =>
                    config.graphType === "area" ? area(d, true) : sarea(d, true)
                  );
              } else {
                return (
                  update
                    .attr("stroke", (d, i) => {
                      const colorsArr = d.map((colorEle) => colorEle.color);
                      const colorVal = colorsArr.filter(function (felement) {
                        return felement !== undefined;
                      });
                      return colorVal.length > 1
                        ? colorVal[i]
                        : colorBox[(i % colorBox.length) - 1];
                    })
                    .attr("stroke-width", config.lineStrokeWidth || 2.5)
                    .attr("stroke-dasharray", config.lineType === 'normal' ? 'none' : config.dashPattern)
                    // .attr("d", (d) => lineFunc(d, false))
                    .style("opacity", (d) => {
                      return config.activeLineColor && d[0].color !== config.activeLineColor && config.highlightHoverLine ? 0.3 : config.fillOpacity;
                    })
                    .transition(t)
                    .attr(
                      "fill",
                      config.graphType === "line" ||
                        config.graphType === "rband"
                        ? "none"
                        : (d, i) =>
                          d[0].color
                            ? d[0].color
                            : colorBox[(i % colorBox.length) - 1]
                    )
                    .attr("d", (d) => lineFunc(d, true))
                    .attr("stroke-dasharray", config.lineType === 'normal' ? 'none' : config.dashPattern)
                    .attr("stroke-dashoffset", 0)
                );
              }
            },
            (exit) => {
              exit
                .transition(t)
                .attr("d", (d) =>
                  config.graphType === "area"
                    ? area(d, false)
                    : config.graphType === "sarea"
                      ? sarea(d, false)
                      : lineFunc(d, false)
                )
                .remove();
            }
          );
      }

      selected
        .selectAll(".line-path-group")
        .data((d) => [d])
        .join(
          (enter) => {
            enter
              .append("g")
              .attr("class", "line-path-group")
              .call(mainBaseFunc);
          },
          (update) => update.call(mainBaseFunc),
          (exit) => exit.remove()
        );

      if (config?.summary?.thresholdArr?.length && config.enableThreshold) {
        selected
          .selectAll(".threshold-line-path")
          .data(config.summary.thresholdArr)
          .join(
            (enter) => {
              enter
                .append("line")
                .attr("class", "threshold-line-path")
                .attr("stroke", (d) => d.color || config.thresholdStroke)
                .attr("stroke-width", config.thresholdStrokeWidth)
                .attr("x1", 0)
                .attr("y1", (d) => config.yScale(d.value))
                .attr("x2", config.graphAreaW * 0.95)
                .attr("y2", (d) => config.yScale(d.value))
                .attr("stroke-dasharray", 5)
                .attr("stroke-dashoffset", 0);
            },
            (update) =>
              update
                .attr("y1", (d) => config.yScale(d.value))
                .attr("y2", (d) => config.yScale(d.value)),
            (exit) => {
              exit.remove();
            }
          );

        if (!config.disableThreshouldLabel) {
          selected
            .selectAll(".threshold-line-path-text")
            .data(config.summary.thresholdArr)
            .join(
              (enter) => {
                enter
                  .append("text")
                  .attr("class", "threshold-line-path-text")
                  .attr("x", config.graphAreaW * 0.94)
                  .attr("y", (d) => config.yScale(d.value) - 5)
                  .attr("text-anchor", "end")
                  .attr("fill", (d) => d.color || config.thresholdStroke)
                  .text((d) => `${d.label}-${d.value}`);
              },
              (update) => update,
              (exit) => {
                exit.remove();
              }
            );
        } else {
          selected.selectAll(".threshold-line-path-text").remove();
        }
      } else {
        selected.selectAll(".threshold-line-path").remove();
        selected.selectAll(".threshold-line-path-text").remove();
      }

      if (config.graphType !== "line" && config.enableAreaLine) {
        selected
          .selectAll(".line-path-area-line")
          .data((d, i) => {
            d.map((entry) => {
              const temp = entry.map((ele) => {
                const t = JSON.parse(JSON.stringify(ele));
                t.lastIndex = entry.length;
                return t;
              });
              return temp;
            });
            return d;
          })
          .join(
            (enter) => {
              enter
                .append("path")
                .attr("class", "line-path-area-line")
                .attr("fill", "none")
                .attr("stroke", (d, i) => {
                  return d[i]?.dashLineColor
                    ? d[i]?.dashLineColor
                    : config.areaLineStroke;
                })
                .attr("stroke-width", config.areaLineStrokeWidth)
                .attr("d", (d) =>
                  config.graphType === "sarea"
                    ? slineFunc(d, false)
                    : lineFunc(d, false)
                )
                .transition(t)
                .attr("d", (d) =>
                  config.graphType === "sarea"
                    ? slineFunc(d, true)
                    : lineFunc(d, true)
                )
                .attr("stroke-dasharray", (d, i) =>
                  d[i]?.enableDash ? "3,3" : "0,0"
                );
            },
            (update) =>
              update

                .transition(t)
                .attr("stroke", (d, i) => {
                  return d[i]?.dashLineColor
                    ? d[i]?.dashLineColor
                    : config.areaLineStroke;
                })
                .attr("stroke-width", config.areaLineStrokeWidth)
                .attr("d", (d) =>
                  config.graphType === "sarea"
                    ? slineFunc(d, true)
                    : lineFunc(d, true)
                )
                .attr("stroke-dashoffset", 0),
            (exit) => {
              exit.remove();
            }
          );
      }


      if (config.enablePointCircle) {
        // Function to update circles based on activeXLabel
        const updateCircles = () => {
          selected.selectAll(".line-circle-grp").remove(); // Remove existing circles

          // Re-append circles with updated data based on activeXLabel
          const lineCircleGrpMain = selected
            .selectAll(".line-circle-grp")
            .data((d, i) => d.flat(Infinity))
            .join(
              (enter) => {
                const lineCircleGrp = enter
                  .append("g")
                  .attr("class", "line-circle-grp")
                  .attr("transform", (d, i) => {
                    return `translate(${config.xScale(d.label)},${config.yScale(
                      config.graphType === "sarea" ? d.accValue : d.value
                    )})`;
                  });

                lineCircleGrp
                  .append((d) => {
                    const el = document.createElementNS("http://www.w3.org/2000/svg", "g");
                    renderShape(d3.select(el), String(d.pointerStyle), config, d);
                    return el;
                  })

                // if (!config.disableCircleLabel) {
                //   lineCircleGrp
                //     .append("text")
                //     .attr("class", "line-circle-label")
                //     .attr("x", config.r * 1.5)
                //     .attr("y", (d) => {
                //       return (d.labelIndex % 2 === 0 ? -1 : 1) * config.r * 3;
                //     })
                //     .attr("font-size", config.pointCircleFontSize)
                //     .text((d) => (isNaN(d.value) ? "" : d.value || ""));
                // }
                // Add hover event listeners
                if (config.highlightHoverLine) {
                  lineCircleGrp
                    .on("mouseover", function (event, d) {
                      d3.selectAll(".line-path")
                        .style("opacity", function (lineData) {
                          // Check if the color of the circle matches any segment of the line path
                          const colorsArr = lineData.map((segment) => segment.color);
                          return colorsArr.includes(d.color) ? 1 : 0.3;
                        });

                      // // Adjust line-circle-grp opacity based on color match
                      // d3.selectAll(".line-circle-grp")
                      //   .style("opacity", function (circleData) {
                      //     return circleData.color === d.color ? 1 : 0.3;
                      //   });
                    })
                    .on("mouseout", function (event, d) {
                      d3.selectAll(".line-path")
                        .style("opacity", 1)
                        .attr("stroke", "initial");

                      // d3.selectAll(".line-circle-grp")
                      //   .style("opacity", 1)
                      //   .attr("stroke", "initial")
                      //   .attr("fill", "initial");
                    });
                }
              },
              (update) =>
                update
                  .attr("transform", (d, i) => {
                    return `translate(${config.xScale(d.label)},${config.yScale(
                      config.graphType === "sarea" ? d.accValue : d.value
                    )})`;
                  })
                  .attr("font-size", config.pointerTextSize),
              (exit) => {
                exit.remove();
              }
            );

          // lineCircleGrpMain.selectAll(".line-circle").remove();
          // lineCircleGrpMain.selectAll(".line-circle-label").remove();

          // lineCircleGrpMain
          //   .append("circle")
          //   .attr("class", "line-circle")
          //   .attr("r", (d) => {
          //     return d.value > 0 ? config.r : 0;
          //   })
          //   .style("stroke", (d, i) => {
          //     return (
          //       config.pointCircleStroke || d.dashLineColor || d.color1 || d.color
          //     );
          //   })
          //   .style("stroke-width", config.pointCircleStrokeWidth)
          //   .style("fill", config.pointCircleFill || "#fff")
          //   .style("opacity", config.fillOpacity);

          // if (!config.disableCircleLabel) {
          //   lineCircleGrpMain
          //     .append("text")
          //     .attr("class", "line-circle-label")
          //     .attr("x", config.r * 1.5)
          //     .attr("y", (d) => {
          //       return (d.labelIndex % 2 === 0 ? -1 : 1) * config.r * 3;
          //     })
          //     .text((d) => (isNaN(d.value) ? "" : d.value || ""));
          // }
        };

        // Call the updateCircles function whenever activeXLabel changes
        selected.call(updateCircles);
      }
      else {
        selected.selectAll(".line-circle-grp").remove();
      }

      if (config.enableAllPointToolTip) {
        const tooltipWidth = config.xScale.step() * 0.8;
        const tooltipHeight = 60;
        const tooltipArrowLength = 10;
        const ToolTextXAlign = 5;
        const ToolTextYAlign = 18;
        const toolLegR = config.toolLegR || 5;

        const toolLegend = (selectedItem, x, y, dataIndex) => {
          const legGrp = selectedItem
            .append("g")
            .attr("class", "line-point-tooltip-legend-grp")
            .attr("transform", (d, i) => {
              return `translate(${x},${y})`;
            });
          legGrp
            .append("circle")
            .attr("class", "line-point-tooltip-legend")
            .attr("cy", -1 * (toolLegR * 0.85))
            .attr("r", toolLegR)
            .style("stroke", (d, i) =>
              data[dataIndex][i].value ? data[dataIndex][i].color : "#fff"
            )
            .style("stroke-width", config.pointCircleStrokeWidth)
            .style("fill", config.pointCircleFill);
          legGrp
            .append("text")
            .attr("class", "line-point-tooltip-v1")
            .attr("x", toolLegR * 1.75)
            .text((d, i) => {
              return data[dataIndex][i].value || "";
            });
        };

        const toolTipFun = (selectedItem) => {
          selectedItem
            .attr("transform", (d, i) => {
              const tempArr = data.map((ele) => {
                return ele[i].value || 0;
              });
              const maxOfList = d3.max(tempArr);

              return `translate(${config.xScale(d.label) - tooltipWidth * 0.2
                },${config.yScale(maxOfList) -
                (tooltipHeight + tooltipArrowLength + 5)
                })`;
            })
            .style("display", (d, i) => {
              return data[0][i].value || data[1][i].value ? "" : "none";
            });
          selectedItem.selectAll(".line-point-tooltip-rect").remove();
          selectedItem.selectAll(".line-point-tooltip-title").remove();
          selectedItem.selectAll(".line-point-tooltip-legend-grp").remove();
          selectedItem
            .append("rect")
            .attr("class", "line-point-tooltip-rect")
            .attr("width", tooltipWidth)
            .attr("height", tooltipHeight)
            .attr("fill", "white")
            .attr("stroke", "#DCDFF0");

          selectedItem
            .append("text")
            .attr("class", "line-point-tooltip-title")
            .attr("x", ToolTextXAlign)
            .attr("y", ToolTextYAlign)
            .text((d) => {
              return d.label;
            });

          toolLegend(selectedItem, ToolTextXAlign * 2, ToolTextYAlign * 2, 0);
          toolLegend(selectedItem, ToolTextXAlign * 2, ToolTextYAlign * 3, 1);
        };

        const mainToolTipGrp = selected
          .selectAll(".line-point-tooltip")
          .data((d, i) => d[0] || [])
          .join(
            (enter) => {
              const tooltipGrp = enter
                .append("g")
                .attr("class", "line-point-tooltip");

              toolTipFun(tooltipGrp);
            },
            (update) => update,
            (exit) => {
              exit.remove();
            }
          );

        toolTipFun(mainToolTipGrp);
      }

      selected.transition(t).attr("width", config.width);

      if (config.rectIndicator) {
        selected
          .selectAll(".line-rect-indicator-rect")
          .data([data[config.selected || 0]])
          .join(
            (enter) => {
              enter
                .append("rect")
                .attr("class", "line-rect-indicator-rect")
                .style("fill", config.indicatorColor || "#cccccc80")
                .attr(
                  "x",
                  config.selected === 0
                    ? config.xScale.step() * config.selected
                    : config.xScale.step() / 2 +
                    config.xScale.step() * (config.selected - 1)
                )
                .attr("width", (d, i) =>
                  config.selected === 0
                    ? config.xScale.step() / 2
                    : data[0].length - 1 === config.selected
                      ? config.xScale.step() / 2
                      : config.xScale.step()
                )
                .attr("y", 0)
                .transition(t)
                .attr("height", config.graphAreaH);
            },
            (update) => update,
            (exit) => {
              exit.transition(t).attr("height", 0).attr("width", 0).remove();
            }
          )
          .transition(t)
          .style("fill", config.indicatorColor || "#cccccc80")
          .attr(
            "x",
            config.selected === 0
              ? config.xScale.step() * config.selected
              : config.xScale.step() / 2 +
              config.xScale.step() * (config.selected - 1)
          )
          .attr("width", (d, i) =>
            config.selected === 0
              ? config.xScale.step() / 2
              : data[0].length - 1 === config.selected
                ? config.xScale.step() / 2
                : config.xScale.step()
          )
          .attr("y", 0)
          .attr("height", config.graphAreaH);
      }

      if (config.showAllPointerValueOnHover) {
        const linePath = selected.selectAll(".line-path")
        linePath
          .on("mouseover", function (event, d) {
            config.handleMouseMove(event, d, config, "", false, true);
          })
          .on("mouseleave", function (event) {
            config.handleMouseLeave(event, d, config)
            config.showPointerValueOnHover && d3.selectAll(".pointer-text").remove();
          });
        // setUpEvents(config, selected, "line-path-group");
        setUpEvents(config, selected, "line-path");
        // setUpEvents(config, selected, "line-bg-rect");
        // setUpEvents(config, selected, "line-circle-grp");
      }

      setUpEvents(config, selected, "line-bg-rect");
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
