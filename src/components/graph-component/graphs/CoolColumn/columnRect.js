import * as d3 from "d3";
import { initialValues } from "../utils/graphConst";
import { setUpEvents } from "../utils/graphEvents";
import { rectLabels, topLabels } from "./labelUtils";

export const columnRect = function columnRect() {
  let config = {
    ...initialValues,
    enableTopLabels: false,
    enableRectLabels: false,
    columnWidth: 16,
    columnPadding: 2,
    columnGroupPadding: 2,
  };

  const t = d3
    .transition()
    .delay(function (d, i) {
      return i * 3;
    })
    .duration(config.duration);
  // draw the graph here
  function graph(selected) {
    selected.each(function (data) {
      // function bgData(d, i) {
      //   return d[0].map((ele, ii) => {
      //     const newEle = { ...ele };

      //     for (let iii = 0; iii < d.length; iii++) {
      //       newEle[d[iii][ii].labelText] = d[iii][ii].value;
      //       newEle[`${d[iii][ii].labelText}Color`] = d[iii][ii].color;
      //       newEle[`label`] = d[iii][ii].rawData.label;
      //     }
      //     return newEle;
      //   });
      // }
      function bgData(d, i) {
        const labelValues = {};
        const positiveAccValues = {};
        const negativeAccValues = {};
        return d[0].map((ele, ii) => {
          const newEle = { ...ele };
          for (let iii = 0; iii < d.length; iii++) {
            const {
              positiveAcc,
              negativeAcc,
              labelText,
              value,
              color,
              rawData,
            } = d[iii][ii];
            newEle[labelText] = value;
            newEle[`${labelText}Color`] = color;
            newEle[`label`] = rawData.label;

            // Update the maximum value for the label
            const currentLabel = rawData.label;
            if (
              !labelValues[currentLabel] ||
              value > labelValues[currentLabel]
            ) {
              labelValues[currentLabel] = value;
            }
            // Update the maximum positive acceleration value
            if (
              !positiveAccValues[currentLabel] ||
              positiveAcc > positiveAccValues[currentLabel]
            ) {
              positiveAccValues[currentLabel] = positiveAcc;
            }

            // Update the minimum negative acceleration value
            if (
              !negativeAccValues[currentLabel] ||
              negativeAcc < negativeAccValues[currentLabel]
            ) {
              negativeAccValues[currentLabel] = negativeAcc;
            }
            // Set the maxPositiveAcc key with the maximum positive acceleration value for the label
            newEle["maxPositiveAcc"] = positiveAccValues[newEle.label];

            // Set the minNegativeAcc key with the minimum negative acceleration value for the label
            newEle["minNegativeAcc"] = negativeAccValues[newEle.label];
          }

          // Set the maxValue key with the maximum value for the label
          newEle["maxValue"] = labelValues[newEle.label];

          return newEle;
        });
      }

      const xWidth = config.xScale.bandwidth() - config.columnPadding;

      config.columnWidth =
        config.columnWidth < xWidth ? config.columnWidth : xWidth;

      if (config.rectIndicator) {
        function ColumnRectBGFunc(elementRef) {
          elementRef
            .attr("fill", (d, i) => {
              return d.index === config.selected
                ? config.rectIndicatorBgColor || "rgba(195, 199, 217, 0.3)"
                : "transparent";
            })
            .attr("x", (d, i) => config.xScale.step() * i)
            .attr("width", (d, i) =>
              data[0].length - 1 === i ? 0 : config.xScale.step()
            )
            .attr("height", config.graphAreaH);
        }
        function rectIndicatorTop(elementRef) {
          elementRef
            .attr("fill", (d, i) => {
              return d.index === config.selected
                ? config.rectIndicatorTopColor || "#E20074"
                : "transparent";
            }) // Set border-top color
            .attr("x", (d, i) => config.xScale.step() * i)
            .attr("width", (d, i) =>
              data[0].length - 1 === i ? 0 : config.xScale.step()
            )
            .attr("height", config.rectIndicatorTopSize || "3");
        }

        selected
          .selectAll(".column-rect-indicator-rect-group")
          .data((d, i) => bgData(d))
          .join(
            (enter) => {
              enter
                .append("g")
                .attr("class", "column-rect-indicator-rect-group")
                .style("transform", (d) => {
                  return `translateX(${config.xScale(d.label)}px)`;
                });
            },
            (update) =>
              update.style("transform", (d) => {
                return `translateX(${config.xScale(d.label)}px)`;
              }),
            (exit) => {
              exit.remove();
            }
          );

        selected
          .selectAll(".column-rect-indicator-rect-group")
          .selectAll(".column-rect-group")
          .data((d, i) => [d])
          .join(
            (enter) => {
              enter
                .append("rect")
                .attr("class", "column-rect-group")
                .call(ColumnRectBGFunc);
            },
            (update) => update.call(ColumnRectBGFunc),
            (exit) => {
              exit.remove();
            }
          );

        selected
          .selectAll(".column-rect-indicator-rect-group")
          .selectAll(".column-rect-indicator-top")
          .data((d, i) => [d])
          .join(
            (enter) => {
              enter
                .append("rect")
                .attr("class", "column-rect-indicator-top")
                .call(rectIndicatorTop);
            },
            (update) => update.call(rectIndicatorTop),
            (exit) => {
              exit.remove();
            }
          );
        setUpEvents(config, selected, "column-rect-indicator-rect-group");
      }
      selected
        .selectAll(".bar-group")
        .data(data)
        .join(
          (enter) => {
            enter.append("g").attr("class", "bar-group");
          },
          (update) => update,
          (exit) => {
            exit.remove();
          }
        );

      // selected
      //   .selectAll(".bar-group")
      //   .data(data)
      //   .join(
      //     (enter) => {
      //       enter.append("g").attr("class", "bar-group");
      //     },
      //     (update) => update,
      //     (exit) => {
      //       exit.remove();
      //     }
      //   );

      const columnRectFunc = function (eleRef) {
        eleRef
          .attr("data-gi", (d) => d.labelIndex)
          .style("fill", (d, i) => {
            return config.barLevelColor ? d[`${d.labelText}BarColor`] : d.color;
          })
          .attr("width", (d) =>
            d.accValue === 0
              ? 0
              : config.graphType === "group"
              ? config.columnWidth / data.length - config.columnGroupPadding
              : config.columnWidth
          )
          .attr("x", (d, i) =>
            config.graphType === "group"
              ? config.xScale(d.label) +
                (xWidth - config.columnWidth) / 2 +
                d.labelIndex * (config.columnWidth / data.length)
              : config.xScale(d.label) + (xWidth - config.columnWidth) / 2
          );
      };
      const columnRectHeightFunc = function (eleRef) {
        eleRef
          .attr("y", (d, i) => {
            return config.graphType === "group" || config.graphType === "column"
              ? d.value < 0
                ? config.yScale(0)
                : config.yScale(d.value)
              : d.value < 0
              ? config.yScale(d.negativeAcc - d.value)
              : config.yScale(d.positiveAcc);
          })
          .attr("height", (d, i) => {
            const barHeight =
              config.yScale(0) - config.yScale(parseFloat(d.value));
            // Math.abs(config.yScale(d.value) - config.yScale(0));
            return barHeight < 0 ? -1 * barHeight : barHeight;
          });
      };

      if (config?.summary?.thresholdArr?.length && config.enableThreshold) {
        selected
          .selectAll(".threshold-line-path")
          .data(config.summary.thresholdArr)
          .join(
            (enter) => {
              enter
                .append("line")
                .attr("class", "threshold-line-path")
                .attr(
                  "stroke",
                  (d) => d.color || config.thresholdStroke || "red"
                )
                .attr("stroke-width", config.thresholdStrokeWidth || 1)
                .attr("x1", 0)
                .attr("y1", (d) => config.yScale(d.value))
                .attr("x2", config.graphAreaW)
                .attr("y2", (d) => config.yScale(d.value))
                .attr("stroke-dasharray", "4,4")
                .attr("stroke-dashoffset", 0);
            },
            (update) =>
              update
                .attr("y1", (d) => config.yScale(d.value))
                .attr("y2", (d) => config.yScale(d.value))
                .attr("stroke", (d) => d.color || config.thresholdStroke),
            (exit) => {
              exit.remove();
            }
          );

        if (!config.disableThreshouldLabel) {
          const thresholdText = selected
            .selectAll(".threshold-label")
            .data(config.summary.thresholdArr, (d) => d.value);

          // Remove any extra threshold text elements
          thresholdText.exit().remove();

          // Enter new threshold text elements
          const thresholdTextEnter = thresholdText
            .enter()
            .append("g")
            .attr("class", "threshold-label");

          thresholdTextEnter
            .append("rect")
            .attr("width", 40)
            .attr("height", 17)
            .attr("fill", "#FF0000")
            .attr("rx", 2)
            .attr("ry", 2);

          thresholdTextEnter
            .append("text")
            .attr("x", -(config.xLabelAlignment - 5 || 30) + 40)
            .attr("y", 9)
            .attr("fill", "#fff")
            .attr("font-size", "10px")
            .attr("font-weight", "normal")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle");

          // Merge existing and new threshold text elements
          const mergedThresholdText = thresholdTextEnter.merge(thresholdText);

          // Update the position and text content of all threshold text elements
          mergedThresholdText
            .attr(
              "transform",
              (d) =>
                `translate(${-(config.xLabelAlignment - 5 || 30)}, ${
                  config.yScale(d.value) - 10
                })`
            )
            .selectAll("text")
            .text((d) => d.value);

          // Transition for a smooth update
          mergedThresholdText
            .transition()
            .attr(
              "transform",
              (d) =>
                `translate(${-(config.xLabelAlignment - 5 || 30)}, ${
                  config.yScale(d.value) - 10
                })`
            )
            .selectAll("text")
            .text((d) => d.value);
        } else {
          selected.selectAll(".threshold-label").remove();
        }
      } else {
        selected.selectAll(".threshold-line-path").remove();
        selected.selectAll(".threshold-line-path-text").remove();
        selected.selectAll(".threshold-label").remove();
      }

      selected
        .selectAll(".bar-group")
        .selectAll(".column-rect")
        .data((d, i) => {
          return d.map((entry) => {
            const temp = entry;
            temp.labelIndex = i;
            return temp;
          });
        })
        .join(
          (enter) => {
            enter
              .append("rect")
              .attr("class", "column-rect")
              .attr("data-label", (d) => d.label)
              .call(columnRectFunc)
              .attr("y", config.yScale(0))
              .transition(t)
              .call(columnRectHeightFunc);
          },
          (update) =>
            update
              .transition(t)
              .call(columnRectHeightFunc)
              .call(columnRectFunc),
          (exit) => {
            exit.transition(t).attr("height", 0).attr("width", 0).remove();
          }
        );

      if (config.enableRectLabels) {
        selected.selectAll(".bar-group").call(rectLabels, config, t, xWidth);
      } else {
        selected.selectAll(".bar-group").selectAll(".rect-label").remove();
      }

      if (config.enableTopLabels) {
        const barGroups =
          config.graphType === "group"
            ? selected.selectAll(".bar-group")
            : selected;

        barGroups
          .selectAll(".bar-label-group")
          .data(
            config.graphType === "group"
              ? (d, i) => {
                  d.map((entry) => {
                    const temp = entry;
                    temp.labelIndex = i;
                    return temp;
                  });
                  return d;
                }
              : data[data.length - 1]
          )
          .join(
            (enter) => {
              const labelGrp = enter
                .append("g")
                .attr("class", "bar-label-group")
                .attr("transform", (d, i) => {
                  const barOffset =
                    config.graphType === "group"
                      ? (config.columnWidth / 2) * (d.labelIndex - 0.6)
                      : 0;
                  return `translate(${
                    config.xScale(d.label) +
                    config.xScale.bandwidth() / 2 +
                    barOffset
                  }, ${config.yScale(config.maxY * 1.15)})`;
                });

              labelGrp.call(topLabels, config, t);
            },
            (update) => update,
            (exit) => {
              exit.remove();
            }
          )
          .call(topLabels, config, t);
      } else {
        selected.selectAll(".bar-label-group").remove();
        selected.selectAll(".bar-group").selectAll(".bar-label-group").remove();
      }
      if (config.hoverRect) {
        function ColumnRectBGFunc(elementRef) {
          elementRef
            .attr("fill", "transparent")
            .attr("x", (d, i) => config.xScale.step() * i)
            .attr("width", (d, i) =>
              data[0].length - 1 === i ? 0 : config.xScale.step()
            )
            .attr("height", config.graphAreaH);
        }
        selected
          .selectAll(".column-rect-bg-group")
          .data((d, i) => {
            return bgData(d);
          })
          .join(
            (enter) => {
              enter
                .append("g")
                .attr("class", "column-rect-bg-group")
                .attr("data-label", (d) => d.label)
                .style("transform", (d) => {
                  return `translateX(${config.xScale(d.rawData.label)}px)`;
                });
            },
            (update) =>
              update.style("transform", (d) => {
                return `translateX(${config.xScale(d.rawData.label)}px)`;
              }),
            (exit) => {
              exit.remove();
            }
          );

        selected
          .selectAll(".column-rect-bg-group")
          .selectAll(".column-rect-group")
          .data((d, i) => [d])
          .join(
            (enter) => {
              enter
                .append("rect")
                .attr("class", "column-rect-group")
                .attr("data-label", (d) => d.label)
                .call(ColumnRectBGFunc);
            },
            (update) => update.call(ColumnRectBGFunc),
            (exit) => {
              exit.remove();
            }
          );
        setUpEvents(config, selected, "column-rect-bg-group");
      } else {
        selected.selectAll(".column-rect-bg-group").remove();
      }
      if (!config.hoverRect) {
        setUpEvents(config, selected, "column-rect");
      }
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
