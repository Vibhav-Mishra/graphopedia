import * as d3 from "d3";
import { initialValues } from "../utils/graphConst";
import { wrap } from "../utils/graphUtils";
import { setUpEvents } from "../utils/graphEvents";

export const radarCircle = function radarCircle() {
  let config = {
    ...initialValues,
    fontSize: 5,

    labelColor: "#000",
    subLabelColor: "#000",
    radarBGStrokeWidth: 1,
    radarBGStroke: "#000",
    backgroundType: "circle",
    levels: 5, // How many levels or inner circles should there be drawn
    maxValue: 100, // What is the value that the biggest circle will represent
    labelXFactor: 1.25, // How much farther than the radius of the outer circle should the labels be placed
    labelYFactor: 1.12, // How much farther than the radius of the outer circle should the labels be placed
    labelXFactorValue: 1.25, // How much farther than the radius of the outer circle should the labels be placed
    labelYFactorValue: 1.12, // How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 45, // The number of pixels after which a label needs to be given a new line
    opacityArea: 0.35, // The opacity of the area of the blob
    dotRadius: 4, // The size of the colored circles of each blog
    opacityCircles: 0.1, // The opacity of the circles of each blob
    strokeWidth: 2, // The width of the stroke around each blob
    roundStrokes: false, // If true the area and stroke will follow a round path (cardinal-closed)
    easing: d3.easeLinear,
    duration: 1000,
  };

  // draw the graph here
  function graph(selected) {
    selected.each(function (data) {
      // const data = inData[0].map((ele) => ({
      //   ...ele,
      //   endAngle: config.endAngle,
      // }));

      const t = d3.transition().duration(config.duration).ease(config.easing);

      // If the supplied maxValue is smaller than the actual one, replace by the max in the data
      const maxValue = Math.max(
        config.maxValue,
        d3.max(data, function (i) {
          return d3.max(
            i.map(function (o) {
              return o.value;
            })
          );
        })
      );

      // axis labels
      const allAxis = data[0].map(function (i, j) {
        return i.label;
      });

      const clearArea =
        config.width < config.height ? config.width : config.height;
      const maxArea = clearArea * 0.7;
      const radius = maxArea / 2;
      const total = allAxis.length;
      const angleSlice = (Math.PI * 2) / total;
      const p = d3.precisionFixed(1);
      const Format = d3.format("." + p + "%");
      const axisData = data[0];

      // Scale for the radius
      const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);
      // The radial line function
      const radarLine = d3
        .lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(function (d) {
          return rScale(d.value);
        })
        .angle(function (d, i) {
          return i * angleSlice;
        });

      // clearArea = clearArea / 2;
      // const circleArea = clearArea * 0.25;

      function areaTween() {
        return function (d) {
          const interpolate = d3.interpolate({ ...this._current }, d);
          const _this = this;
          return function (t) {
            _this._current = interpolate(t);
            return radarLine(_this._current);
          };
        };
      }

      const axis = selected
        .selectAll(".axis")
        .data([axisData])
        .join(
          (enter) => {
            enter.append("g").attr("class", "axis");
          },
          (update) => update,
          (exit) => {
            exit.remove();
          }
        );

      // Append the lines
      function axisLine(eleRef) {
        eleRef
          .style("stroke", config.radarBGStroke)
          .style("stroke-width", config.radarBGStrokeWidth)
          .attr("x2", function (d, i) {
            return rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2);
          })
          .attr("y2", function (d, i) {
            return rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2);
          });
      }
      axis
        .selectAll(".axisLine")
        .data((d) => d)
        .join(
          (enter) => {
            enter
              .append("line")
              .attr("class", "axisLine line")
              .attr("x1", 0)
              .attr("y1", 0)
              .call(axisLine);
          },
          (update) => update.call(axisLine),
          (exit) => {
            exit.remove();
          }
        );

      // Create the straight lines radiating outward from the center

      const axisGrid = selected
        .selectAll(".radar-bg-grp")
        .data([data[0]])
        .join(
          (enter) => {
            enter.append("g").attr("class", "radar-bg-grp");
          },
          (update) => update,
          (exit) => {
            exit.remove();
          }
        );

      if (config.backgroundType === "circle") {
        // Wrapper for the grid & axes

        // Draw the background circles
        function levelCircle(eleRef) {
          eleRef
            .style("stroke", config.radarBGStroke)
            .style("stroke-width", config.radarBGStrokeWidth)
            .attr("r", function (d, i) {
              return (radius / config.levels) * d;
            })
            .style("fill-opacity", config.opacityCircles);
        }
        axisGrid
          .selectAll(".levels")
          .data(d3.range(1, config.levels + 1).reverse())
          .join(
            (enter) => {
              enter
                .append("circle")
                .attr("class", "levels gridCircle")
                .style("fill", "#CDCDCD")

                .style("filter", "url(#glow)")
                .call(levelCircle);
            },
            (update) => update.call(levelCircle),
            (exit) => {
              exit.remove();
            }
          );
      } else {
        function gridLine(eleRef) {
          eleRef
            .attr("d", function (d, i) {
              return radarLine(
                axisData.map((ele, i) => {
                  return { value: (maxValue / config.levels) * d };
                })
              );
            })
            .style("stroke-width", config.radarBGStrokeWidth)
            .style("stroke", config.radarBGStroke)
            .style("fill", "none")
            .style("filter", "url(#glow)");
        }
        axisGrid
          .selectAll(".levels")
          .data(d3.range(1, config.levels + 1).reverse())
          .join(
            (enter) => {
              enter
                .append("path")
                .attr("class", "levels gridline")
                .call(gridLine);
            },
            (update) => update.call(gridLine),
            (exit) => {
              exit.remove();
            }
          );
      }

      // Text indicating at what % each level is
      function axisLabels(eleRef) {
        eleRef
          .attr("y", function (d) {
            return (-d * radius) / config.levels;
          })
          .text(function (d, i) {
            return Format(d / config.levels);
          });
      }

      //For drop shadow
      const defs = selected.append("defs");
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

      axisGrid
        .selectAll(".axisLabel")
        .data(d3.range(1, config.levels + 1).reverse())
        .join(
          (enter) => {
            enter
              .append("text")
              .attr("class", "axisLabel")
              .attr("x", -10)
              .attr("dy", "0.4em")
              .attr("font-family", "Inter")
              .style("font-size", "8px")
              .attr("fill", "#718A9A")

              .call(axisLabels)
              .each(function (d, i) {
                const bbox = this.getBBox();
                const width = 28;
                const height = 14;

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
                  // .attr("stroke", "#737373")

                  .style("filter", "url(#drop-shadow)");
              });
          },
          (update) =>
            update.call(axisLabels).each(function (d, i) {
              const bbox = this.getBBox();
              const width = 28;
              const height = 14;

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
                // .attr("stroke", "#737373")

                .style("filter", "url(#drop-shadow)");
            }),
          (exit) => {
            exit.remove();
          }
        );

      axis
        .selectAll(".axisDot")
        .data((d) => d)

        .join(
          (enter) => {
            enter
              .append("rect")

              .attr("class", "axisDot")
              .attr("width", (d, i) => {
                return i === 0 ? 0 : 8;
              })
              .attr("height", (d, i) => {
                return i === 0 ? 0 : 8;
              })
              .attr("fill", "#fff")
              .attr("stroke", "#718A9A")
              .attr("rx", 2)
              .attr("ry", 2)

              .attr("x", function (d, i) {
                return (
                  rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2) - 4
                );
              })
              .attr("y", function (d, i) {
                return (
                  rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2) - 4
                );
              });
          },
          (update) => update,
          (exit) => {
            exit.remove();
          }
        );

      /// //////////////////////////////////////////////////////
      /// ///////////////// Draw the axes //////////////////////
      /// //////////////////////////////////////////////////////

      // Append the labels at each axis
      function axisLineLegend(eleRef) {
        eleRef
          .attr("x", function (d, i) {
            return (
              rScale(maxValue * config.labelXFactor) *
              Math.cos(angleSlice * i - Math.PI / 2)
            );
          })
          .attr("y", function (d, i) {
            return (
              rScale(maxValue * config.labelYFactor) *
              Math.sin(angleSlice * i - Math.PI / 2)
            );
          })
          .text(function (d) {
            return d.label;
          })
          .call(wrap, config.wrapWidth);
      }
      if (config.showLabel)
        axis
          .selectAll(".legend")
          .data((d) => d)
          .join(
            (enter) => {
              enter
                .append("text")

                .attr("class", "legend")
                .attr("text-anchor", "middle")
                .attr("dy", "0em")
                .attr("dx", "0em")
                .style("font-size", config.fontSize + "px")
                .attr("fill", config.labelColor)

                .call(axisLineLegend);
            },
            (update) => update.call(axisLineLegend),
            (exit) => {
              exit.remove();
            }
          );
      else axis.selectAll(".legend").remove();

      // Append the labels at each axis
      function axisLineLegendValue(eleRef) {
        eleRef
          .attr("x", function (d, i) {
            return (
              rScale(maxValue * config.labelXFactorValue) *
              Math.cos(angleSlice * i - Math.PI / 2)
            );
          })
          .attr("y", function (d, i) {
            return (
              rScale(maxValue * config.labelYFactorValue) *
              Math.sin(angleSlice * i - Math.PI / 2)
            );
          })
          .text(function (d) {
            return d.value + "%";
          });
        // .call(wrap, config.wrapWidth);
      }
      if (config.showValue)
        axis
          .selectAll(".legend-value")
          .data((d) => d)
          .join(
            (enter) => {
              enter
                .append("text")
                .attr("class", "legend-value")
                .attr("text-anchor", "middle")
                .attr("dy", "1em")
                .style("font-size", config.fontSize + "px")
                .attr("fill", config.subLabelColor)
                .call(axisLineLegendValue);
            },
            (update) => update.call(axisLineLegendValue),
            (exit) => {
              exit.remove();
            }
          );
      else axis.selectAll(".legend-value").remove();

      /// //////////////////////////////////////////////////////
      /// ////////// Draw the radar chart blobs ////////////////
      /// //////////////////////////////////////////////////////

      if (config.roundStrokes) {
        // radarLine.interpolate("cardinal-closed");
        radarLine.curve(d3.curveCardinalClosed);
      }
      // Create a wrapper for the blobs
      const blobWrapper = selected
        .selectAll(".radarWrapper")
        .data(data)
        .join(
          (enter) => {
            enter.append("g").attr("class", "radarWrapper");
          },
          (update) => update,
          (exit) => {
            exit.remove();
          }
        );

      // Append the backgrounds
      function radarArea(eleRef) {
        eleRef
          .attr("d", function (d, i) {
            return radarLine(d);
          })
          .style("fill", (d) => d[0].color)
          .style("fill-opacity", config.opacityArea);
      }
      blobWrapper
        .selectAll(".radarArea")
        .data((d) => [d])
        .join(
          (enter) => {
            enter
              .append("path")
              .attr("class", "radarArea")
              .attr("d", (d) => {
                const tempD = d.map((ele) => {
                  return { ...ele, value: "0" };
                });
                return radarLine(tempD);
              })
              .transition(t)
              .attrTween("d", areaTween())
              .call(radarArea);
          },
          (update) =>
            update.transition(t).attrTween("d", areaTween()).call(radarArea),
          (exit) => {
            exit.remove();
          }
        );

      // hover events on radar area
      blobWrapper
        .selectAll(".radarArea")
        .on("mouseover", function (d, i) {
          // Dim all blobs
          d3.selectAll(".radarArea").style("fill-opacity", 0.1);

          // Bring back the hovered over blob
          d3.select(this).style("fill-opacity", 0.7);
        })
        .on("mouseout", function () {
          // Bring back all blobs
          d3.selectAll(".radarArea").style("fill-opacity", config.opacityArea);
        });

      // Create the outlines
      function radarStroke(eleRef) {
        eleRef
          .attr("d", function (d, i) {
            return radarLine(d);
          })
          .style("stroke-width", config.strokeWidth + "px")
          .style("stroke", (d) => d[0].color)
          .style("fill", "none")
          .style("filter", "url(#glow)");
      }
      blobWrapper
        .selectAll(".radarStroke")
        .data((d) => {
          return [d];
        })
        .join(
          (enter) => {
            enter
              .append("path")
              .attr("class", "radarStroke")
              .attr("d", (d) => {
                const tempD = d.map((ele) => {
                  return { ...ele, value: "0" };
                });
                return radarLine(tempD);
              })
              .transition(t)
              .attrTween("d", areaTween())
              .call(radarStroke);
          },
          (update) =>
            update.transition(t).attrTween("d", areaTween()).call(radarStroke),
          (exit) => {
            exit.remove();
          }
        );

      // Append the circles
      function radarDotCircle(eleRef) {
        eleRef
          .attr("r", config.dotRadius)
          .attr("cx", function (d, i) {
            return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
          })
          .attr("cy", function (d, i) {
            return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
          })
          .style("fill", (d) => d.color)
          .style("fill-opacity", 0.8)
          .style("pointer-events", "all");
      }
      blobWrapper
        .selectAll(".radarCircle")
        .data(function (d, i) {
          return d;
        })
        .join(
          (enter) => {
            enter
              .append("circle")
              .attr("class", "radarCircle")
              .transition(t)
              .attrTween("d", areaTween())
              .call(radarDotCircle);
          },
          (update) =>
            update
              .transition(t)
              .attrTween("d", areaTween())
              .call(radarDotCircle),
          (exit) => {
            exit.remove();
          }
        );

      // hover events on circles
      blobWrapper
        .selectAll(".radarCircle")
        .on("mouseover", function (e, d, i) {
          const newX = parseFloat(d3.select(this).attr("cx")) - 10;
          const newY = parseFloat(d3.select(this).attr("cy")) - 10;
          tooltip
            .attr("x", newX)
            .attr("y", newY)
            .text(Format(d.value / 100))
            .style("opacity", 1);
        })
        .on("mouseout", function () {
          tooltip.style("opacity", 0);
        });

      // Set up the small tooltip for when you hover over a circle
      const tooltip = selected
        .selectAll(".tooltip")
        .data([data])
        .join(
          (enter) => {
            enter.append("text").attr("class", "tooltip").style("opacity", 0);
          },
          (update) => update,
          (exit) => exit.remove()
        );

      setUpEvents(config, selected, "radarArea");
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
