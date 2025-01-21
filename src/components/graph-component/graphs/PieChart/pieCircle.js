import * as d3 from "d3";
import ColorParser from "../utils/colorParser";
import { colorBox, initialValues } from "../utils/graphConst";
import { setUpEvents } from "../utils/graphEvents";

export const pieCircle = function pieCircle() {
  let config = {
    ...initialValues,
    piePadding: 20,
    graphType: "pie",
    overRideDefault: false,
    innerRadius: 0,
    arcLabelFontsize: 10,
    arcLabelColor: "#000",
    arcValueColor: "#000",
    arcValueFontWeight: 500,
    arcGap: 15,
    labelColor: "#000",
    subLabelColor: "#000",
    averageValue: false,
    enableCenterText: false,
    arcDividerStrokeColor: "white",
    startAngle: 0,
    endAngle: Math.PI * 2,
    needleBreathing: 20,
    percentValue: true,
    strokeWidth: 1,
    subLabelFontSize: 10,
    legendPosition: "right",
    polylineFontSize: 12,
    averageValueShow: 20,
  };

  const normalizeInnerRadius = (radius, clearArea) => {
    if (radius >= 0 && radius < 1) {
      return radius * clearArea;
    } else if (radius >= 1) {
      const ratio = 1 / radius;
      return clearArea * ratio;
    } else {
      return 0;
    }
  };

  // draw the graph here
  function graph(selected) {
    selected.each(function (data) {
      const t = d3
        .transition()
        .delay(function (d, i) {
          return i * 3;
        })
        .duration(config.duration);

      const mt = d3
        .transition()
        .delay(function (d, i) {
          return i * 3;
        })
        .duration(config.duration / 10);

      let clearArea =
        config.width < config.height ? config.width : config.height;

      if (!config.overRideDefault) {
        config = {
          ...config,
          piePadding: clearArea * 0.06,
        };
      }
      clearArea = clearArea / 2 - config.piePadding;

      const createPie = d3
        .pie()
        .startAngle(config.startAngle)
        .endAngle(config.endAngle)
        .value((d) => d.value)
        .sort(null);

      // const arc = d3
      // .arc()
      // .innerRadius(clearArea * config.innerRadius)
      // .outerRadius(clearArea);

      const arc = d3
        .arc()
        .innerRadius((d, i) => {
          const normalizedInnerRadius = normalizeInnerRadius(
            config.innerRadius,
            clearArea
          );
          return normalizedInnerRadius;
        })
        .outerRadius((d) =>
          config.graphType === "pie"
            ? clearArea
            : clearArea - d.data.labelIndex * (clearArea * config.innerRadius)
        )
        .padAngle(
          data.length === 1 ? 0 : config.padAngle ? config.padAngle : 0.001
        );

      const outerArc = d3
        .arc()
        .innerRadius(clearArea * 0.9)
        .outerRadius(clearArea * 0.9);

      const outerArcForLabel = d3
        .arc()
        .innerRadius(clearArea * 1.05)
        .outerRadius(clearArea * 1.05);

      function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
      }

      function arcTween() {
        return function (d) {
          const interpolate = d3.interpolate(this._current, d);
          const _this = this;
          return function (t) {
            _this._current = interpolate(t);
            return arc(_this._current);
          };
        };
      }

      function arcTween1() {
        return function (d) {
          const interpolate = d3.interpolate(
            {
              ...this._current,
              startAngle: config.startAngle,
              endAngle: config.startAngle,
            },
            d
          );
          const _this = this;
          return function (t) {
            _this._current = interpolate(t);
            return arc(_this._current);
          };
        };
      }
      const posCalc = function (d2, labelIndex, legendPosition) {
        let positionMultiplier = 0;

        if (
          config.legendPosition === "left" ||
          config.legendPosition === "top" ||
          config.legendPosition === "bottom"
        ) {
          positionMultiplier = 1;
        } else if (config.legendPosition === "right") {
          positionMultiplier = -1;
        }

        return (
          (config.width - clearArea * (config.innerRadius * 2.5) * labelIndex) *
          0.45 *
          positionMultiplier
        );
      };

      function polyAttrTween() {
        return function (d) {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            const d2 = interpolate(t);
            const pos = outerArc.centroid(d2);
            const horizontalSpacing = 5;
            const polylineOffset = config.polylineOffset || 0;
            pos[0] =
              posCalc(d2, d.data.labelIndex) +
              polylineOffset *
                (config.legendPosition === "left"
                  ? 1
                  : config.legendPosition === "right"
                  ? -1
                  : 0);
            if (config.legendPosition === "right") {
              pos[0] -= horizontalSpacing;
            } else {
              pos[0] += horizontalSpacing;
            }

            return "translate(" + pos + ")";
          };
        };
      }

      function styleTweenFunc(legendPosition) {
        return function (d) {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            const d2 = interpolate(t);
            return legendPosition === "right"
              ? "end"
              : legendPosition === "left"
              ? "start"
              : "start";
          };
        };
      }

      function centerGrp(elementRef) {
        elementRef.selectAll("*").remove();

        if (config.graphType === "customDonut") {
          const SvgArrow = {
            upWord: `
                <path d="M8.7071 1.2929C8.3166 0.9024 7.6834 0.9024 7.2929 1.2929L0.9289 7.6569C0.5384 8.0474 0.5384 8.6805 0.9289 9.071C1.3194 9.4615 1.9526 9.4615 2.3431 9.071L8 3.4142L13.6569 9.071C14.0474 9.4615 14.6805 9.4615 15.071 9.071C15.4615 8.6805 15.4615 8.0474 15.071 7.6569L8.7071 1.2929ZM7 2L7 19L9 19L9 2L7 2Z" fill="#4dd583"/>
            `,
            downWord: `
                <path d="M7.2929 15.7071C7.6834 16.0976 8.3166 16.0976 8.7071 15.7071L15.071 9.3431C15.4615 8.9526 15.4615 8.3194 15.071 7.9289C14.6805 7.5384 14.0474 7.5384 13.6569 7.9289L8 13.5858L2.3431 7.9289C1.9526 7.5384 1.3194 7.5384 0.9289 7.9289C0.5384 8.3194 0.5384 8.9526 0.9289 9.3431L7.2929 15.7071ZM7 1L7 18L9 18L9 1L7 1Z" fill="#FF4848"/>
            `,
          };

          const centralValue = config.summary.label;

          let arrowSvg;
          if (centralValue >= 7 && centralValue <= 10) {
            arrowSvg = SvgArrow.upWord;
          } else if (centralValue >= 4 && centralValue <= 6) {
            arrowSvg = SvgArrow.upWord;
          } else if (centralValue >= 1 && centralValue <= 3) {
            arrowSvg = SvgArrow.downWord;
          } else {
            arrowSvg = ""; // No arrow for unknown or other values
          }

          const group = elementRef
            .append("g")
            .attr("class", "circle-path-center-label-group")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("fill", config.labelColor)
            .style("font-size", `${clearArea * 0.175}px`)
            .style("transform", (d, i) => {
              return `translate(0px, ${-1 * clearArea * 0.03}px)`;
            });

          group
            .append("text")
            .attr("class", "circle-path-center-label")
            .text(
              config.graphType === "customDonut" ? centralValue : (d) => d.label
            );

          if (arrowSvg) {
            const arrowGroup = group
              .append("g")
              .attr("transform", "translate(10, -12.5) scale(0.67)");

            arrowGroup.html(arrowSvg);
          }

          elementRef
            .append("text")
            .attr("class", "circle-path-center-label")
            .style("text-anchor", "middle")
            .style("font-weight", "600")
            .style("fill", config.labelColor)
            .style("font-size", "24px")
            .style("transform", (d, i) => {
              return `translate(0px, ${-1 * clearArea * 0.03}px)`;
            })
            .text(centralValue);
        } else {
          elementRef
            .append("text")
            .attr("class", "circle-path-center-label")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("fill", config.labelColor)
            .style("font-size", `${clearArea * 0.175}px`)
            .style("transform", (d, i) => {
              return `translate(0px, ${-1 * clearArea * 0.03}px)`;
            })
            .text(
              config.averageValue ? config.averageValueShow : (d) => d.label
            );
        }

        // elementRef
        //   .append("text")
        //   .attr("class", "circle-path-center-sub-label")
        //   .style("text-anchor", "middle")
        //   .style("font-size", `${clearArea * 0.1}px`)
        //   .style("font-size", `${config.subLabelFontSize}px`)
        //   .style("fill", config.subLabelColor)
        //   .style("transform", (d, i) => {
        //     return `translate(0px, ${clearArea * 0.13}px)`;
        //   });
        //  .text((d) => d.subLabel);
        if (config.graphType === "customDonut") {
          const value = config.summary.label;

          let centralText;
          if (value >= 7 && value <= 10) {
            centralText = "GOOD";
          } else if (value >= 4 && value <= 6) {
            centralText = "FAIR";
          } else if (value >= 1 && value <= 3) {
            centralText = "POOR";
          } else {
            centralText = "UNKNOWN";
          }

          let rectColor;
          if (centralText === "GOOD") {
            rectColor = "#4dd583";
          } else if (centralText === "FAIR") {
            rectColor = "#f9c969";
          } else if (centralText === "POOR") {
            rectColor = "#ff6363";
          } else {
            rectColor = "#ccc";
          }

          const rectWidth = 54;
          const rectHeight = 17;
          const rectRadius = 20;
          const padding = { top: 5, right: 20, bottom: 5, left: 20 };

          const rectGroup = elementRef
            .append("g")
            .attr("class", "rectangle-with-text")
            .attr("transform", `translate(0, ${clearArea * 0.15})`);

          rectGroup
            .append("rect")
            .attr("width", rectWidth + padding.left + padding.right)
            .attr("height", rectHeight + padding.top + padding.bottom)
            .attr("rx", rectRadius)
            .attr("ry", rectRadius)
            .style("fill", rectColor)
            .attr("x", -rectWidth / 2 - padding.left)
            .attr("y", -rectHeight / 2 - padding.top);

          // Add text inside the rectangle
          rectGroup
            .append("text")
            .attr("class", "rectangle-text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", "0.35em")
            .style("fill", "#fff")
            .style("font-size", "12px")
            .style("text-anchor", "middle")
            .text(centralText);
        } else {
          const subLabelTextElement = elementRef
            .append("text")
            .attr("class", "circle-path-center-sub-label")
            .style("text-anchor", "middle")
            .style("font-size", `${config.subLabelFontSize}px`)
            .style("fill", config.subLabelColor)
            .style("transform", (d, i) => {
              return `translate(0px, ${clearArea * 0.13}px)`;
            });
          const maxWidth = clearArea * 0.8;
          const lineHeight = 1.1;
          const dyOffset = 0.5;

          const subLabelText = subLabelTextElement
            .append("tspan")
            .text((d) => (config.averageValue ? "Average" : d.subLabel));

          subLabelText.each(function () {
            const text = d3.select(this);
            const word = text.text();
            let currentLine = "";
            let y = text.attr("y");
            let dy = parseFloat(text.attr("dy"));
            let tspan = text
              .text(null)
              .append("tspan")
              .attr("x", 0)
              .attr("y", y)
              .attr("dy", dy + "em");

            for (let i = 0; i < word.length; i++) {
              const char = word[i];
              const testLine = currentLine + char;
              tspan.text(testLine);
              if (tspan.node().getComputedTextLength() > maxWidth) {
                tspan.text(currentLine);
                currentLine = char;
                tspan = text
                  .append("tspan")
                  .attr("x", 0)
                  .attr("y", y)
                  .attr("dy", `${lineHeight + dyOffset}em`)
                  .text(char);
              } else {
                currentLine = testLine;
              }
            }
            tspan.text(currentLine);
          });
        }
      }

      // const prevData = selected.selectAll('.pie-path').node()
      //   ? selected.selectAll('.pie-path').data()
      //   : data.map((ele) => ({ label: 'label', value: 0, safeValue: 0 }));

      if (config.enableArcBG) {
        const bgWrp = selected
          .selectAll(".pie-bg-wrp")
          .data(
            createPie([{ label: "", value: 100, color: config.enableArcBG }])
          )
          .join(
            (enter) => {
              enter.append("g").attr("class", "pie-bg-wrp");
            },
            (update) => update,
            (exit) => exit.remove()
          );

        bgWrp
          .selectAll(".pie-path-bg")
          .data(
            createPie([{ label: "", value: 100, color: config.enableArcBG }])
          )
          .join(
            (enter) => {
              enter
                .append("path")
                .attr("class", "pie-path-bg")
                .transition(mt)
                .attrTween("d", arcTween1())
                .attr("stroke", config.arcDividerStrokeColor)
                .attr("fill", (d, i) => {
                  return d.data.color || ColorParser(colorBox[i]);
                })
                .style("stroke-width", `${config.strokeWidth}px`)
                .style("opacity", 1);
            },
            (update) => update,
            (exit) => {
              exit.remove();
            }
          );
        // .transition(mt)
        // .attr("stroke", config.arcDividerStrokeColor)
        // .attr("fill", (d, i) => {
        //   return d.data.color || ColorParser(colorBox[i]);
        // })
        // .style("stroke-width", "2px")
        // .style("opacity", 1)
        // .attrTween("d", arcTween());
      }

      selected
        .selectAll(".pie-path-grp")
        .data(data)
        .join(
          (enter) => {
            enter.append("g").attr("class", "pie-path-grp");
          },
          (update) => update,
          (exit) => exit.remove()
        );

      if (config.hoverExternalRadialEffect) {
        const largerArc = d3
          .arc()
          .innerRadius((d) => arc.outerRadius()(d)) // Keep is start from outer border
          .outerRadius(
            (d) => arc.outerRadius()(d) + config.externalOuterRadius || 10
          ) // Increase outer radius
          .cornerRadius(config.externalCornerRadius || 10);
        // Add larger circles to each pie-path-grp with the same color and 0.5 opacity
        selected
          .selectAll(".pie-path-grp")
          .selectAll(".external-circle")
          .data((d) => createPie(d))
          .join(
            (enter) => {
              enter
                .append("path")
                .attr("class", "external-circle")
                .attr("d", largerArc) // Set initial arc path
                .style("stroke", config.arcDividerStrokeColor)
                .style("fill", (d, i) => {
                  return d.data.color || ColorParser(colorBox[i]);
                })
                .style("stroke-width", `${config.strokeWidth}px`)
                .style("opacity", config.externalArcOpacity || 0.3)
                .style("visibility", "hidden"); // Initially hidden
            },
            (update) => {
              update
                .style("stroke", config.arcDividerStrokeColor)
                .style("fill", (d, i) => {
                  return d.data.color || ColorParser(colorBox[i]);
                })
                .style("stroke-width", `${config.strokeWidth}px`)
                .style("opacity", config.externalArcOpacity || 0.3)
                .style("visibility", "hidden") // Hidden for updated elements
                .attr("d", largerArc); // Update the arc path
            },
            (exit) => {
              exit.remove();
            }
          );
      }

      selected
        .selectAll(".pie-path-grp")
        .selectAll(".pie-path")
        .data((d, i) => {
          return createPie(d);
        })
        .join(
          (enter) => {
            enter
              .append("path")
              .attr("class", "pie-path")
              .transition(t)
              .attrTween("d", arcTween1())
              .style("stroke", config.arcDividerStrokeColor)
              .style("fill", (d, i) => {
                return d.data.color || ColorParser(colorBox[i]);
              })
              .style("stroke-width", `${config.strokeWidth}px`)
              .style("opacity", 1);
          },
          (update) =>
            update
              .transition(t)
              .style("stroke", config.arcDividerStrokeColor)
              .style("fill", (d, i) => {
                return d.data.color || ColorParser(colorBox[i]);
              })
              .style("stroke-width", `${config.strokeWidth}px`)
              .style("opacity", 1)
              .attrTween("d", arcTween()),
          (exit) => {
            exit.remove();
          }
        );

      // Variable to keep track of the currently selected pie path
      let selectedPiePath = null;
      let currentElementData = null;

      // Enable mouse functions
      selected
        .selectAll(".pie-path-grp")
        .selectAll(".pie-path")
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
          config.handleMouseEnter(event, d, config);
          config.handleMouseMove(event, d, config);
          if (config.hoverExternalRadialEffect) {
            // Remove hoverSelected from all external-circle elements
            d3.selectAll(".external-circle").classed("hoverSelected", false);

            // Add hoverSelected to the corresponding external-circle
            if (!d3.select(this).classed("clicked")) {
              d3.select(this.parentNode)
                .selectAll(".external-circle")
                .filter((circleData) => circleData.index === d.index)
                .classed("hoverSelected", true);
            }
          }

          if (config.highlight) {
            // Add hover-selected class to the hovered element
            d3.select(this).classed("hover-selected", true);
            // Add hover-unselected class to all other elements, except the currently selected one and those with the clicked class
            d3.selectAll(".pie-path")
              .filter((path, index, nodes) => {
                // Check if the path is not the current element and does not have the clicked class
                return (
                  path !== currentElementData &&
                  !d3.select(nodes[index]).classed("clicked")
                );
              })
              .classed("hover-unselected", true);
            // Ensure the hovered element does not get the hover-unselected class
            d3.select(this).classed("hover-unselected", false);
          }
        })
        .on("mouseout", function (event, d) {
          config.handleMouseLeave(event, d, config);

          if (config.hoverExternalRadialEffect) {
            // Remove hoverSelected from all external-circle elements
            d3.selectAll(".external-circle").classed("hoverSelected", false);
          }

          if (config.highlight) {
            // Remove hover-selected and hover-unselected classes from all elements
            d3.selectAll(".pie-path")
              .classed("hover-selected", false)
              .classed("hover-unselected", false);
          }
        })
        .on("click", function (event, d) {
          // config.handleOnClick(event, d);

          if (config.selectExpantion) {
            const currentElement = this;
            const isSameElement = selectedPiePath === currentElement;

            // Get the data bound to the current element
            const currentData = d3.select(currentElement).datum();

            // Reset the translation for all pie slices
            selected
              .selectAll(".pie-path-grp")
              .selectAll(".pie-path")
              .transition()
              .duration(config.expansionAnimationDuration) // Adjust the duration as needed
              .attr("transform", "translate(0,0)")
              .on("end", function () {
                d3.selectAll(".pie-path").classed("clicked", false);
              });

            // If the same slice is clicked again, reset selectedPiePath and do not apply translation
            if (isSameElement) {
              selectedPiePath = null;
              currentElementData = null;
              return;
            }

            // Calculate the translation for the selected pie slice
            const arcCenter = arc.centroid(d);
            const translation = `translate(${
              arcCenter[0] * config.expansionOffset
            }, ${arcCenter[1] * config.expansionOffset})`;

            // Animate the translation for the selected pie slice
            d3.select(currentElement)
              .transition()
              .duration(config.expansionAnimationDuration) // Adjust the duration as needed
              .attr("transform", translation)
              .on("end", function () {
                d3.select(this).classed("clicked", true);
              });

            // Set the visibility of the corresponding external-circle to none
            d3.select(currentElement.parentNode)
              .selectAll(".external-circle")
              .filter((circleData) => circleData.index === d.index)
              .classed("hoverSelected", false);

            // Update selectedPiePath to the current element
            selectedPiePath = currentElement;
            currentElementData = currentData;
          }
        });

      if (config.enablePolyline) {
        const transitionDuration = 300;
        const polyLineMinOffsetFromEachOther = config.polylineFontSize * 1.5;
        const polyLineOverlappingThreshold = config.polylineFontSize * 1.5;
        let lastPosC = [0, 0];
        selected
          .selectAll(".pie-path-grp")
          .selectAll(".pie-path-polyline")
          .data((d) => createPie(d))
          .join(
            (enter) => {
              enter
                .append("polyline")
                .attr("class", "pie-path-polyline")

                .transition()
                .duration(transitionDuration)
                .delay(transitionDuration)

                .attr("fill", "none")
                .attr("stroke", (d) => config.polylineColor || d.data.color)
                .transition(t)
                .attr("points", (d) => {
                  const posA = arc.centroid(d);
                  const posB = outerArcForLabel.centroid(d);
                  const posC = outerArcForLabel.centroid(d);
                  const midangle = midAngle(d);

                  posC[0] =
                    clearArea *
                    1.05 *
                    (config.graphType === "halfdonut"
                      ? midangle < 0
                        ? -1
                        : 1
                      : midangle < Math.PI
                      ? 1
                      : -1);

                  // Adjust posC if it's too close to lastPosC
                  const distance = Math.hypot(
                    posC[0] - lastPosC[0],
                    posC[1] - lastPosC[1]
                  );
                  if (distance < polyLineOverlappingThreshold) {
                    posB[1] +=
                      polyLineMinOffsetFromEachOther *
                      (midangle < Math.PI ? -1 : 1);
                    posC[1] +=
                      polyLineMinOffsetFromEachOther *
                      (midangle < Math.PI ? -1 : 1);
                  }

                  // Update lastPosC
                  lastPosC = posC;

                  return [posA, posB, posC];
                });
            },
            (update) =>
              update
                .transition(t)
                .attr("fill", "none")
                .attr("stroke", (d) => config.polylineColor || d.data.color)
                .attr("points", (d) => {
                  const posA = arc.centroid(d);
                  const posB = outerArcForLabel.centroid(d);
                  const posC = outerArcForLabel.centroid(d);
                  const midangle = midAngle(d);
                  posC[0] =
                    clearArea *
                    1.05 *
                    (config.graphType === "halfdonut"
                      ? midangle < 0
                        ? -1
                        : 1
                      : midangle < Math.PI
                      ? 1
                      : -1);

                  // Adjust posC if it's too close to lastPosC
                  const distance = Math.hypot(
                    posC[0] - lastPosC[0],
                    posC[1] - lastPosC[1]
                  );
                  if (distance < polyLineOverlappingThreshold) {
                    posB[1] +=
                      polyLineMinOffsetFromEachOther *
                      (midangle < Math.PI ? -1 : 1);
                    posC[1] +=
                      polyLineMinOffsetFromEachOther *
                      (midangle < Math.PI ? -1 : 1);
                  }

                  // Update lastPosC
                  lastPosC = posC;

                  return [posA, posB, posC];
                }),

            (exit) => {
              exit.remove();
            }
          );

        selected
          .selectAll(".pie-path-grp")
          .selectAll(".pie-path-polyline-legends")
          .data((d) => createPie(d))
          .join(
            (enter) => {
              enter
                .append("text")
                .attr("class", "pie-path-polyline-legends")
                .attr("dy", ".35em")
                .text(function (d) {
                  return d.data.label;
                })

                .transition(t)
                .attr("transform", (d) => {
                  const pos = outerArcForLabel.centroid(d);
                  const midangle = midAngle(d);
                  pos[0] =
                    clearArea *
                    1.07 *
                    (config.graphType === "halfdonut"
                      ? midangle < 0
                        ? -1
                        : 1
                      : midangle < Math.PI
                      ? 1
                      : -1);
                  // Adjust posC if it's too close to lastPosC
                  const distance = Math.hypot(
                    pos[0] - lastPosC[0],
                    pos[1] - lastPosC[1]
                  );
                  if (distance < polyLineOverlappingThreshold) {
                    pos[1] +=
                      polyLineMinOffsetFromEachOther *
                      (midangle < Math.PI ? -1 : 1);
                  }

                  // Update lastPosC
                  lastPosC = pos;
                  return `translate(${pos})`;
                })
                .attr("text-anchor", (d) => {
                  const midangle = midAngle(d);

                  return config.graphType === "halfdonut"
                    ? midangle < 0
                      ? "end"
                      : "start"
                    : midangle < Math.PI
                    ? "start"
                    : "end";
                })

                .style("font-size", `${config.polylineFontSize}px`);
            },
            (update) =>
              update
                .attr("dy", ".35em")
                .text(function (d) {
                  return d.data.label;
                })
                .transition(t)
                .attr("transform", (d) => {
                  const pos = outerArcForLabel.centroid(d);
                  const midangle = midAngle(d);
                  pos[0] =
                    clearArea *
                    1.07 *
                    (config.graphType === "halfdonut"
                      ? midangle < 0
                        ? -1
                        : 1
                      : midangle < Math.PI
                      ? 1
                      : -1);
                  // Adjust posC if it's too close to lastPosC
                  const distance = Math.hypot(
                    pos[0] - lastPosC[0],
                    pos[1] - lastPosC[1]
                  );
                  if (distance < polyLineOverlappingThreshold) {
                    pos[1] +=
                      polyLineMinOffsetFromEachOther *
                      (midangle < Math.PI ? -1 : 1);
                  }

                  // Update lastPosC
                  lastPosC = pos;
                  return `translate(${pos})`;
                })
                .attr("text-anchor", (d) => {
                  const midangle = midAngle(d);

                  return config.graphType === "halfdonut"
                    ? midangle < 0
                      ? "end"
                      : "start"
                    : midangle < Math.PI
                    ? "start"
                    : "end";
                  // return midangle < Math.PI ? "start" : "end";
                })
                .style("font-size", `${config.polylineFontSize}px`),
            (exit) => {
              exit.remove();
            }
          );
      }

      if (config.enableNeedle) {
        const needleSpec = {
          width: clearArea * (config.needleWidth || config.innerRadius / 4),
          height:
            clearArea -
            clearArea * (config.innerRadius + config.innerRadius * 0.5),
        };
        const valueToRadian =
          config.startAngle < 0
            ? (-1 * config.startAngle + config.endAngle) / 100
            : config.endAngle / 100;

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
                .attr("stop-color", config.indicatorColor2 || "#000000")
                .attr("stop-opacity", config.colorOpacity || 1);

              gradientOffset
                .append("stop")
                .attr("offset", "100%")
                .attr("stop-color", config.indicatorBottomColor || "#fff")
                .attr("stop-opacity", config.colorOpacityBottom || 1);
            },
            (update) => update,
            (exit) => {
              exit.remove();
            }
          );

        selected
          .selectAll(".circle-path-n")
          .data((d, i) => {
            return [{ ...config.summary }];
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
                      -1 * needleSpec.height
                    } L${needleSpec.width / 2} ${-1 * needleSpec.height} Z`
                )
                .style(
                  "fill",
                  config.needleFillColor || "url(#gradOffset-indicator)"
                )
                .style("stroke", config.needleStrokeColor || "none")
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
                    (config.startAngle + valueToRadian * d.value) *
                      (180 / Math.PI)
                  ).toFixed(2)}deg)`;
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

      function labelDisplayHalfDonut(d) {
        const diff = Math.abs(d.endAngle - d.startAngle);
        const threshold = 0.01; // Adjust as needed

        // Check if the segment represents a half donut (180 degrees)
        const isHalfDonut = Math.abs(d.endAngle - d.startAngle) === Math.PI;

        // Check if the angle difference is greater than the threshold or if it represents a half donut
        return diff > threshold || isHalfDonut;
      }

      function labelDisplay(d) {
        const diff = d.endAngle - d.startAngle;

        return diff > 1;
      }

      // Calculate the maximum number of characters that fit inside the bubble
      function calculateMaxCharacters(radius, fontSize) {
        const availableWidth = 2 * radius - radius * 0.55; // Adjust padding as needed
        const avgCharacterWidth = fontSize * 0.6; // Adjust factor as needed
        return Math.floor(availableWidth / avgCharacterWidth);
      }

      if (config.enableCenterText) {
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
            (update) => update.call(centerGrp),
            (exit) => {
              exit.remove();
            }
          );
      }

      config.arcLabel &&
        selected
          .selectAll(".pie-path-grp")
          .selectAll(".pie-path-label")
          .data((d) => createPie(d))
          .join(
            (enter) => {
              enter
                .append("text")
                .attr("class", "pie-path-label")
                .style("text-anchor", "middle")
                .style("fill", "white")
                .style("font-weight", config.arcValueFontWeight)
                .style("fill", config.arcLabelColor)
                .style("pointer-events", "none")
                .style("font-size", config.arcLabelFontsize)
                .style("font-weight", config.arcValueFontWeight)
                .attr(
                  "transform",
                  (d) => `translate(${arc.centroid(d).map((ele) => ele / 2)})`
                )
                .transition(t)
                .attr("transform", (d) => `translate(${arc.centroid(d)})`)
                .text((d) => {
                  const maxCharacters = calculateMaxCharacters(
                    clearArea / 2,
                    config.arcPathLabelFontSize || 10
                  ); // 12 is the font size
                  if (d.data.label.length > maxCharacters) {
                    return (
                      d.data.label.substr(0, maxCharacters - 3) +
                      (maxCharacters - 3 < 1 ? "" : "..")
                    );
                  }
                  // return labelDisplay(d) ? d.data.label : "";

                  return config.graphType === "halfdonut"
                    ? labelDisplayHalfDonut(d)
                      ? d.data.label
                      : ""
                    : labelDisplay(d)
                    ? d.data.label
                    : "";
                });
              // .text(function (d) {
              //   return labelDisplay(d) ? d.data.label : '';
              // });
              // .tween('text', (d, i, nodes) => {
              //   const interpolator = d3.interpolate(prevData[i], d)
              //   return (t) =>
              //     d3.select(nodes[i]).text(parseInt(interpolator(t).value))
              // })
            },
            (update) =>
              update
                .style("font-size", config.arcLabelFontsize)
                .style("fill", config.arcLabelColor)
                .style("font-weight", config.arcValueFontWeight)
                .transition(t)
                .attr("transform", (d) => `translate(${arc.centroid(d)})`)
                .text((d) => {
                  const maxCharacters = calculateMaxCharacters(
                    clearArea / 2,
                    config.arcPathLabelFontSize || 10
                  ); // 12 is the font size
                  if (d.data.label.length > maxCharacters) {
                    return (
                      d.data.label.substr(0, maxCharacters - 3) +
                      (maxCharacters - 3 < 1 ? "" : "..")
                    );
                  }
                  return config.graphType === "halfdonut"
                    ? labelDisplayHalfDonut(d)
                      ? d.data.label
                      : ""
                    : labelDisplay(d)
                    ? d.data.label
                    : "";
                }),
            // .text(function (d) {
            //   return labelDisplay(d) ? d.data.label : '';
            // }),
            // .tween('text', (d, i, nodes) => {
            //   const interpolator = d3.interpolate(prevData[i], d)
            //   return (t) =>
            //     d3.select(nodes[i]).text(parseInt(interpolator(t).value))
            // })
            (exit) => {
              exit.remove();
            }
          );

      function radiansToPercentage(d) {
        const radians = d.endAngle - d.startAngle;
        const fullCircleRadians = 2 * Math.PI;
        const percentage = parseFloat(
          (radians / fullCircleRadians) * 100
        ).toFixed(1);

        if (percentage.toString().endsWith(".0")) {
          return `${parseInt(percentage)}%`;
        } else {
          return `${percentage}%`;
        }
      }
      function formatValue(value) {
        if (value >= 1000000) {
          return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 10000) {
          return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)} K`;
        }
        return value;
      }
      config.arcLabel &&
        selected
          .selectAll(".pie-path-grp")
          .selectAll(".pie-path-value")
          .style("font-size", `${config.arcLabelFontsize}px`)
          .style("font-weight", config.arcValueFontWeight)
          .data((d) => createPie(d))
          .join(
            (enter) => {
              enter
                .append("text")
                .attr("class", "pie-path-value")
                .style("text-anchor", "middle")
                .style("fill", "white")
                .style("pointer-events", "none")
                .style("fill", config.arcValueColor)
                .style("font-weight", config.arcValueFontWeight)
                .style("font-size", config.arcLabelFontsize)
                .attr(
                  "transform",
                  (d) => `translate(${arc.centroid(d).map((ele) => ele / 2)})`
                )
                .transition(t)
                .attr(
                  "transform",
                  (d) =>
                    `translate(${[
                      arc.centroid(d)[0],
                      arc.centroid(d)[1] + (config.arcValueY || config.arcGap),
                    ]})`
                )
                .text(function (d) {
                  return labelDisplay(d)
                    ? config.percentValue
                      ? radiansToPercentage(d)
                      : formatValue(d.data.value)
                    : "";
                });
            },
            (update) =>
              update
                .transition(t)
                .attr(
                  "transform",
                  (d) =>
                    `translate(${[
                      arc.centroid(d)[0],
                      arc.centroid(d)[1] + (config.arcValueY || config.arcGap),
                    ]})`
                )
                .style("fill", config.arcValueColor)
                .text(function (d) {
                  return labelDisplay(d)
                    ? config.percentValue
                      ? radiansToPercentage(d)
                      : formatValue(d.data.value)
                    : "";
                }),

            (exit) => {
              exit.remove();
            }
          );

      // setUpEvents(config, selected, "pie-path");
      if (!config.arcLabel) {
        selected.selectAll(".pie-path-label").remove();
        selected.selectAll(".pie-path-value").remove();
      }

      if (!config.enablePolyline) {
        selected.selectAll(".pie-path-polyline").remove();
        selected.selectAll(".pie-path-polyline-legends").remove();
      }
      if (!config.enableCenterText) {
        selected.selectAll(".circle-path-center-grp").remove();
      }
      if (!config.subLabelColor) {
        selected.selectAll(".circle-path-center-sub-label").style("fill", null);
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
