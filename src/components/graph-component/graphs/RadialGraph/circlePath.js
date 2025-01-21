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
    dataPosition: -1,
    pathLabelFontSize: 12,
    pathLabelColor: "#000",
    arcPathBgColor: "#F0F3FF",
    labelColor: "#000",
    lableFontSize: 10,
    subLabelColor: "#000",
    subLabelFontSize: 10,
    centerBG: "none",
    centerStroke: "#000",
    arcRadius: 1,
  };
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
      const circleArea =
        clearArea -
        config.arcPadding -
        config.arcWidth * data.length +
        config.arcPadding;

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
            (config.arcWidth * (config.arcRadius || 1) - config.arcPadding);
          finalInnerR = finalInnerR < 0 ? 0 : finalInnerR;
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

      if (config.enableCenterText) {
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
                // .style(
                //   'font-size',
                //   `${
                //     config.arcWidth < config.fontSize
                //       ? config.arcWidth * 0.85
                //       : config.fontSize
                //   }px`
                // )
                .style("font-size", `${config.pathLabelFontSize}px`)
                .style("fill", config.pathLabelColor)
                .style("transform", (d, i) => {
                  return `translate(${
                    (config.dataPosition * config.arcWidth) / 2
                  }px, ${
                    -1 *
                    (clearArea -
                      config.arcWidth / 2 +
                      config.arcPadding / 2 -
                      config.arcWidth * i)
                  }px)`;
                })
                .text((d) => d.label);
              // enterSelection.raise();
            },
            (update) => {
              update
                .style("font-size", `${config.pathLabelFontSize}px`)
                .style("fill", config.pathLabelColor)
                .style("transform", (d, i) => {
                  return `translate(${
                    (config.dataPosition * config.arcWidth) / 2
                  }px, ${
                    -1 *
                    (clearArea -
                      config.arcWidth / 2 +
                      config.arcPadding / 2 -
                      config.arcWidth * i)
                  }px)`;
                })
                .raise()
                .text((d) => d.label);
            }
          );
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
            // .style('font-size', `${clearArea * 0.175}px`)
            .style("font-size", `${config.lableFontSize}px`)
            .style("transform", (d, i) => {
              return `translate(0px, ${-1 * clearArea * 0.03}px)`;
            })
            .text((d) => d.label);

          elementRef
            .append("text")
            .attr("class", "circle-path-center-sub-label")
            .style("text-anchor", "middle")
            .style("font-size", `${config.subLabelFontSize}px`)
            .style("fill", config.subLabelColor)
            .style("transform", (d, i) => {
              return `translate(0px, ${clearArea * 0.13}px)`;
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
      }
      if (!config.enableCenterText) {
        selected.selectAll(".circle-path-label").remove();
        selected.selectAll(".circle-path-center-circle").remove();
        selected.selectAll(".circle-path-center-label").remove();
        selected.selectAll(".circle-path-center-sub-label").remove();
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
