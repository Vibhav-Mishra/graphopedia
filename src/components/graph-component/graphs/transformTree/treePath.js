import * as d3 from 'd3';
import ColorParser from '../utils/colorParser';
import { colorBox, initialValues } from '../utils/graphConst';
import { setUpEvents } from '../utils/graphEvents';

export const treePath = function treePath() {
  let config = {
    ...initialValues,
    hideLabel: false,
    labelColor: '#000',
  };

  // draw the graph here
  function graph(selected) {
    selected.each(function (data) {
      const t = d3.transition().duration(config.duration);

      const treemap = d3
        .treemap()
        .tile(d3.treemapResquarify)
        .size([config.width, config.height])
        .round(true)
        .paddingInner(1);

      const dataSet = { label: 'root', children: [] };
      data.forEach((element, i) => {
        dataSet.children.push({
          label: element[0].labelText,
          labelIndex: i,
          children: element,
        });
      });

      function sumBySize(d) {
        return d.value;
      }

      const root = d3
        .hierarchy(dataSet)
        .eachBefore(function (d) {
          d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.label;
        })
        .sum(sumBySize);
      // .sort(function (a, b) {
      //   return b.height - a.height || b.value - a.value;
      // });

      treemap(root);

      const mainRoot = selected
        .selectAll('.tree-path-grp')
        .data(root.leaves())
        .join(
          (enter) => {
            const rectGrp = enter.append('g').attr('class', 'tree-path-grp');
            rectGrp
              .transition(t)

              .attr('transform', function (d) {
                return 'translate(' + d.x0 + ',' + d.y0 + ')';
              });

            rectGrp
              .append('rect')
              .transition(t)
              .attr('class', 'tree-path')
              .attr('fill', function (d) {
                return (
                  d.data.color ||
                  ColorParser(colorBox[d.parent.data.labelIndex])
                );
              })
              .attr('width', function (d) {
                return d.x1 - d.x0;
              })
              .attr('height', function (d) {
                return d.y1 - d.y0;
              });
            if (config.hideLabel) {
              rectGrp
                .append('text')
                .attr('clip-path', function (d) {
                  return 'url(#clip-' + d.data.id + ')';
                })
                .attr('x', 4)
                .attr('y', function (d, i) {
                  return 13;
                })
                .text(function (d) {
                  return d.data.label;
                })
                .style('fill', config.labelColor)
                .style('font-size', function (d) {
                  const cn = d3.select(this);
                  // const textWidth = TextLength.getWidth(
                  //   d.data.label,
                  //   config.fontSize,
                  //   "Inter"
                  // );
                  const textWidth = cn.node().getComputedTextLength();
                  const clearArea =
                    d.x1 - d.x0 < d.y1 - d.y0 ? d.x1 - d.x0 : d.y1 - d.y0;
                  return `${
                    config.fontSize < clearArea && textWidth < d.x1 - d.x0 - 10
                      ? config.fontSize
                      : 0
                  }px`;
                });
            }
          },
          (update) => update,
          (exit) => {
            exit
              .select('rect')
              .transition(t)
              .attr('width', 0)
              .attr('height', 0)
              .remove();
            exit.selectAll('text').remove();
          }
        )
        .transition(t)
        .attr('transform', function (d) {
          return 'translate(' + d.x0 + ',' + d.y0 + ')';
        });

      mainRoot
        .select('rect')
        .attr('fill', function (d) {
          return (
            d.data.color || ColorParser(colorBox[d.parent.data.labelIndex])
          );
        })
        .attr('width', function (d) {
          return d.x1 - d.x0;
        })
        .attr('height', function (d) {
          return d.y1 - d.y0;
        });
      if (config.hideLabel) {
        mainRoot
          .select('text')
          .attr('clip-path', function (d) {
            return 'url(#clip-' + d.data.id + ')';
          })
          .attr('x', 4)
          .attr('y', function (d, i) {
            return 13;
          })
          .text(function (d) {
            return d.data.label;
          })
          .style('fill', config.labelColor)
          .style('font-size', function (d) {
            const cn = d3.select(this);
            const textWidth = cn.node().getComputedTextLength();
            const clearArea =
              d.x1 - d.x0 < d.y1 - d.y0 ? d.x1 - d.x0 : d.y1 - d.y0;
            return `${
              config.fontSize < clearArea && textWidth < d.x1 - d.x0 - 10
                ? config.fontSize
                : 0
            }px`;
          });
      }
      setUpEvents(config, selected, 'tree-path-grp');
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
