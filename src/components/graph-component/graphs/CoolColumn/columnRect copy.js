import * as d3 from "d3";
import { initialValues } from "../utils/graphConst";
import { setUpEvents } from "../utils/graphEvents";
import { rectLabels, topLabels } from "./labelUtils";

export const columnRect = function columnRect() {
  let config = {
    ...initialValues,
    yTotalLabelSpace: 10,
    yTotalLabelFS: 10,
    yTotalSubLabelFS: 10,
    groupgutterSpace: 2,
    enableTopLabels: false,
    enableRectLabels: false,
    yRectLabelColor: "#000",
    columnBG: "#eee",
    grayLineHeight: 100,
    labelheight: 50,
    grayLineYposition: 0,
    thresholdColor: "blue",
    thresholdWidth: 6,
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
      const xWidth = config.xScale.bandwidth() - config.gutterSpace;
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

      if (config.graphType === "timeline") {
        const totalWidth = config.rectWidth + config.gutterSpace;
        const dummyBars = parseInt(config.graphAreaW / totalWidth);
        const tnumbers =
          data[0].length > dummyBars ? data[0].length : dummyBars;
        console.log("tnumbers", tnumbers);
        const dummyDataArray = [];
        for (let i = 0; i < tnumbers; i++) {
          dummyDataArray.push({
            label: `${i}`,
            value: config.maxY,
          });
        }
        selected
          .selectAll(".bar-group")
          .selectAll(".column-rect-bg")
          .data(dummyDataArray)
          .join(
            (enter) => {
              enter
                .append("rect")
                .attr("class", "column-rect-bg")
                .style("fill", config.columnBG)
                .attr("x", (d, i) =>
                  config.rectWidth
                    ? (config.rectWidth + config.gutterSpace) * i
                    : config.xScale(d.label) + config.gutterSpace / 2
                )
                .attr(
                  "width",
                  (d) => config.rectWidth || (d.accValue === 0 ? 0 : xWidth)
                )
                .attr("y", config.height - (config.height - config.graphAreaH))
                .attr("height", 0)
                .transition(t)
                .attr(
                  "width",
                  (d) => config.rectWidth || (d.accValue === 0 ? 0 : xWidth)
                )
                .attr("x", (d, i) =>
                  config.rectWidth
                    ? (config.rectWidth + config.gutterSpace) * i
                    : config.xScale(d.label) + config.gutterSpace / 2
                )
                .attr("y", (d, i) => config.yScale(100))
                .attr("height", (d, i) => {
                  const barHeight =
                    config.graphAreaH - config.yScale(parseFloat(config.maxY));
                  return barHeight;
                });
            },
            (update) => update,
            (exit) => {
              exit.transition(t).attr("height", 0).attr("width", 0).remove();
            }
          )
          .transition(t)
          .attr(
            "width",
            (d) => config.rectWidth || (d.accValue === 0 ? 0 : xWidth)
          )
          .attr("x", (d, i) =>
            config.rectWidth
              ? (config.rectWidth + config.gutterSpace) * i
              : config.xScale(d.label) + config.gutterSpace / 2
          )
          .attr("y", (d, i) => config.yScale(config.maxY))
          .attr("height", (d, i) => {
            const barHeight =
              config.graphAreaH - config.yScale(parseFloat(d.value));
            return barHeight;
          });
      }

      if (config.enableTopLabels) {
        selected
          .selectAll(".bar-label-group")
          .data(data[data.length - 1])
          .join(
            (enter) => {
              const labelGrp = enter
                .append("g")
                .attr("class", "bar-label-group")
                .attr("transform", (d, i) => {
                  return `translate(${
                    config.xScale(d.label) + config.xScale.bandwidth() / 2
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
      }

      if (config.enableFullColumn) {
        selected
          .selectAll(".bar-group")
          .selectAll(".column-rect-bg")
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
                .attr("class", "column-rect-bg")
                .style("fill", config.columnBG)
                .attr("width", (d) =>
                  config.rectWidth || config.graphType === "group"
                    ? xWidth / data.length - config.groupgutterSpace
                    : xWidth
                )
                .attr("x", (d, i) =>
                  config.rectWidth
                    ? (config.rectWidth + config.gutterSpace) * i
                    : (config.graphType === "group"
                        ? config.xScale(d.label) +
                          (d.labelIndex * xWidth) / data.length
                        : config.xScale(d.label)) +
                      config.gutterSpace / 2
                )
                .attr("y", config.height - (config.height - config.graphAreaH))
                .transition(t)
                .attr("y", config.yScale(config.maxY))
                .attr("height", config.graphAreaH - config.yScale(config.maxY));
            },
            (update) => update,
            (exit) => {
              exit.transition(t).attr("height", 0).attr("width", 0).remove();
            }
          )
          .transition(t)
          .style("fill", config.columnBG)
          .attr("width", (d) =>
            config.rectWidth || config.graphType === "group"
              ? xWidth / data.length - config.groupgutterSpace
              : xWidth
          )
          .attr("x", (d, i) =>
            config.rectWidth
              ? (config.rectWidth + config.gutterSpace) * i
              : (config.graphType === "group"
                  ? config.xScale(d.label) +
                    (d.labelIndex * xWidth) / data.length
                  : config.xScale(d.label)) +
                config.gutterSpace / 2
          )
          .attr("y", config.yScale(config.maxY))
          .attr("height", config.graphAreaH - config.yScale(config.maxY));

        selected
          .selectAll(".bar-group")
          .selectAll(".column-rect-threshold")
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
                .attr("class", "column-rect-threshold")
                .style("fill", (d) =>
                  d.thresholdValue ? config.thresholdColor : "none"
                )
                .style("stroke", "none")
                .attr(
                  "width",
                  xWidth / data.length -
                    config.groupgutterSpace +
                    config.thresholdWidth
                )
                .attr(
                  "x",
                  (d, i) =>
                    (config.rectWidth
                      ? (config.rectWidth + config.gutterSpace) * i
                      : (config.graphType === "group"
                          ? config.xScale(d.label) +
                            (d.labelIndex * xWidth) / data.length
                          : config.xScale(d.label)) +
                        config.gutterSpace / 2) -
                    config.thresholdWidth / 2
                )
                .attr("y", config.height - (config.height - config.graphAreaH))
                .attr("height", 2)
                .transition(t)
                .attr("y", (d) => config.yScale(d.thresholdValue || 0));
            },
            (update) => update,
            (exit) => {
              exit.transition(t).attr("height", 0).attr("width", 0).remove();
            }
          )
          .transition(t)
          .style("fill", (d) =>
            d.thresholdValue ? config.thresholdColor : "none"
          )
          .style("stroke", "none")
          .attr(
            "width",
            xWidth / data.length -
              config.groupgutterSpace +
              config.thresholdWidth
          )
          .attr(
            "x",
            (d, i) =>
              (config.rectWidth
                ? (config.rectWidth + config.gutterSpace) * i
                : (config.graphType === "group"
                    ? config.xScale(d.label) +
                      (d.labelIndex * xWidth) / data.length
                    : config.xScale(d.label)) +
                  config.gutterSpace / 2) -
              config.thresholdWidth / 2
          )
          .attr("y", (d) => config.yScale(d.thresholdValue || 0));
        // thresholdValue
      }

      const columnRectFunc = function (eleRef) {
        eleRef
          .attr("data-gi", (d) => d.labelIndex)
          .style("fill", (d, i) => {
            return config.barLevelColor ? d[`${d.labelText}BarColor`] : d.color;
          })
          .attr(
            "width",
            (d) =>
              config.rectWidth ||
              (d.accValue === 0
                ? 0
                : config.graphType === "group"
                ? xWidth / data.length - config.groupgutterSpace
                : xWidth)
          )
          .attr("x", (d, i) =>
            config.rectWidth
              ? (config.rectWidth + config.gutterSpace) * i
              : (config.graphType === "group"
                  ? config.xScale(d.label) +
                    (d.labelIndex * xWidth) / data.length
                  : config.xScale(d.label)) +
                config.gutterSpace / 2
          );
      };

      const columnRectHeightFunc = function (eleRef) {
        eleRef
          .attr("y", (d, i) =>
            config.graphType === "group"
              ? d.value < 0
                ? config.yScale(0)
                : config.yScale(d.value)
              : config.yScale(d.accValue)
          )
          .attr("height", (d, i) => {
            const barHeight =
              config.yScale(0) - config.yScale(parseFloat(d.value));
            return barHeight < 0 ? -1 * barHeight : barHeight;
          });
      };

      selected
        .selectAll(".bar-group")
        .selectAll(".column-rect")
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
              .call(columnRectFunc)
              .attr("y", config.height - (config.height - config.graphAreaH))
              .transition(t)
              .call(columnRectHeightFunc);
          },
          (update) => update,
          (exit) => {
            exit.transition(t).attr("height", 0).attr("width", 0).remove();
          }
        )

        .transition(t)
        .call(columnRectHeightFunc)
        .call(columnRectFunc);

      if (config.enableRectLabels) {
        selected.selectAll(".bar-group").call(rectLabels, config, t, xWidth);
      }
      if (config.enableSelected) {
        selected
          .selectAll(".selected-item")
          .data(["0"])
          .join(
            (enter) => {
              enter
                .append("rect")
                .attr("class", "selected-item")
                .style("fill", (d, i) => config.selectedBarColor || "red")
                .attr("x", (d, i) => {
                  return (
                    config.xScale(data[0][0].label) +
                    (data[0][0].labelIndex * xWidth) / data.length
                  );
                })
                .attr("width", (d) => {
                  return config.selectedBarWidth
                    ? config.xScale(data[0][0].label) -
                        config.selectedBarWidth / 2
                    : config.gutterSpace +
                        (xWidth / data.length -
                          (config.groupgutterSpace || 0)) *
                          2;
                })
                .attr("y", config.height - (config.selectedBarHeight || 2))
                .transition(t)
                .attr("x", (d, i) => {
                  return (
                    config.xScale(data[0][0].label) +
                    (data[0][0].labelIndex * xWidth) / data.length
                  );
                })
                .attr("width", (d) => {
                  return config.selectedBarWidth
                    ? config.selectedBarWidth
                    : config.gutterSpace +
                        (xWidth / data.length -
                          (config.groupgutterSpace || 0)) *
                          2;
                })
                .attr("y", config.height - (config.selectedBarHeight || 2))
                .attr("height", config.selectedBarHeight || 2);
            },
            (update) => update,
            (exit) => {
              exit.remove();
            }
          )
          .transition(t)
          .attr("x", (d, i) => {
            return (
              config.xScale(data[0][0].label) +
              (data[0][0].labelIndex * xWidth) / data.length
            );
          })
          .attr("width", (d) => {
            return config.selectedBarWidth
              ? config.selectedBarWidth
              : config.gutterSpace +
                  (xWidth / data.length - (config.groupgutterSpace || 0)) * 2;
          })
          .attr("y", config.height - (config.selectedBarHeight || 2))
          .attr("height", config.selectedBarHeight || 2);
      }

      setUpEvents(config, selected, "column-rect");

      // selected
      //   .selectAll('.column-rect')
      //   .style('cursor', 'pointer')
      //   .on('click', (event, d, i) => {
      //     selected
      //       .selectAll('.selected-item')
      //       ?.attr(
      //         'x',
      //         config.xScale(d.label) +
      //           (data[0][0].labelIndex * xWidth) / data.length
      //       );
      //     if (config.handleOnClick) {
      //       config.handleOnClick(event, d, i);
      //     }
      //   });

      if (config.enableSelected) {
        setUpEvents(config, selected, "column-rect-bg");
        selected
          .selectAll(".column-rect-bg")
          .style("cursor", "pointer")
          .on("click", (event, d, i) => {
            selected
              .selectAll(".selected-item")
              ?.attr(
                "x",
                config.xScale(d.label) +
                  (data[0][0].labelIndex * xWidth) / data.length
              );
            if (config.handleOnClick) {
              config.handleOnClick(event, d, i);
            }
          });
      }

      if (config.rectIndicator) {
        console.log(data);
        const rectWidthShadowXfactor = config.rectWidthShadowXfactor || 0.1;
        selected
          .selectAll(".column-rect-indicator-rect")
          .data([JSON.parse(JSON.stringify(data[0][config.selected]))])
          .join(
            (enter) => {
              enter
                .append("rect")
                .attr("class", "column-rect-indicator-rect")
                .style("fill", config.indicatorColor || "#cccccc80")
                .attr("x", (d, i) =>
                  config.rectWidth
                    ? (config.rectWidth + config.gutterSpace) * i
                    : (config.graphType === "group"
                        ? config.xScale(d.label) +
                          (d.labelIndex * xWidth) / data.length
                        : config.xScale(d.label) + config.gutterSpace / 2) -
                      xWidth * rectWidthShadowXfactor
                )
                .attr(
                  "width",
                  (d) =>
                    config.rectWidth ||
                    (d.accValue === 0
                      ? 0
                      : config.graphType === "group"
                      ? xWidth / data.length - config.groupgutterSpace
                      : xWidth + xWidth * 2 * rectWidthShadowXfactor)
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
          .attr("x", (d, i) =>
            config.rectWidth
              ? (config.rectWidth + config.gutterSpace) * i
              : (config.graphType === "group"
                  ? config.xScale(d.label) +
                    (d.labelIndex * xWidth) / data.length
                  : config.xScale(d.label) + config.gutterSpace / 2) -
                xWidth * rectWidthShadowXfactor
          )
          .attr(
            "width",
            (d) =>
              config.rectWidth ||
              (d.accValue === 0
                ? 0
                : config.graphType === "group"
                ? xWidth / data.length - config.groupgutterSpace
                : xWidth + xWidth * 2 * rectWidthShadowXfactor)
          )
          .attr("y", 0)
          .attr("height", config.graphAreaH);
      }

      if (config.rectIndicatorBottom) {
        selected
          .selectAll(".band-bg")
          .select("defs")
          .data([0])
          .join(
            (enter) => {
              const defs = enter.append("defs");
              defs.selectAll("*").remove();
              const gradientOffset = defs
                .append("linearGradient")
                .attr("class", "gradientOffset")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%")
                .attr("id", "gradOffset-indicator");

              gradientOffset
                .append("stop")
                .attr("offset", "0%")
                .attr("stop-color", config.indicatorColor2 || "#C5C8DD00")
                .attr("stop-opacity", config.colorOpacity || 0.5);
              gradientOffset
                .append("stop")
                .attr("offset", "95%")
                .attr("stop-color", config.indicatorColor1 || "#606080")
                .attr("stop-opacity", config.colorOpacity1 || 0.5);

              gradientOffset
                .append("stop")
                .attr("offset", "100%")
                .attr("stop-color", config.indicatorBottomColor || "#000")
                .attr("stop-opacity", config.colorOpacityBottom || 1);
            },
            (update) => update,
            (exit) => {
              exit.remove();
            }
          );

        const rectWidthShadowXfactor = config.rectWidthShadowXfactor || 0.1;
        selected
          .selectAll(".column-rect-indicator-rect")
          .data([JSON.parse(JSON.stringify(data[0][config.selected]))])
          .join(
            (enter) => {
              enter
                .append("rect")
                .attr("class", "column-rect-indicator-rect")
                // .style("fill", config.indicatorColor || "#cccccc80")
                .attr(
                  "fill",
                  (d, i) =>
                    // true ?
                    "url(#gradOffset-indicator)"
                  // : config.indicatorColor || '#cccccc80'
                )
                .attr("x", (d, i) =>
                  config.rectWidth
                    ? (config.rectWidth + config.gutterSpace) * i
                    : (config.graphType === "group"
                        ? config.xScale(d.label) +
                          (d.labelIndex * xWidth) / data.length
                        : config.xScale(d.label) + config.gutterSpace / 2) -
                      xWidth * rectWidthShadowXfactor
                )
                .attr(
                  "width",
                  (d) =>
                    config.rectWidth ||
                    (config.graphType === "group"
                      ? xWidth / data.length - config.groupgutterSpace
                      : xWidth + xWidth * 2 * rectWidthShadowXfactor)
                )
                .attr("y", config.graphAreaH)
                .transition(t)
                .attr("height", config.height - config.graphAreaH);
            },
            (update) => update,
            (exit) => {
              exit.transition(t).attr("height", 0).attr("width", 0).remove();
            }
          )
          .transition(t)
          // .style("fill", config.indicatorColor || "#cccccc80")
          .attr(
            "fill",
            (d, i) =>
              // true ?
              "url(#gradOffset-indicator)"
            // : config.indicatorColor || '#cccccc80'
          )
          .attr("x", (d, i) =>
            config.rectWidth
              ? (config.rectWidth + config.gutterSpace) * i
              : (config.graphType === "group"
                  ? config.xScale(d.label) +
                    (d.labelIndex * xWidth) / data.length
                  : config.xScale(d.label) + config.gutterSpace / 2) -
                xWidth * rectWidthShadowXfactor
          )
          .attr(
            "width",
            (d) =>
              config.rectWidth ||
              (config.graphType === "group"
                ? xWidth / data.length - config.groupgutterSpace
                : xWidth + xWidth * 2 * rectWidthShadowXfactor)
          )
          .attr("y", config.graphAreaH)
          .attr("height", config.height - config.graphAreaH);
      } else {
        selected.selectAll(".column-rect-indicator-rect").remove();
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
