import * as d3 from 'd3';
import { colorBox, initialValues } from '../utils/graphConst';
import { setUpEvents } from '../utils/graphEvents';
import { formatNumber } from '../utils/graphGrid';
import { calculateMaxCharacters } from '../utils/graphUtils';

export const columnRect3D = function columnRect3D() {
  let config = {
    ...initialValues,
    yTotalLabelSpace: 10,
    yTotalLabelFS: 10,
    yTotalSubLabelFS: 10,
    groupgutterSpace: 2,
    enableTopLabels: false,
    enableRectLabels: false,
    yRectLabelColor: '#000',
    columnBG: '#eee',
    grayLineHeight: 100,
    labelheight: 50,
    grayLineYposition: 0,
    thresholdColor: 'blue',
    thresholdWidth: 6,
    colors: ['blue', 'green', 'yellow'],
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
        .selectAll('.bar-group')
        .data(data)
        .join(
          (enter) => {
            enter.append('g').attr('class', 'bar-group');
          },
          (update) => update,
          (exit) => {
            exit.remove();
          }
        );

      selected
        .selectAll('.bar-group')
        .selectAll('.bar-group-l1')
        .data((d, i) => {
          return d.map((ele, i) => ({
            ...ele,
            index: i,
            rawData: data,
            parentData: data,
          }));
        })
        .join(
          (enter) => {
            enter
              .append('g')
              .attr('class', 'bar-group-l1')
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
        .selectAll('.bar-group-l1')
        .selectAll('.bar-group-l2')
        .data((d, i) => {
          return d.value.map((ele, i) => ({
            ...ele,
            index: i,
            rawData: data,
            parentData: d,
          }));
        })
        .join(
          (enter) => {
            enter
              .append('g')
              .attr('class', 'bar-group-l2')
              .style('transform', (d, i) => {
                return `translateX(${
                  i * (xWidth / d.parentData.value.length)
                }px)`;
              });
          },
          (update) =>
            update.style('transform', (d, i) => {
              return `translateX(${
                i * (xWidth / d.parentData.value.length)
              }px)`;
            }),
          (exit) => {
            exit.remove();
          }
        );

      const columnRect3DFunc = function (eleRef) {
        eleRef
          .attr('data-gi', (d) => d.labelIndex)
          .style('fill', (d, i) => {
            return colorBox[d.parentData.index % colorBox.length];
          })
          .style('opacity', (d, i) => {
            // const opacityVal = 1 / d.parentData.value.length;
            // return (i + 1) * opacityVal;
            return 1 / (i + 1);
          })
          .attr(
            'width',
            (d) => xWidth / d.parentData.parentData.value.length - 2
          );
      };

      const columnRect3DHeightFunc = function (eleRef) {
        eleRef
          .attr('y', (d, i) => {
            return config.yScale(d.accValue);
          })
          .attr('height', (d, i) => {
            const barHeight =
              config.yScale(0) - config.yScale(parseFloat(d.value));
            return barHeight < 0 ? -1 * barHeight : barHeight;
          });
      };

      selected
        .selectAll('.bar-group-l2')
        .selectAll('.column-rect-3d')
        .data((d) => {
          let accValue = 0;
          return d.value.map((ele, i) => {
            accValue += ele.value;
            return {
              ...ele,
              accValue,
              l3Index: i,
              rawData: data,
              parentData: d,
            };
          });
        })
        .join(
          (enter) => {
            enter
              .append('rect')
              .attr('class', 'column-rect-3d')
              .call(columnRect3DFunc)
              .attr('y', config.height - (config.height - config.graphAreaH))
              .transition(t)
              .call(columnRect3DHeightFunc);
          },
          (update) =>
            update
              .transition(t)
              .call(columnRect3DHeightFunc)
              .call(columnRect3DFunc),
          (exit) => {
            exit.transition(t).attr('height', 0).attr('width', 0).remove();
          }
        );

      if (config.enableRectLabels) {
        const columnRect3DLabelFunc = function (eleRef) {
          eleRef
            .attr(
              'dx',
              (d) => (xWidth / d.parentData.parentData.value.length - 2) / 2
            )
            .attr('dy', (d) => {
              const yPos = config.yScale(d.accValue);
              const barHeight =
                config.yScale(0) - config.yScale(parseFloat(d.value));
              return yPos + (config.fontSize / 2 || 6) + barHeight / 2;
            })
            .text((d) => {
              const yPos = config.yScale(d.accValue);
              const barHeight =
                config.yScale(0) - config.yScale(parseFloat(d.value));
              if (barHeight < (config.fontSize || 12) * 1.15) {
                return '';
              }
              const finalPos =
                yPos +
                barHeight -
                (yPos + (config.fontSize / 2 || 6) + barHeight / 2);
              const rectWidth =
                xWidth / d.parentData.parentData.value.length - 2;
              const maxCharacters = calculateMaxCharacters(
                rectWidth,
                config.fontSize || 12
              );

              const labelToDisplay = `${d.label} ${formatNumber(d.value)}`;

              if (labelToDisplay.length > maxCharacters) {
                return (
                  labelToDisplay.substr(0, maxCharacters - 3) +
                  (maxCharacters - 3 < 1 ? '' : '..')
                );
              }

              return finalPos > (config.fontSize / 2 || 6)
                ? labelToDisplay
                : '';
            });
        };
        selected
          .selectAll('.bar-group-l2')
          .selectAll('.column-rect-3d-label')
          .data((d) => {
            let accValue = 0;
            return d.value.map((ele, i) => {
              accValue += ele.value;
              return {
                ...ele,
                accValue,
                l3Index: i,
                rawData: data,
                parentData: d,
              };
            });
          })
          .join(
            (enter) => {
              enter
                .append('text')
                .attr('class', 'column-rect-3d-label')
                .style('text-anchor', 'middle')
                .call(columnRect3DLabelFunc);
            },
            (update) => update.call(columnRect3DLabelFunc),
            (exit) => {
              exit.remove();
            }
          );
      }

      setUpEvents(config, selected, 'column-rect-3d');
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
