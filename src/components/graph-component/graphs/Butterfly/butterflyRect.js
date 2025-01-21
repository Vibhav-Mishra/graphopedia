import * as d3 from 'd3';
import { initialValues } from '../utils/graphConst';
import { setUpEvents } from '../utils/graphEvents';

export const butterflyRect = function butterflyRect() {
  let config = {
    ...initialValues,
    fontSize: 5,
    easing: d3.easeLinear,
    duration: 1000,
  };

  // draw the graph here
  function graph(selected) {
    selected.each(function (data) {
      console.log(data, 'butterfly');

      selected.attr('transform', 'translate(100,100)');

      const butterflyRectGrp = selected
        .selectAll('.butterfly-group')
        .data(data)
        .join(
          (enter) => {
            enter.append('g').attr('class', 'butterfly-group');
          },
          (update) => update,
          (exit) => {
            exit.remove();
          }
        );

      function butterflyRectDraw(eleRef) {
        eleRef
          .attr('x', (d) => {
            return d.index === 0 ? -10 : 10;
          })
          .attr('y', (d) => {
            return (d.labelIndex + 1) * 15;
          })
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', (d) => d.color);
      }

      butterflyRectGrp
        .selectAll('.butterfly-rect')
        .data((d) => [...d])
        .join(
          (enter) => {
            enter
              .append('rect')
              .attr('class', 'butterfly-rect')
              .call(butterflyRectDraw);
          },
          (update) => update.call(butterflyRectDraw),
          (exit) => {
            exit.remove();
          }
        );

      setUpEvents(config, selected, 'radarArea');
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
