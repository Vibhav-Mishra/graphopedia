import * as d3 from "d3";
import ColorParser from "../utils/colorParser";
import { initialValues } from "../utils/graphConst";
import { setUpEvents } from "../utils/graphEvents";

export const barRect = function barRect() {
  let config = {
    ...initialValues,
    barHeight: 16,
    barPadding: 2,
    hoverRect: true, // Add this line to enable the hover rect
  };

  const t = d3
    .transition()
    .delay(function (d, i) {
      return i * 3;
    })
    .duration(config.duration);

  function graph(selected) {
    function bgData(d, i) {
      const labelValues = {};
      const positiveAccValues = {};
      const negativeAccValues = {};
      return d[0].map((ele, ii) => {
        const newEle = { ...ele };
        for (let iii = 0; iii < d.length; iii++) {
          const { positiveAcc, negativeAcc, labelText, value, color, rawData } =
            d[iii][ii];
          newEle[labelText] = value;
          newEle[`${labelText}Color`] = color;
          newEle[`label`] = rawData.label;

          // Update the maximum value for the label
          const currentLabel = rawData.label;
          if (!labelValues[currentLabel] || value > labelValues[currentLabel]) {
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
    selected.each(function (data) {
      const yWidth = config.yScale.bandwidth() - config.barPadding;
      config.barHeight = config.barHeight < yWidth ? config.barHeight : yWidth;

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

      function barHeight(eleRef) {
        eleRef
          .attr("height", (d) =>
            d.positiveAcc === 0 && d.accValue === 0
              ? 0
              : config.graphType === "group"
              ? config.barHeight / data.length
              : config.barHeight
          )
          .attr("y", (d, i) =>
            config.graphType === "group"
              ? config.yScale(d.label) +
                (yWidth - config.barHeight) / 2 +
                d.labelIndex * (config.barHeight / data.length)
              : config.yScale(d.label) + (yWidth - config.barHeight) / 2
          );
      }

      function drawBar(eleRef) {
        eleRef
          .call(barHeight)
          .attr("x", (d) => {
            return config.graphType === "group" || config.graphType === "bar"
              ? d.value < 0
                ? config.xScale(d.value)
                : config.xScale(0)
              : d.value < 0
              ? config.xScale(d.negativeAcc)
              : config.xScale(d.positiveAcc - d.value);
          })
          .attr("width", (d, i) => {
            const barHeight =
              config.xScale(0) - config.xScale(parseFloat(d.value));
            return barHeight < 0 ? -1 * barHeight : barHeight;
          });
      }

      if (config.hoverRect) {
        function ColumnRectBGFunc(elementRef) {
          elementRef
            .attr("fill", "transparent")
            .attr("y", (d, i) => config.yScale.step() * i)
            .attr("width", (d, i) => config.graphAreaW)
            .attr("height", config.yScale.bandwidth());
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
                  return `translateY(${config.yScale(d.label)}px)`;
                });
            },
            (update) =>
              update.style("transform", (d) => {
                return `translateY(${config.yScale(d.label)}px)`;
              }),
            (exit) => {
              exit.remove();
            }
          );

        selected
          .selectAll(".column-rect-bg-group")
          .selectAll(".column-rect-group")
          .data((d, i) => {
            return [d];
          })
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

      selected
        .selectAll(".bar-group")
        .selectAll("rect")
        .data((d, i) => {
          d.map((entry) => {
            const temp = entry;
            temp.labelIndex = i;
            return temp;
          });
          return d;
        })
        .join(
          (enter) => {
            enter
              .append("rect")
              .attr("class", "column-rect")
              .attr("data-gi", (d) => d.labelIndex)
              .style("fill", (d, i) => {
                return d.color ? ColorParser(d.color) : "#000";
              })
              .call(barHeight)
              .attr("x", config.xScale(0))
              .transition(t)
              .call(drawBar);
          },
          (update) => update.transition(t).call(drawBar),
          (exit) => {
            exit.transition(t).attr("height", 0).attr("width", 0).remove();
          }
        );

      if (config.enableTextOverBar) {
        selected
          .selectAll(".actual-data-label")
          .data((d, i) => {
            d.map((entry) => {
              const temp = entry;
              temp.labelIndex = i;
              return temp;
            });
            return d[0];
          })
          .join(
            (enter) =>
              enter
                .append("text")
                .style("font-size", config.textOverBarFontSize || "10px")
                .style("font-family", "Inter")
                .style("fill", config.textOverBarColor || "#5C5E60")
                .style("line-height", "12px")
                .style("letter-spacing", "-2%")
                .attr("class", "actual-data-label")

                .attr("x", (d) =>
                  d.value < 0 ? config.xScale(d.value) : config.xScale(0)
                )
                .attr("y", (d) => {
                  return config.graphType === "group"
                    ? config.yScale(d.label) +
                        (config.yScale.bandwidth() - config.barHeight) / 2 +
                        d.labelIndex * (config.barHeight / data.length) +
                        config.barHeight / data.length / 2
                    : config.yScale(d.label) +
                        config.yScale.bandwidth() / 2 -
                        config.barHeight / 2 -
                        5;
                })
                .text((d) => d.label.toUpperCase()),
            (update) =>
              update
                .attr("y", (d) => {
                  return config.graphType === "group"
                    ? config.yScale(d.label) +
                        (config.yScale.bandwidth() - config.barHeight) / 2 +
                        d.labelIndex * (config.barHeight / data.length) +
                        config.barHeight / data.length / 2
                    : config.yScale(d.label) +
                        config.yScale.bandwidth() / 2 -
                        config.barHeight / 2 -
                        5;
                })
                .style("font-size", config.textOverBarFontSize || "10px")
                .style("fill", config.textOverBarColor || "#000"),
            (exit) => exit.remove() // Handle exits if needed
          );
      } else {
        selected.selectAll(".actual-data-label").remove();
      }

      // add bar label text if enabled
      if (config.enableDataLabel) {
        selected
          .selectAll(".bar-group")
          .selectAll(".bar-label-group")
          .data(
            config.graphType === "group"
              ? (d, i) => {
                  return d.map((entry) => {
                    const temp = entry;
                    temp.labelIndex = i;
                    return temp;
                  });
                }
              : data[data.length - 1]
          )
          .join(
            (enter) => {
              const labelGroup = enter
                .append("g")
                .attr("class", "bar-label-group")
                .attr("transform", (d, i) => {
                  const barHeight = config.barHeight;
                  return `translate(${
                    config.graphType === "group" || config.graphType === "bar"
                      ? d.value < 0
                        ? config.xScale(0) +
                          (config.dataLabelPosition === "inside" ? -5 : 5)
                        : config.xScale(d.value) +
                          (config.dataLabelPosition === "inside" ? -5 : 5)
                      : d.positiveAcc === 0
                      ? config.xScale(0) +
                        (config.dataLabelPosition === "inside" ? -5 : 5)
                      : config.xScale(d.positiveAcc) +
                        (config.dataLabelPosition === "inside" ? -5 : 5)
                  }, ${
                    config.graphType === "group"
                      ? config.yScale(d.label) +
                        yWidth / 2 -
                        barHeight / 2 +
                        d.labelIndex * (barHeight / data.length) +
                        barHeight / data.length / 2
                      : config.yScale(d.label) + yWidth / 2 + 1
                  })`;
                });

              labelGroup
                .append("rect")
                .attr("class", "bar-label-rect")
                .attr("width", (d, i) =>
                  config.graphType === "group" || config.graphType === "bar"
                    ? d.value < 0
                      ? config.xScale(0) - config.xScale(d.value)
                      : config.xScale(d.value) - config.xScale(0)
                    : d.positiveAcc === 0
                    ? config.xScale(0) - config.xScale(d.negativeAcc)
                    : config.xScale(d.positiveAcc) -
                      config.xScale(d.negativeAcc)
                )
                .attr("height", (d, i) =>
                  config.graphType === "group"
                    ? config.barHeight / data.length
                    : config.barHeight
                )
                .attr("fill", "transparent");

              labelGroup
                .append("text")
                .attr("class", "bar-label")
                .attr(
                  "text-anchor",
                  config.dataLabelPosition === "inside" ? "end" : "start"
                )
                .attr("dominant-baseline", "middle")
                .style("fill", config.dataLabelColor || "#000")
                .style("font-size", config.dataLabelFontSize || "12px")
                .style("font-weight", config.dataLabelFontWeight || "normal")

                .style("font-family", config.dataLabeFont || "Inter")
                .text((d) =>
                  config.graphType === "stack"
                    ? d.positiveAcc + d.negativeAcc
                    : d.value
                );
            },
            (update) => {
              update
                .select(".bar-label-rect")
                .attr("width", (d, i) =>
                  config.graphType === "group" || config.graphType === "bar"
                    ? d.value < 0
                      ? config.xScale(0) - config.xScale(d.value)
                      : config.xScale(d.value) - config.xScale(0)
                    : d.positiveAcc === 0
                    ? config.xScale(0) - config.xScale(d.negativeAcc)
                    : config.xScale(d.positiveAcc) -
                      config.xScale(d.negativeAcc)
                )
                .attr("height", (d, i) =>
                  config.graphType === "group"
                    ? config.barHeight / data.length
                    : config.barHeight
                );

              update
                .select(".bar-label")
                .attr(
                  "text-anchor",
                  config.dataLabelPosition === "inside" ? "end" : "start"
                )
                .attr("dominant-baseline", "middle")
                .style("fill", config.dataLabelColor || "#000")
                .style("font-size", config.dataLabelFontSize || "12px")
                .style("font-weight", config.dataLabelFontWeight || "normal")
                .text((d) =>
                  config.graphType === "stack"
                    ? d.positiveAcc + d.negativeAcc
                    : d.value
                );

              update.attr("transform", (d, i) => {
                const barHeight = config.barHeight;
                return `translate(${
                  config.graphType === "group" || config.graphType === "bar"
                    ? d.value < 0
                      ? config.xScale(0) +
                        (config.dataLabelPosition === "inside" ? -5 : 5)
                      : config.xScale(d.value) +
                        (config.dataLabelPosition === "inside" ? -5 : 5)
                    : d.positiveAcc === 0
                    ? config.xScale(0) +
                      (config.dataLabelPosition === "inside" ? -5 : 5)
                    : config.xScale(d.positiveAcc) +
                      (config.dataLabelPosition === "inside" ? -5 : 5)
                }, ${
                  config.graphType === "group"
                    ? config.yScale(d.label) +
                      yWidth / 2 -
                      barHeight / 2 +
                      d.labelIndex * (barHeight / data.length) +
                      barHeight / data.length / 2
                    : config.yScale(d.label) + yWidth / 2 + 1
                })`;
              });
            },
            (exit) => {
              exit.remove();
            }
          );
      } else {
        selected.selectAll(".bar-label-group").remove();
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
