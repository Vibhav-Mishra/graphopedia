/* eslint-disable indent */
import * as d3 from "d3";
import { initialValues } from "./graphConst";

const ranges = [
  { divider: 1e18, suffix: "E" },
  { divider: 1e15, suffix: "P" },
  { divider: 1e12, suffix: "T" },
  { divider: 1e9, suffix: "G" },
  { divider: 1e6, suffix: "M" },
  { divider: 1e3, suffix: "k" },
];

export const formatNumber = (n) => {
  if (n === 0 || n < 1000 || Number.isNaN(n)) {
    return n;
  }
  for (let i = 0; i < ranges.length; i++) {
    if (n < 0) {
      return "-" + formatNumber(-n);
    }
    if (n >= ranges[i].divider) {
      const formattedValue = (n / ranges[i].divider).toFixed(1);
      if (formattedValue.endsWith(".0")) {
        return parseInt(formattedValue) + ranges[i].suffix;
      } else {
        return formattedValue + ranges[i].suffix;
      }
    }
  }
  return n?.toString();
};

export const xAxis = function xAxis() {
  let config = {
    ...initialValues,
    fontFamily: "inherit",
    xAxisType: "text",
    enableGridXLine: false,
    gridLineXStroke: "#D0D3E5",
    highlightColor: "#000000",
    gridHoverColor: "#000",
  };

  const t = d3
    .transition()
    .delay(function (d, i) {
      return i * 3;
    })
    .duration(config.duration);

  function graph(selected) {
    selected.each((data) => {
      const hasNegative = data[0].some((d) => d.value < 0);

      if (!config.hideXAxis) {
        const numOfTicks = data[0].length;
        const xAxis = selected.selectAll(".x").data([data]);
        const BrowserText = (function () {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          /**
           * Measures the rendered width of arbitrary text given the font size and font face
           * @param {string} text The text to measure
           * @param {number} fontSize The font size in pixels
           * @param {string} fontFace The font face ("Arial", "Helvetica", etc.)
           * @returns {number} The width of the text
           **/
          function getWidth(text, fontSize, fontFace) {
            context.font = fontSize + "px " + fontFace;
            return context.measureText(text).width;
          }

          return {
            getWidth,
          };
        })();
        const xAxist = d3.axisBottom(config.xScale);
        if (config.gridXTicks) {
          xAxist.ticks(config.gridXTicks);
        }
        if (config.xAxisType === "text") {
          xAxist.tickFormat((d, i) => {
            if (config.singleLineWrp) {
              const xWidth =
                config.xScale.bandwidth() -
                config.gutterSpace / data.length -
                (config.columnGroupPadding || 0);
              let maxWidth =
                config.gutterSpace +
                (xWidth / data.length - (config.columnGroupPadding || 0)) * 2;
              maxWidth = maxWidth * (config.singleLineWrpWidth || 0.5);
              if (config.statusCircleRadius) {
                maxWidth = maxWidth - config.statusCircleRadius * 2;
              }
              if (d === config.activeXLabel) {
                return d;
              }
              if (BrowserText.getWidth(d, config.fontSize || 16) > xWidth) {
                const charLen =
                  BrowserText.getWidth(d, config.fontSize || 16) / d.length;

                const maxChar = Math.floor(maxWidth / charLen);

                if (d.length < maxChar) {
                  return d;
                }

                const skipper = Math.ceil(numOfTicks / config.gridXTicks);

                const bandWidth =
                  config.xScale.bandwidth() || config.xScale.step();
                const skippedMaxChar = Math.floor(
                  (bandWidth * (skipper > 0 ? skipper - 0.25 : 0)) / charLen
                );

                return config.gridXTicks
                  ? i % skipper === 0
                    ? d.length < skippedMaxChar
                      ? d
                      : `${d.slice(0, skippedMaxChar)}..`
                    : ""
                  : `${d.slice(0, maxChar)}..`;
              }
              return d;
            }

            // if (typeof d === 'string' && d.length - 1 > 10) {
            //   return i % Math.ceil(numOfTicks / 6) === 0
            //     ? `${d.slice(0, 7)}..`
            //     : '';
            // }
            if (d === config.activeXLabel) {
              return d;
            }
            if (config.gridXTicks) {
              return i % Math.ceil(numOfTicks / config.gridXTicks) === 0
                ? d
                : "";
            }

            return d;
          });
        }
        // } else {
        //   xAxist.tickFormat((d, i) => {
        //     return config.xAxisTicksFormat ? formatNumber(d) : d;
        //   });
        // }

        const xAxisn = d3.axisBottom(config.xScaleN);

        if (config.gridXTicks) {
          xAxisn.ticks(config.gridXTicks).tickSizeInner(0);
        }

        if (config.xAxisType === "number") {
          xAxisn.tickFormat((d, i) => {
            return config.valueInPercent
              ? `${config.xAxisTicksFormat ? formatNumber(d) : d}%`
              : config.xAxisTicksFormat
              ? formatNumber(d)
              : d;
          });
        }

        const clearArea =
          config.width < config.height ? config.width : config.height;
        // xAxis
        //   .enter()
        //   .append("g")
        //   .attr("class", "x axis")
        //   .merge(xAxis)
        //   .attr(
        //     "transform",
        //     `translate(${config.yLabelAlignment + config.padding.left},${
        //       config.xAxisPosition === "center"
        //         ? config.yScale(0)
        //         : config.graphAreaH
        //     })`
        //   )
        //   .transition()
        //   .duration(config.duration)
        //   .call(config.xAxisType === "text" ? xAxist : xAxisn)
        //   .selectAll("text")
        //   .attr("y", config.xAxisLabelBreatingSpace)
        //   .attr("font-size", config.gridXYLabelFontSize || clearArea * 0.05)
        //   .style("font-weight", (d) => {
        //     const activeLabel = config.activeXLabel
        //       ? config.activeXLabel === d
        //       : config.data?.find((data) => data?.active)?.label === d;
        //     if (activeLabel) return "bold";
        //   });

        selected
          .selectAll(".x")
          .data([data])
          .join(
            (enter) => {
              enter
                .append("g")
                .attr("class", "x axis")
                .attr(
                  "transform",
                  `translate(${config.yLabelAlignment + config.padding.left},${
                    config.xAxisPosition === "center"
                      ? config.yScale(0)
                      : config.graphAreaH
                  })`
                )
                .transition()
                .duration(config.duration)
                .call(config.xAxisType === "text" ? xAxist : xAxisn)
                .attr(
                  "font-size",
                  config.gridXYLabelFontSize || clearArea * 0.05
                )
                .style("font-weight", (d) => {
                  const activeLabel = config.activeXLabel
                    ? config.activeXLabel === d
                    : config.data?.find((data) => data?.active)?.label === d;
                  if (activeLabel) return "bold";
                })
                .selectAll("text")
                .each(function (d) {
                  const textColor =
                    d === config.activeXLabel
                      ? config.gridHoverColor
                      : config.axesLabelColor;
                  d3.select(this).style("color", textColor);
                })
                .attr("font-family", config.fontFamily)
                .attr("stroke", (d) =>
                  d === config.activeXLabel ? config.gridHoverColor : null
                );
            },
            (update) =>
              update
                .attr(
                  "transform",
                  `translate(${config.yLabelAlignment + config.padding.left},${
                    config.xAxisPosition === "center"
                      ? config.yScale(0)
                      : config.graphAreaH
                  })`
                )
                .transition()
                .duration(config.duration)
                .call(config.xAxisType === "text" ? xAxist : xAxisn)
                .attr(
                  "font-size",
                  config.gridXYLabelFontSize || clearArea * 0.05
                )
                .style("font-weight", (d) => {
                  const activeLabel = config.activeXLabel
                    ? config.activeXLabel === d
                    : config.data?.find((data) => data?.active)?.label === d;
                  if (activeLabel) return "bold";
                })
                .selectAll("text")
                .each(function (d) {
                  const textColor =
                    d === config.activeXLabel
                      ? config.gridHoverColor
                      : config.axesLabelColor;
                  d3.select(this).style("color", textColor);
                })
                .attr("font-family", config.fontFamily)
                .attr("stroke", (d) =>
                  d === config.activeXLabel ? config.gridHoverColor : null
                ),
            (exit) => {
              exit.remove();
            }
          );

        selected
          .selectAll(".x")
          .selectAll(".tick line")
          .attr("stroke", config.axisStrokeColor);

        selected
          .selectAll(".x")
          .selectAll(".tick text")
          .style("fill", config.fontColor)
          .style("font-weight", config.xAxisFontWeight);

        selected
          .selectAll(".x")
          .selectAll(".domain")
          .style("stroke", config.axisStrokeColor);

        selected
          .selectAll(".x")
          .selectAll(".tick")
          .selectAll("title")
          .data((d) => [d])
          .join(
            (enter) => {
              enter.append("title").text((d) => d);
            },
            (update) => update.text((d) => d)
          );
        if (config.activeXLabel) {
          selected
            .selectAll(".x")
            .selectAll(".tick")
            .selectAll("line.active-label")
            .remove();

          selected
            .selectAll(".x")
            .selectAll(".tick")
            .selectAll("line.active-label")
            .data((d) => [d])
            .join(
              (enter) =>
                enter
                  .append("line")
                  .attr("class", "active-label")
                  .filter((d) =>
                    config.activeXLabel
                      ? config.activeXLabel === d
                      : config.data?.find((data) => data?.active)?.label === d
                  )
                  .each(function (d) {
                    const baseY2 = 20;
                    const baseTranslateY = -10;
                    const adjustmentFactor = 5;
                    const y2Adjustment =
                      d.length > 3 ? (d.length - 3) * adjustmentFactor : 0;
                    const translateYAdjustment = y2Adjustment / 2;
                    const fontSize = config.gridXYLabelFontSize || 12; // Default font size is 12
                    d3.select(this)
                      .attr("y1", 0)
                      .attr("y2", baseY2 + y2Adjustment)
                      .attr("stroke", config.highlightColor)
                      .attr(
                        "transform",
                        `rotate(90) translate(22, ${
                          baseTranslateY - translateYAdjustment
                        })`
                      )
                      .transition()
                      // .duration(config.duration)
                      .duration(0)
                      .attr("stroke-width", 2);
                  }),
              (update) =>
                update
                  .filter((d) =>
                    config.activeXLabel
                      ? config.activeXLabel === d
                      : config.data?.find((data) => data?.active)?.label === d
                  )
                  .each(function (d) {
                    const tickGroup = d3.select(this.parentNode);
                    const textElement = tickGroup.select("text");
                    const bbox = textElement.node().getBBox();
                    d3.select(this)
                      .attr("transform", null)
                      .attr("x1", bbox.x)
                      .attr("y1", bbox.y + bbox.height + 2)
                      .attr("x2", bbox.x + bbox.width)
                      .attr("y2", bbox.y + bbox.height + 2)
                      .attr("stroke-width", 2)
                      .transition()
                      .duration(config.duration)
                      .attr("stroke", config.highlightColor);
                  })
            );
        } else {
          selected
            .selectAll(".x")
            .selectAll(".tick")
            .selectAll("line.active-label")
            .remove();
        }

        if (config.activeYLabel && config.xAxisType === "number") {
          selected
            .selectAll(".y")
            .selectAll(".tick")
            .selectAll("line.active-label")
            .remove();
          selected
            .selectAll(".y")
            .selectAll(".tick")
            .selectAll("line.active-label")
            .data((d) => [d])
            .join(
              (enter) =>
                enter
                  .append("line")
                  .attr("class", "active-label")
                  .filter((d) =>
                    config.activeYLabel
                      ? config.activeYLabel === d
                      : config.data?.find((data) => data?.active)?.label === d
                  )
                  .each(function (d) {
                    const tickGroup = d3.select(this.parentNode);
                    const textElement = tickGroup.select("text");
                    const bbox = textElement.node().getBBox();
                  }),
              (update) =>
                update
                  .filter((d) =>
                    config.activeYLabel
                      ? config.activeYLabel === d
                      : config.data?.find((data) => data?.active)?.label === d
                  )
                  .each(function (d) {
                    const tickGroup = d3.select(this.parentNode);
                    const textElement = tickGroup.select("text");
                    const bbox = textElement.node().getBBox();
                    d3.select(this)
                      .attr("transform", null)
                      .attr("x1", bbox.x)
                      .attr("y1", bbox.y + bbox.height + 2)
                      .attr("x2", bbox.x + bbox.width)
                      .attr("y2", bbox.y + bbox.height + 2)
                      .attr("stroke-width", 2)
                      .transition()
                      .duration(config.duration)
                      .attr("stroke", config.highlightColor);
                  })
            );
        } else {
          selected
            .selectAll(".y")
            .selectAll(".tick")
            .selectAll("line.active-label")
            .remove();
        }

        if (config.statusCircle) {
          selected
            .selectAll(".x")
            .selectAll(".tick")
            .selectAll("circle")
            .data((d) => {
              return [d];
            })
            .join(
              (enter) => {
                enter
                  .append("circle")
                  .attr("r", config.statusCircleRadius || 5)

                  .attr(
                    "cy",
                    config.xAxisLabelBreatingSpace +
                      (config.statusCircleRadius || 0)
                  )
                  .attr("fill", (d, i) => {
                    return data.length > 0
                      ? data[0].filter((ele) => ele.label === d)[0]
                          ?.statusCircleColor || "red"
                      : "red";
                  })
                  .attr("cx", 0)
                  .transition(t)
                  .attr("cx", (d) => {
                    const xWidth =
                      config.xScale.bandwidth() -
                      config.gutterSpace / data.length -
                      (config.groupgutterSpace || 0);
                    let maxWidth =
                      config.gutterSpace +
                      (xWidth / data.length - (config.groupgutterSpace || 0)) *
                        2;
                    maxWidth = maxWidth * (config.singleLineWrpWidth || 0.5);
                    if (config.statusCircleRadius) {
                      maxWidth = maxWidth - config.statusCircleRadius * 2;
                    }
                    let finalText = d;
                    if (
                      BrowserText.getWidth(d, config.fontSize || 16) > xWidth
                    ) {
                      const charLen =
                        BrowserText.getWidth(d, config.fontSize || 16) /
                        d.length;

                      const maxChar = Math.floor(maxWidth / charLen);

                      if (d.length < maxChar) {
                        finalText = d;
                      }
                      finalText = `${d.slice(0, maxChar)}..`;
                    }
                    // finalText = d;

                    const wordLength = BrowserText.getWidth(
                      finalText,
                      config.fontSize || 16
                    );
                    return (
                      -1 *
                      (wordLength / (config.statusCircleXSpacing || 1.8) +
                        config.statusCircleRadius * 2)
                    );
                  });
              },
              (update) => update,
              (exit) => {
                exit.remove();
              }
            )
            .transition(t)
            .attr("fill", (d, i) => {
              return data.length > 0
                ? data[0].filter((ele) => ele.label === d)[0]
                    ?.statusCircleColor || "red"
                : "red";
            })
            .attr("cx", (d) => {
              const xWidth =
                config.xScale.bandwidth() -
                config.gutterSpace / data.length -
                (config.groupgutterSpace || 0);
              let maxWidth =
                config.gutterSpace +
                (xWidth / data.length - (config.groupgutterSpace || 0)) * 2;
              maxWidth = maxWidth * (config.singleLineWrpWidth || 0.5);
              if (config.statusCircleRadius) {
                maxWidth = maxWidth - config.statusCircleRadius * 2;
              }
              let finalText = d;
              if (BrowserText.getWidth(d, config.fontSize || 16) > xWidth) {
                const charLen =
                  BrowserText.getWidth(d, config.fontSize || 16) / d.length;

                const maxChar = Math.floor(maxWidth / charLen);

                if (d.length < maxChar) {
                  finalText = d;
                }
                finalText = `${d.slice(0, maxChar)}..`;
              }
              // finalText = d;

              const wordLength = BrowserText.getWidth(
                finalText,
                config.fontSize || 16
              );
              return (
                -1 *
                (wordLength / (config.statusCircleXSpacing || 1.8) +
                  config.statusCircleRadius * 2)
              );
            });
        }
      } else {
        selected.selectAll(".x").remove();
      }

      if (!config.enableGridXLine && hasNegative) {
        selected
          .selectAll(".x")
          .selectAll(".tick")
          .selectAll(".x-axis-line")

          .data((d, i) => [{ label: d, index: i }])
          .join(
            (enter) =>
              enter
                .append("line")
                .attr("class", "x-axis-line")
                .filter(function (d) {
                  if (d.label === 0) {
                    return true;
                  }
                  return false;
                })
                .attr("stroke", config.gridLineXStroke)
                .attr("stroke-width", config.gridLineStrokeWidth)
                .attr("y2", 0)
                .attr(
                  "y1",
                  -1 * (config.graphAreaH - config.xAxisLabelBreatingSpace)
                ),
            (update) => {
              return update;
            },
            (exit) => {
              exit.remove();
            }
          );
      }

      if (config.enableGridXLine) {
        selected
          .selectAll(".x")
          .selectAll(".tick")
          .selectAll(".x-axis-line")
          .remove();

        selected
          .selectAll(".x")
          .selectAll(".tick")
          .selectAll(".x-axis-line")
          .data((d, i) => [{ label: d, index: i }])
          .join(
            (enter) =>
              enter
                .append("line")
                .attr("class", "x-axis-line")
                .attr("stroke", (d) =>
                  d.label === config.activeXLabel
                    ? config.gridHoverColor
                    : config.gridLineXStroke
                )
                // .attr("stroke-width", (d) => {
                //   return d.label !== 0 ? config.gridLineStrokeWidth : 0;
                // })
                .attr("stroke-width", config.gridLineStrokeWidth)
                .attr("y2", 0)
                .attr(
                  "y1",
                  -1 * (config.graphAreaH - config.xAxisLabelBreatingSpace)
                )
                // .attr("x1", (d, i) => config.xScale.bandwidth() / 2)
                // .attr("x2", (d, i) => config.xScale.bandwidth() / 2)
                .attr("stroke-dasharray", config.dasharray),
            (update) =>
              update
                .attr("stroke", (d) =>
                  d.label === config.activeXLabel
                    ? config.gridHoverColor
                    : config.gridLineXStroke
                )
                // .attr("stroke-width", (d) => {
                //   return d.label !== 0 ? config.gridLineStrokeWidth : 0;
                // }),,
                .attr("stroke-width", config.gridLineStrokeWidth),
            (exit) => {
              exit.remove();
            }
          );
      } else {
        selected
          .selectAll(".x")
          .selectAll(".tick")
          .selectAll(".x-axis-line")
          .filter(function (d) {
            if (d.label === 0) {
              return false;
            }
            return true;
          })
          .remove();
      }

      if (config.xLabelPos) {
        selected
          .selectAll(".x")
          .selectAll(".tick")
          .style("stroke", config.axisStrokeColor)
          .selectAll("text")
          .each(function (data) {
            const tick = d3.select(this);
            tick.attr("x", config.xScale.step() * config.xLabelPos);
            // tick.attr("transform", (d) => {
            //   return `translate(${
            //     config.yLabelAlignment +
            //     config.padding.left +
            //     config.xScale.step() * config.xLabelPos
            //   },${config.graphAreaH})px`;
            // });
          });
      }

      if (config.tickClick) {
        const tickSelect = selected.selectAll(".tick");
        tickSelect
          .selectAll("text")
          .style("cursor", "pointer")
          .on("click", (event, d) => {
            const clickedData = getClickedData(d, data);
            config.tickClick(event, clickedData, undefined);
          });
      }

      //Rotating the x label ticks
      // selected
      //   .selectAll(".x")
      //   .selectAll(".tick")
      //   .selectAll("text")
      //   .data((d) => [d])
      //   .join(
      //     (enter) => {},
      //     (update) => {
      //       const bandWidth = config.xScale.bandwidth();
      //       update
      //         .attr(
      //           "dx",
      //           bandWidth <= 40 ? config.xAxisLabelBreatingSpace : 0
      //         ) // Adjust dx for label positioning
      //         .attr(
      //           "dy",
      //           bandWidth <= 20
      //             ? -config.xAxisLabelBreatingSpace + 3
      //             : bandWidth <= 40
      //             ? 0
      //             : config.xAxisLabelBreatingSpace
      //         ) // Adjust dy for label positioning
      //         .attr("transform", function (d) {
      //           console.log(config.xScale.bandwidth(), d);
      //           const angle =
      //             bandWidth <= 20
      //               ? 90
      //               : bandWidth <= 30
      //               ? 60
      //               : bandWidth <= 40
      //               ? 45
      //               : 0;
      //           return `rotate(${angle})`;
      //         })
      //         .attr(
      //           "text-anchor",
      //           config.xScale.bandwidth() < 40 ? "start" : "middle"
      //         )
      //         .text((d) => d);
      //     },
      //     (exit) => {
      //       exit.remove();
      //     }
      //   );
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

const getClickedData = (d, inData) => {
  const data = inData.length > 0 ? inData[0] : inData;
  const filteredData = data.filter((ele) => ele.label === d);
  return filteredData.length > 0 ? filteredData[0] : { label: d };
};

export const yAxis = function yAxis() {
  let config = {
    ...initialValues,
    yAxisType: "text",
    enableGridYLine: false,
    gridLineYStroke: "#D0D3E5",
    duration: 500,
    axesLabelColor: "#000",
  };

  function graph(selected) {
    selected.each((data) => {
      const hasNegative = data[0].some((d) => d.value < 0);

      if (!config.hideYAxis) {
        // const yAxisGroup = selected.selectAll('.y').data([data])

        // const yAxisGroup = selected
        //   .selectAll('.y')
        //   .data([data])
        //   .join(
        //     (enter) => {
        //       enter.append('g').attr('class', 'y')
        //     },
        //     (update) => update,
        //     (exit) => {
        //       exit.remove()
        //     }
        //   )

        const yaxis = d3.axisLeft(config.yScale);

        if (config.gridYTicks) {
          yaxis.ticks(config.gridYTicks);
        }

        if (config.yAxisType === "text") {
          yaxis.tickFormat((d, i) => {
            if (typeof d === "string" && d.length > (config.wrapLength || 8)) {
              return `${d.slice(0, config.wrapLength || 8)}..`;
            }

            return d;
          });
        } else {
          yaxis.tickFormat((d, i) => {
            return config.yAxisTicksFormat ? formatNumber(d) : d;
          });
        }

        const clearArea =
          config.width < config.height ? config.width : config.height;

        selected
          .selectAll(".y")
          .data([data])
          .join(
            (enter) => {
              enter
                .append("g")
                .attr("class", "y axis")
                .attr(
                  "transform",
                  `translate(${config.yLabelAlignment + config.padding.left},0)`
                )
                .transition()
                .duration(config.duration)
                .attr(
                  "font-size",
                  config.gridXYLabelFontSize || clearArea * 0.05
                )
                .style("color", config.axesLabelColor)
                .attr("font-family", config.fontFamily)
                .call(yaxis);
            },
            (update) =>
              update
                .attr(
                  "transform",
                  `translate(${config.yLabelAlignment + config.padding.left},0)`
                )
                .transition()
                .duration(config.duration)
                .attr(
                  "font-size",
                  config.gridXYLabelFontSize || clearArea * 0.05
                )
                .attr("font-family", config.fontFamily)
                .style("color", config.axesLabelColor)
                .call(yaxis),
            (exit) => {
              exit.remove();
            }
          );

        selected
          .selectAll(".y")
          .selectAll(".tick line")
          .attr("stroke", config.axisStrokeColor);

        selected
          .selectAll(".y")
          .selectAll(".tick text")
          .style("fill", (d) => {
            const textColor =
              d === config.activeYLabel
                ? config.gridHoverColor
                : config.fontColor;
            return textColor;
          })
          .style("font-weight", config.yAxisFontWeight);

        selected
          .selectAll(".y")
          .selectAll(".domain")
          .style("stroke", config.axisStrokeColor);

        selected
          .selectAll(".y")
          .selectAll(".tick")
          .selectAll("title")
          .style("stroke", config.axisStrokeColor)
          .data((d) => [d])
          .join(
            (enter) => {
              enter.append("title").text((d) => d);
            },
            (update) => update.text((d) => d)
          );
        if (config.alternateYAxisTicks) {
          selected
            .selectAll(".y")
            .selectAll(".tick")
            .selectAll("text")
            .data((d, i) => {
              return [{ data: d, index: i }];
            })
            .join(
              (enter) => {
                enter.style("opacity", (d, i) => {
                  return d.index % 2 === 0 ? 1 : 0;
                });
              },
              (update) =>
                update.style("opacity", (d, i) => {
                  return d.index % 2 === 0 ? 1 : 0;
                })
            );
        }
        selected
          .selectAll(".y")
          .selectAll(".tick")
          .selectAll(".y-axis-line")
          .data((d, i) => [{ label: d, index: i }])
          .join((enter) => {
            enter
              .append("line")
              .attr("class", "y-axis-line")
              .attr("stroke", config.gridLineYStroke)
              .attr("stroke-width", (d) => {
                d.label === 0 && config.gridLineStrokeWidth;
              })
              .attr("x1", 0)
              .attr(
                "x2",
                config.graphAreaW * (config.graphAreaWMultiplayer || 1)
              )
              .attr("stroke-dasharray", config.dasharray);
          });
      } else {
        selected.selectAll(".y").remove();
        return;
      }
      if (config.enableGridYLine) {
        selected
          .selectAll(".y")
          .selectAll(".tick")
          .selectAll(".y-axis-line")
          .data((d, i) => [{ label: d, index: i }])
          .join(
            (enter) => {
              enter
                .append("line")
                .attr("class", "y-axis-line")
                .attr("stroke", config.gridLineYStroke)
                .attr("stroke-width", (d) => config.gridLineStrokeWidth)
                .attr("x1", 0)
                .attr(
                  "x2",
                  config.graphAreaW * (config.graphAreaWMultiplayer || 1) -
                    config.padding.right
                )
                .attr("stroke-dasharray", config.dasharray);
            },
            (update) =>
              update
                .attr("stroke", config.gridLineYStroke)
                .attr("stroke-width", (d) => config.gridLineStrokeWidth)
                .attr("x1", 0)
                .attr(
                  "x2",
                  config.graphAreaW * (config.graphAreaWMultiplayer || 1) -
                    config.padding.right
                )
                .attr("stroke-dasharray", config.dasharray),
            (exit) => {
              exit.remove();
            }
          );
      } else {
        selected
          .selectAll(".y")
          .selectAll(".tick")
          .selectAll(".y-axis-line")
          .filter(function (d) {
            if (hasNegative) {
              if (d.label === 0) {
                return false;
              }
              return true;
            }
            return true;
          })
          .remove();
      }

      if (config.activeYLabel && config.xAxisType === "number") {
        selected
          .selectAll(".y")
          .selectAll(".tick")
          .filter((d) =>
            config.activeYLabel
              ? config.activeYLabel === d
              : config.data?.find((data) => data?.active)?.label === d
          )
          .each(function (d) {
            const tickGroup = d3.select(this);
            const textElement = tickGroup.select("text");

            const bbox = textElement.node().getBBox();
            tickGroup
              .append("line")
              .attr("class", "active-label")
              .attr("x1", bbox.x)
              .attr("y1", bbox.y + bbox.height + 2)
              .attr("x2", bbox.x + bbox.width)
              .attr("y2", bbox.y + bbox.height + 2)
              .attr("stroke-width", 2)
              .attr("stroke", config.axesLabelColor);
          });
      } else {
        selected
          .selectAll(".y")
          .selectAll(".tick")
          .selectAll("line.active-label")
          .remove();
      }
    });
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
