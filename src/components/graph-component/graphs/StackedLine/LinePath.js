import * as d3 from 'd3';
import { colorBox, initialValues } from '../utils/graphConst';
import { setUpEvents } from '../utils/graphEvents';

export const stackedLinePath = function stackedLinePath() {
  let config = {
    ...initialValues,
    enableCurve: false,
    enableStep: false,
    areaLineStroke: '#8676FF',
    areaLineStrokeWidth: 2,
    r: 5,
    enablePointCircle: false,
    // pointCircleFill: "none",
    pointCircleStroke: '#8676FF',
    pointCircleStrokeWidth: 2,
    enableThreshold: false,
    thresholdStroke: 'red',
    thresholdStrokeWidth: 2,
    enableGradient: false,
    disableCircleLabel: true,
  };

  // draw the graph here
  function graph(selected) {
    selected.each(function (data) {
      const t = d3.transition().duration(config.duration);

      // selected.selectAll("defs").remove();

      function lg(eleRef) {
        const gradientOffset = eleRef
          // .attr("cx", "25%")
          // .attr("cy", "25%")
          // .attr("r", "65%")
          .attr('x1', '0%')
          .attr('y1', '0%')
          .attr('x2', '0%')
          .attr('y2', '100%')
          .attr('id', function (d, i) {
            return 'gradOffset-' + i;
          });

        gradientOffset
          .selectAll('.stop')
          .data((d) => {
            return [d];
          })
          .join(
            (enter) => {
              enter
                .append('stop')
                .attr('class', 'stop')
                .attr('offset', '0%')
                .attr('stop-color', (d) => d[0].color)
                .attr('stop-opacity', (d) => d.colorOpacity || 0.5);
            },
            (update) => {
              update
                .attr('offset', '0%')
                .attr('stop-color', (d) => d[0].color)
                .attr('stop-opacity', (d) => d.colorOpacity || 0.5);
            },
            (exit) => exit.remove()
          );

        gradientOffset
          .selectAll('.stop1')
          .data((d) => {
            return [d];
          })
          .join(
            (enter) => {
              enter
                .append('stop')
                .attr('class', 'stop1')
                .attr('offset', '100%')
                .attr('stop-color', (d) => d[0].color1 || '#fff')
                .attr('stop-opacity', (d) => d.colorOpacity1 || 0.5);
            },
            (update) => {
              update
                .attr('offset', '100%')
                .attr('stop-color', (d) => d[0].color1 || '#fff')
                .attr('stop-opacity', (d) => d.colorOpacity1 || 0.5);
            },
            (exit) => exit.remove()
          );
      }

      function createDefs(elementRef) {
        elementRef
          .selectAll('.gradientOffset')
          .data((d) => {
            return d;
          })
          .join(
            (enter) => {
              enter
                .append('linearGradient')
                .attr('class', 'gradientOffset')
                .call(lg);
            },
            (update) => update.call(lg),
            (exit) => exit.remove()
          )
          .call(lg);
      }

      selected
        .selectAll('.defs')
        .data((d) => {
          return [d];
        })
        .join(
          (enter) => {
            enter.append('defs').attr('class', 'defs').call(createDefs);
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

      if (config.enableCurve) {
        areaConsts.curve(d3.curveMonotoneX);
        lineConst.curve(d3.curveMonotoneX); // apply smoothing to the line
      } else if (config.enableStep) {
        areaConsts.curve(d3.curveStepAfter);
        lineConst.curve(d3.curveStepAfter); // apply smoothing to the line
      }

      // const line = lineConst.y(function (d) {
      //   return config.yScale(d.value);
      // });

      // const lineFunc = function (datum, boolean) {
      //   return lineConst.y(function (d) {
      //     return config.yScale(boolean ? d.value : 0);
      //   })(datum);
      // };

      // const area = function (datum, boolean) {
      //   return areaConsts
      //     .y0(function (d, i) {
      //       return config.yScale(config.minY < 0 ? config.minY : 0);
      //     })
      //     .y1(function (d, i) {
      //       return config.yScale(boolean ? d.value : 0);
      //     })(datum);
      // };
      // Construct an stacked area generator.

      const sarea = function (datum, boolean) {
        return areaConsts
          .y0(function (d, i) {
            return boolean
              ? config.yScale(d.accValue - d.value)
              : config.yScale(0);
          })
          .y1(function (d, i) {
            return boolean ? config.yScale(d.accValue) : config.yScale(0);
          })(datum);
      };

      // Construct an range area generator.
      // const rband = function () {
      //   return areaConsts
      //     .y0(function (d, i) {
      //       return config.yScale(d.value);
      //     })
      //     .y1(function (d) {
      //       return config.yScale(d.lastLineValue);
      //     });
      // };

      function linePathFun(elementRef) {
        elementRef
          .attr('fill', (d, i) => {
            return config.enableGradient
              ? `url(#gradOffset-${i})`
              : d[0].color
              ? d[0].color
              : colorBox[(i % colorBox.length) - 1];
          })
          .transition(t)
          .style('opacity', config.opacity || 1)
          .attr('fill', (d, i) =>
            config.enableGradient
              ? `url(#gradOffset-${i})`
              : d[0].color
              ? d[0].color
              : colorBox[(i % colorBox.length) - 1]
          )
          .attr('d', (d) => sarea(d, true));
      }

      function mainBaseFunc(elementRef) {
        elementRef
          .selectAll('.line-path')
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
              enter
                .append('path')
                .attr('class', 'line-path')
                .attr('d', (d) => sarea(d, false))
                .call(linePathFun);
            },
            (update) => update.call(linePathFun),
            (exit) => {
              exit
                .transition(t)
                .attr('d', (d) => sarea(d, false))
                .remove();
            }
          );
      }

      selected
        .selectAll('.line-path-group')
        .data((d) => [d])
        .join(
          (enter) => {
            enter
              .append('g')
              .attr('class', 'line-path-group')
              .call(mainBaseFunc);
          },
          (update) => update,
          (exit) => exit.remove()
        )
        .call(mainBaseFunc);

      if (config.enablePointCircle) {
        const lineCircleGrpMain = selected
          .selectAll('.line-circle-grp')
          .data((d, i) => d.flat(Infinity))
          .join(
            (enter) => {
              const lineCircleGrp = enter
                .append('g')
                .attr('class', 'line-circle-grp')
                .attr('transform', (d, i) => {
                  return `translate(${config.xScale(d.label)},${config.yScale(
                    d.value
                  )})`;
                });

              lineCircleGrp.selectAll('.line-circle').remove();
              lineCircleGrp.selectAll('.line-circle-label').remove();

              lineCircleGrp
                .append('circle')
                .attr('class', 'line-circle')
                // .attr("cx", (d) => config.xScale(d.label))
                // .attr("cy", (d) => config.yScale(d.value))
                .attr('r', (d) => {
                  return d.value > 0 ? config.r : 0;
                })
                .style('stroke', (d, i) => {
                  return (
                    d.dashLineColor ||
                    d.color1 ||
                    d.color ||
                    config.pointCircleStroke
                  );
                })
                .style('stroke-width', config.pointCircleStrokeWidth)
                .style('fill', config.pointCircleFill || '#fff');
              // .attr("clip-path", `url(#rectClip-${randId})`);

              if (!config.disableCircleLabel) {
                lineCircleGrp
                  .append('text')
                  .attr('class', 'line-circle-label')
                  .attr('x', config.r * 1.5)
                  .attr('y', (d) => {
                    return (d.labelIndex % 2 === 0 ? -1 : 1) * config.r * 3;
                  })
                  .text((d) => (isNaN(d.value) ? '' : d.value || ''));
              }
            },
            (update) => update,
            (exit) => {
              exit.remove();
            }
          )
          .attr('transform', (d, i) => {
            return `translate(${config.xScale(d.label)},${config.yScale(
              d.value
            )})`;
          });

        lineCircleGrpMain.selectAll('.line-circle').remove();
        lineCircleGrpMain.selectAll('.line-circle-label').remove();

        lineCircleGrpMain
          .append('circle')
          .attr('class', 'line-circle')
          // .attr("cx", (d) => config.xScale(d.label))
          // .attr("cy", (d) => config.yScale(d.value))
          .attr('r', (d) => {
            return d.value > 0 ? config.r : 0;
          })
          .style('stroke', (d, i) => {
            return (
              d.dashLineColor || d.color1 || d.color || config.pointCircleStroke
            );
          })
          .style('stroke-width', config.pointCircleStrokeWidth)
          .style('fill', config.pointCircleFill || '#fff');
        // .attr("clip-path", `url(#rectClip-${randId})`);
        if (!config.disableCircleLabel) {
          lineCircleGrpMain
            .append('text')
            .attr('class', 'line-circle-label')
            .attr('x', config.r * 1.5)
            .attr('y', (d) => {
              return (d.labelIndex % 2 === 0 ? -1 : 1) * config.r * 3;
            })
            .text((d) => (isNaN(d.value) ? '' : d.value || ''));
        }
      }

      selected.transition(t).attr('width', config.width);

      function lineRectBGFunc(elementRef) {
        elementRef
          .attr('fill', 'transparent')
          .attr('x', (d, i) => config.xScale.step() * i)
          .attr('width', (d, i) =>
            data[0].length - 1 === i ? 0 : config.xScale.step()
          )
          .attr('height', config.graphAreaH);
      }

      function bgData(d) {
        return d[0].map((ele, ii) => {
          const newEle = { ...ele };
          for (let iii = 0; iii < d.length; iii++) {
            newEle[d[iii][ii].labelText] = d[iii][ii].value;
            newEle[`${d[iii][ii].labelText}Color`] = d[iii][ii].color;
          }
          return newEle;
        });
      }
      selected
        .selectAll('.line-bg-rect-group')
        .data((d, i) => {
          return bgData(d);
        })
        .join(
          (enter) => {
            enter
              .append('g')
              .attr('class', 'line-bg-rect-group')
              .style('transform', (d) => {
                return `translateX(${config.xScale(d.label)}px)`;
              });
          },
          (update) =>
            update.style('transform', (d) => {
              return `translateX(${config.xScale(d.label)}px)`;
            }),
          (exit) => {
            exit.remove();
          }
        );

      selected
        .selectAll('.line-bg-rect-group')
        .selectAll('.line-bg-rect')
        .data((d, i) => [d])
        .join(
          (enter) => {
            enter
              .append('rect')
              .attr('class', 'line-bg-rect')
              .call(lineRectBGFunc);
          },
          (update) => update.call(lineRectBGFunc),
          (exit) => {
            exit.remove();
          }
        );

      function hoverLineFunc(elementRef) {
        elementRef
          .style('display', 'none')
          // .style("transform", (d) => {
          //   return `translateX(${config.xScale(d.label)}px)`;
          // })
          .attr('stroke', config.hoverLineStroke || '#000')
          .attr('stroke-width', config.hoverLineStrokeWidth || 1)
          .attr('y2', 0)
          .attr('y1', config.graphAreaH);
      }
      selected
        .selectAll('.line-bg-rect-group')
        .selectAll('.hoverLine')
        .data((d, i) => [d])
        .join(
          (enter) => {
            enter.append('line').attr('class', 'hoverLine').call(hoverLineFunc);
          },
          (update) => update.call(hoverLineFunc),
          (exit) => exit.remove()
        );

      function hoverCircleFunc(elementRef) {
        elementRef
          .style('display', 'none')
          .attr('r', config.radius || 3)
          .attr('cy', (d) => {
            return config.yScale(d.value);
          })
          .style('stroke', (d, i) => {
            return (
              d.dashLineColor || d.color1 || d.color || config.pointCircleStroke
            );
          })
          .style('stroke-width', config.pointCircleStrokeWidth || 1)
          .style(
            'fill',
            (d) =>
              d.dashLineColor || d.color1 || d.color || config.pointCircleStroke
          );
      }

      selected
        .selectAll('.line-bg-rect-group')
        .selectAll('.hoverCircle')
        .data((d, i) => {
          const objArr = [];
          let accValue = 0;
          config.labels.forEach((ele) => {
            accValue += d[ele.label];
            objArr.push({
              ...d,
              label: d.label,
              value: accValue,
              color: d[`${ele.label}Color`],
              labelText: ele.label,
            });
          });
          return objArr;
        })
        .join(
          (enter) => {
            enter
              .append('circle')
              .attr('class', 'hoverCircle')
              .call(hoverCircleFunc);
          },
          (update) => update.call(hoverCircleFunc),
          (exit) => exit.remove()
        );

      if (config.rectIndicator) {
        function rectIndicatorFunc(elementRef) {
          elementRef
            .style('fill', config.indicatorColor || '#cccccc80')
            .attr('x', config.xScale.step() * config.selected)
            .attr('width', (d, i) =>
              data[0].length - 1 === config.selected ? 0 : config.xScale.step()
            )
            .attr('y', 0)
            .transition(t)
            .attr('height', config.graphAreaH);
        }
        selected
          .selectAll('.line-rect-indicator-rect')
          .data([data[config.selected || 0]])
          .join(
            (enter) => {
              enter
                .append('rect')
                .attr('class', 'line-rect-indicator-rect')
                .call(rectIndicatorFunc);
            },
            (update) => update,
            (exit) => {
              exit.transition(t).attr('height', 0).attr('width', 0).remove();
            }
          )
          .transition(t)
          .call(rectIndicatorFunc);
      }

      setUpEvents(config, selected, 'line-bg-rect-group');
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
