import * as d3 from "d3";
import ColorParser from "../utils/colorParser";
import { colorBox, initialValues } from "../utils/graphConst";
import { setUpEvents } from "../utils/graphEvents";

export const circlePath = function circlePath() {
  let config = {
    ...initialValues,
    arcWidth: 20,
    arcPadding: 20,
    needleBreathing: 20,
    needleWidth: 10,
    endRadius: 10,
    startAngle: -1 * (Math.PI / 2),
    endAngle: Math.PI / 2,
    enableCenterText: true,
    // fontSize: 15,
    arcPathBgColor: "#F0F3FF",
    labelColor: "#000",
    subLabelColor: "#000",
    centerBG: "none",
    centerStroke: "#000",
    disableCenterSummary: true,
  };

  // needleWidth: 10,
  //  labelColor: "#000",
  // subLabelColor: "#000",
  //centerBG: "none",
  //centerStroke: "#000"
  //disableCenterSummary: false,

  // draw the graph here
  function graph(selected) {
    selected.each(function (inData) {
      const data = inData[0].map((ele) => ({
        ...ele,
        endAngle: config.endAngle,
      }));

      const t = d3.transition().duration(config.duration).ease(d3.easeLinear);
      let clearArea =
        config.width < config.height ? config.width : config.height;

      const arcWidth = config.arcWidth || clearArea * 0.06;
      config = {
        arcWidth,
        arcPadding: arcWidth * 0.1,
        needleBreathing: clearArea * 0.06,
        needleWidth: clearArea * 0.03,
        ...config,
      };

      clearArea = clearArea / 2;

      let circleArea;
      const arc = d3
        .arc()
        .cornerRadius(config.endRadius)
        .outerRadius((d, i) => {
          let finalOuterR =
            clearArea - config.arcWidth * (d.arrRadiusValue - 1);
          finalOuterR = finalOuterR < 0 ? 0 : finalOuterR;
          return finalOuterR;
        })
        .innerRadius((d, i) => {
          let finalInnerR =
            clearArea -
            config.arcWidth * (d.arrRadiusValue - 1) -
            (config.arcWidth * (d.arcRadius || 1) - config.arcPadding);
          finalInnerR = finalInnerR < 0 ? 0 : finalInnerR;
          if (i === data.length - 1) {
            circleArea = finalInnerR;
          }
          return finalInnerR;
        })
        .startAngle(config.startAngle);

      selected
        .selectAll(".circle-path")
        .data(data)
        .join(
          (enter) => {
            enter
              .append("path")
              .attr("class", "circle-path")
              .datum((d) => d)
              .style("fill", config.arcPathBgColor)
              .attr("d", arc);
          },
          (update) => update,
          (exit) => {
            exit.remove();
          }
        )
        .style("fill", (d, i) => config.arcPathBgColor || "#F0F3FF")
        .transition(50)
        .attr("d", arc);

      const prevData = selected.selectAll(".circle-path-f").node()
        ? selected.selectAll(".circle-path-f").data()
        : data.map((ele) => ({ value: 0, safeValue: 0 }));

      const valueToRadian =
        config.startAngle < 0
          ? (-1 * config.startAngle + config.endAngle) / 100
          : config.endAngle / 100;

      function arcTween() {
        return function (d, i) {
          const interpolate = d3.interpolate(
            config.startAngle +
              valueToRadian *
                (prevData[i].value >= 100 ? 100 : prevData[i].value),
            config.startAngle + valueToRadian * (d.value >= 100 ? 100 : d.value)
          );
          return function (t) {
            d.endAngle = interpolate(t);
            return arc(d);
          };
        };
      }

      selected
        .selectAll(".circle-path-f")
        .data((d, i) => {
          d.map((entry) => {
            const temp = JSON.parse(JSON.stringify(entry));
            // temp.labelIndex = i;
            return temp;
          });
          return d[0];
        })
        .join(
          (enter) => {
            enter
              .append("path")
              .attr("class", "circle-path-f")
              .style("fill", (d, i) => {
                return d.color || ColorParser(colorBox[i]);
              })
              .transition(t)
              .attrTween("d", arcTween());
          },
          (update) => update,
          (exit) => {
            exit.remove();
          }
        )
        .style("fill", (d, i) => {
          return d.color || ColorParser(colorBox[i]);
        })
        .transition(t)
        .attrTween("d", arcTween());

      setUpEvents(config, selected, "circle-path-f");

      const needleSpec = {
        width: config.needleWidth,
        height: clearArea - config.arcWidth - config.needleBreathing,
      };

      if (!config.enableCenterText && !data.length > 1) {
        selected
          .selectAll(".circle-path-n")
          .data((d, i) => {
            const filteredValues = d[0]
              .map((entry) => {
                const temp = JSON.parse(JSON.stringify(entry));
                // temp.labelIndex = i;
                return temp;
              })
              .filter((ele) => {
                return !ele.halfRadius;
              });

            return filteredValues;
          })
          .join(
            (enter) => {
              enter
                .append("path")
                .attr("class", "circle-path-n")
                .attr(
                  "d",
                  (d, i) =>
                    `M${needleSpec.width / 2} 0 L${
                      -1 * (needleSpec.width / 2)
                    } -0 L${-1 * (needleSpec.width / 2)} ${
                      -1 * needleSpec.height + config.arcWidth * d.index
                    } L${needleSpec.width / 2} ${
                      -1 * needleSpec.height + config.arcWidth * d.index
                    } Z`
                )
                .style("fill", config.needleFillColor || "#000")
                .style("stroke", config.needleStrokeColor || "green")
                .style("stroke-width", config.needleStrokeWidth || 1)
                .style(
                  "transform",
                  `rotate(${config.startAngle * (180 / Math.PI)}deg)`
                )
                .transition()
                .duration(config.duration / 2)
                .ease(d3.easeLinear)
                .style("transform", (d) => {
                  return `rotate(${parseInt(
                    (config.startAngle + valueToRadian * (d.value / 2)) *
                      (180 / Math.PI)
                  ).toFixed(2)}deg)`;
                })
                .end()
                .then(function () {
                  const cnode = d3.selectAll(".circle-path-n");
                  cnode
                    .transition()
                    .duration(config.duration / 2)
                    .ease(d3.easeLinear)
                    .style("transform", (d) => {
                      return `rotate(${parseInt(
                        (config.startAngle + valueToRadian * d.accValue) *
                          (180 / Math.PI)
                      ).toFixed(2)}deg)`;
                    });
                });
            },
            (update) => update,
            (exit) => {
              exit.remove();
            }
          )
          .transition(t)
          .style("transform", (d) => {
            return `rotate(${parseInt(
              (config.startAngle + valueToRadian * d.value) * (180 / Math.PI)
            ).toFixed(2)}deg)`;
          });
      }

      if (config.enableArcLabel) {
        selected
          .selectAll(".circle-path-label")
          .data(data)
          .join(
            (enter) => {
              enter
                .append("text")
                .attr("class", "circle-path-label")
                .style("text-anchor", "end")
                .style("alignment-baseline", "central")
                .style(
                  "font-size",
                  `${
                    config.arcWidth < config.fontSize
                      ? config.arcWidth * 0.85
                      : config.fontSize
                  }px`
                )
                .style("transform", (d, i) => {
                  return `translate(${(-1 * config.arcWidth) / 2}px, ${
                    -1 *
                    (clearArea -
                      config.arcWidth / 2 +
                      config.arcPadding / 2 -
                      config.arcWidth * i)
                  }px)`;
                })
                .text((d) => d.label);
            },
            (update) => update,
            (exit) => {
              exit.remove();
            }
          )
          .text((d) => d.label);
      } else {
        selected.selectAll(".circle-path-label").remove();
      }
      if (config.enableCenterText) {
        function centerGrp(elementRef) {
          elementRef.selectAll("*").remove();
          elementRef
            .append("circle")
            .attr("class", "circle-path-center-circle")
            .attr("r", (d) => {
              return circleArea;
            })
            .attr("fill", config.centerBG)
            .attr("stroke", config.centerStroke)
            .attr(
              "stroke-width",
              config.centerStrokeWidth || config.arcWidth * 0.03
            );

          elementRef
            .append("text")
            .attr("class", "circle-path-center-label")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("fill", config.labelColor)
            .style("font-size", `${circleArea * 0.5}px`)
            .style("transform", (d, i) => {
              return `translate(0px, ${-1 * clearArea * 0.03}px)`;
            })
            .text((d) => d.label);

          elementRef
            .append("text")
            .attr("class", "circle-path-center-sub-label")
            .style("text-anchor", "middle")
            .style("font-size", `${circleArea * 0.3}px`)
            .style("fill", config.subLabelColor)
            .style("transform", (d, i) => {
              return `translate(0px, ${clearArea * 0.1}px)`;
            })
            .text((d) => d.subLabel);
        }

        selected
          .selectAll(".circle-path-center-grp")
          .data([config.summary])
          .join(
            (enter) => {
              enter
                .append("g")
                .attr("class", "circle-path-center-grp")
                .call(centerGrp);
            },
            (update) => update,
            (exit) => {
              exit.remove();
            }
          )
          .call(centerGrp);
      } else {
        selected.selectAll(".circle-path-center-circle").remove();
        selected.selectAll(".circle-path-center-label").remove();
        selected.selectAll(".circle-path-center-sub-label").remove();
      }

      if (config.enableDataLabel) {
        selected
          .selectAll(".data-label")
          .data(data)
          .join(
            (enter) => {
              selected.selectAll(".data-label-text").remove();
              const labelGroup = enter
                .append("g")
                .attr("class", "data-label-group")

                .style("transform", (d) => {
                  let finalOuterR =
                    clearArea - config.arcWidth * (d.arrRadiusValue - 1);
                  finalOuterR = finalOuterR < 0 ? 0 : finalOuterR;
                  let finalInnerR =
                    clearArea -
                    config.arcWidth * (d.arrRadiusValue - 1) -
                    (config.arcWidth * (d.arcRadius || 1) - config.arcPadding);
                  finalInnerR = finalInnerR < 0 ? 0 : finalInnerR;

                  const radius = finalInnerR + (finalOuterR - finalInnerR) / 2;
                  const angle =
                    config.startAngle - Math.PI / 2 + d.value * valueToRadian;
                  const x = radius * Math.cos(angle);
                  const y = radius * Math.sin(angle);
                  let rotation = angle * (180 / Math.PI);
                  rotation =
                    Math.abs(rotation) > 90 ? rotation - 180 : rotation;

                  return `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
                });

              labelGroup
                .append("text")
                .attr("class", "data-label-text")
                .style("text-anchor", "middle")
                .attr("fill", config.dataLabelColor || "#000")
                .style("alignment-baseline", "central")
                .style("font-size", (d) => {
                  return `${
                    config.arcWidth - 0.5 * config.arcWidth <
                    config.dataLabelFontSize
                      ? config.arcWidth * 0.6
                      : config.dataLabelFontSize
                  }px`;
                })

                .attr("dy", (d) => {
                  let finalOuterR =
                    clearArea - config.arcWidth * (d.arrRadiusValue - 1);
                  finalOuterR = finalOuterR < 0 ? 0 : finalOuterR;
                  let finalInnerR =
                    clearArea -
                    config.arcWidth * (d.arrRadiusValue - 1) -
                    (config.arcWidth * (d.arcRadius || 1) - config.arcPadding);
                  finalInnerR = finalInnerR < 0 ? 0 : finalInnerR;

                  const radius = finalInnerR + (finalOuterR - finalInnerR) / 2;
                  const angle =
                    config.startAngle - Math.PI / 2 + d.value * valueToRadian;
                  const x = radius * Math.cos(angle);
                  const y = radius * Math.sin(angle);
                  const rotation = angle * (180 / Math.PI);

                  return config.dataLabelPosition === "inside"
                    ? Math.abs(rotation) > 90
                      ? "0.7em"
                      : "-0.7em"
                    : Math.abs(rotation) > 90
                    ? "-0.7em"
                    : "0.7em";
                })
                .text((d) => d.value);
            },
            (update) =>
              update
                .select(".data-label-text")

                .attr("stroke", config.dataLabelColor || "#000")
                // .style(
                //   "font-size",
                //   `${
                //     config.arcWidth < config.dataLabelFontSize
                //       ? config.arcWidth * 0.7
                //       : config.dataLabelFontSize
                //   }px`
                // )
                .style("transform", (d) => {
                  let finalOuterR =
                    clearArea - config.arcWidth * (d.arrRadiusValue - 1);
                  finalOuterR = finalOuterR < 0 ? 0 : finalOuterR;
                  let finalInnerR =
                    clearArea -
                    config.arcWidth * (d.arrRadiusValue - 1) -
                    (config.arcWidth * (d.arcRadius || 1) - config.arcPadding);
                  finalInnerR = finalInnerR < 0 ? 0 : finalInnerR;

                  const radius = finalInnerR + (finalOuterR - finalInnerR) / 2;
                  const angle =
                    config.startAngle -
                    Math.PI / 2 +
                    d.value * valueToRadian +
                    5;

                  const x = radius * Math.cos(angle);
                  const y = radius * Math.sin(angle);
                  return `translate(${x}px, ${y}px) rotate(${parseInt(
                    (angle * 180) / Math.PI
                  ).toFixed(2)}deg)`;
                }),
            (exit) => {
              exit.remove();
            }
          );
      } else {
        selected.selectAll(".data-label-text").remove();
        selected.selectAll(".data-label-group").remove();
        selected.selectAll(".data-label").remove();
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
