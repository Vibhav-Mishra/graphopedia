import * as d3 from 'd3';
import ColorParser from '../utils/colorParser';
import { colorBox, initialValues } from '../utils/graphConst';
import { setUpEvents } from '../utils/graphEvents';

export const radialCirclePath = function radialCirclePath() {
  let config = {
    ...initialValues,
    arcWidth: 20,
    fontSize: 5,
    arcPathBg: '#ababab',
    labelColor: '#000',
    subLabelColor: '#000',
    centerBG: 'none',
    centerStroke: '#000',
    disableCenterSummary: false,
    breakBoint: 20,
    opacityChanger: 1.25,
    arcDividerStrokeColor: '#fff',
    arcDividerStrokeWidth: 1,
    arcOpacity: 0.7,
    bgDividerColor: '#aaa',
    bgDividerWidth: 1,
    ringsPadding: 2,
    easing: d3.easeLinear,
  };

  // draw the graph here
  function graph(selected) {
    selected.each(function (inData) {
      const data = inData[0].map((ele) => ({
        ...ele,
        endAngle: config.endAngle,
      }));

      const t = d3.transition().duration(config.duration).ease(config.easing);
      let clearArea =
        config.width < config.height ? config.width : config.height;

      clearArea = clearArea / 2;

      const circleArea = clearArea * 0.25;

      const bgPie = d3
        .pie()
        .value((d) => d.value)
        .sort(null);

      const bgArc = d3
        .arc()
        .innerRadius((d, i) => {
          return circleArea + config.breakBoint * d.data.ringIndex;
        })
        .outerRadius((d, i) => {
          const finalOuterR =
            circleArea +
            (config.breakBoint * (d.data.ringIndex + 1) - config.ringsPadding);
          return finalOuterR;
        });
      // .startAngle(0)
      // .endAngle(2 * Math.PI);

      const radialPoints = [];
      for (let i = 0; i < 100 / config.breakBoint; i++) {
        radialPoints[i] = [];
        const configLabelsLength = config.labels.length;
        const configLabels0Value =
          configLabelsLength > 1 ? config.labels[0].value : data.length;
        radialPoints[i] = data.map((element) => {
          if (configLabelsLength > 1) {
            return element[configLabels0Value];
          } else {
            return (2 * Math.PI) / data.length;
          }
        });

        // radialPoints.push(
        //   i === 0 ? config.breakBoint : radialPoints[i - 1] + config.breakBoint
        // );
      }

      selected
        .selectAll('.radial-circle-bg-path-grp')
        .data(radialPoints)
        .join(
          (enter) => {
            enter.append('g').attr('class', 'radial-circle-bg-path-grp');
          },
          (update) => update,
          (exit) => {
            exit.remove();
          }
        );

      selected
        .selectAll('.radial-circle-bg-path-grp')
        .selectAll('.radial-circle-bg-path')
        .data((d, i) => {
          const tempArr = d.map((ele, j) => {
            const tempObj = {};
            tempObj.value = ele;
            tempObj.index = j;
            tempObj.ringIndex = i;
            return tempObj;
          });
          return bgPie(tempArr);
        })
        .join(
          (enter) => {
            enter
              .append('path')
              .attr('class', 'radial-circle-bg-path')
              .datum((d) => d)
              .style('fill', config.arcPathBg)
              .style('opacity', (d, i) => {
                return (
                  1 -
                  ((d.data.ringIndex * config.breakBoint) /
                    config.opacityChanger) *
                    0.01
                );
              })
              .style('stroke', config.bgDividerColor)
              .style('stroke-width', config.bgDividerWidth)
              .attr('d', bgArc);
          },
          (update) => update,
          (exit) => {
            exit.remove();
          }
        );
      function centerGrp(elementRef) {
        elementRef.selectAll('*').remove();
        elementRef
          .append('circle')
          .attr('class', 'circle-path-center-circle')
          .attr('r', (d) => {
            return circleArea;
          })
          .attr('fill', config.centerBG)
          .attr('stroke', config.centerStroke)
          .attr(
            'stroke-width',
            config.centerStrokeWidth || config.arcWidth * 0.03
          );

        elementRef
          .append('text')
          .attr('class', 'circle-path-center-label')
          .style('text-anchor', 'middle')
          .style('font-weight', 'bold')
          .style('fill', config.labelColor)
          .style('font-size', `${clearArea * 0.15}px`)
          .style('transform', (d, i) => {
            return `translate(0px, ${-1 * clearArea * 0.03}px)`;
          })
          .text((d) => d.label);

        elementRef
          .append('text')
          .attr('class', 'circle-path-center-sub-label')
          .style('text-anchor', 'middle')
          .style('font-size', `${clearArea * 0.1}px`)
          .style('fill', config.subLabelColor)
          .style('transform', (d, i) => {
            return `translate(0px, ${clearArea * 0.13}px)`;
          })
          .text((d) => d.subLabel);
      }
      if (config.summary) {
        selected
          .selectAll('.circle-path-center-grp')
          .data([config.summary])
          .join(
            (enter) => {
              enter
                .append('g')
                .attr('class', 'circle-path-center-grp')
                .call(centerGrp);
            },
            (update) => update,
            (exit) => {
              exit.remove();
            }
          )
          .call(centerGrp);
      }

      const createPie = d3
        .pie()
        .value((d) => (config.labels.length > 1 ? d.value : 1))
        .sort(null);

      const arc = d3
        .arc()
        .innerRadius(circleArea)
        .outerRadius((d, i) => {
          const availableArea = radialPoints.length * config.breakBoint;
          return (
            circleArea +
            (availableArea / 100) *
              d.data[config.labels[config.labels.length > 1 ? 1 : 0].value]
          );
        });

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
          const dcopy = JSON.parse(JSON.stringify(d));
          dcopy.data[config.labels[config.labels.length > 1 ? 1 : 0].value] = 0;
          const interpolate = d3.interpolate(
            {
              ...this._current,
              data: { ...dcopy.data },
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

      selected
        .selectAll('.radial-pie-path')
        .data(createPie(data))
        .join(
          (enter) => {
            enter
              .append('path')
              .attr('class', 'radial-pie-path')
              .transition(t)
              .attrTween('d', arcTween1())
              .attr('stroke', config.arcDividerStrokeColor)
              .attr('fill', (d, i) => {
                return d.data.color || ColorParser(colorBox[i]);
              })
              .attr('stroke-width', config.arcDividerStrokeWidth)
              .style('opacity', config.arcOpacity);
          },
          (update) => update,
          (exit) => {
            exit.remove();
          }
        )
        .transition(t)
        .attr('stroke', config.arcDividerStrokeColor)
        .attr('fill', (d, i) => {
          return d.data.color || ColorParser(colorBox[i]);
        })
        .attr('stroke-width', config.arcDividerStrokeWidth)
        .style('opacity', config.arcOpacity)
        .attrTween('d', arcTween());

      setUpEvents(config, selected, 'radial-pie-path');
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
