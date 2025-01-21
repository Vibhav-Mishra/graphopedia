import * as d3 from 'd3';
import { colorBox, initialValues } from '../utils/graphConst';
import { setUpEvents } from '../utils/graphEvents';

export const scatterCircle3D = function scatterCircle3D() {
  let config = {
    ...initialValues,
  };

  // draw the graph here
  function graph(selected) {
    selected.each(function (data) {
      // const circleGrps = selected.selectAll("circle").data(data);
      // circleGrps.exit().remove();

      // circleGrps
      //   .enter()
      //   .append("circle")
      //   .merge(circleGrps)
      //   .attr("cx", config.x)
      //   .attr("cy", config.graphAreaH)
      //   .attr("r", config.r)
      //   .style("fill", function (d) {
      //     return d.color ? ColorParser(d.color) : "#000";
      //   })
      //   .transition()
      //   .delay(function (d, i) {
      //     return i * 3;
      //   })
      //   .duration(config.duration)
      //   .attr("cy", config.y);

      const t = d3
        .transition()
        .delay(function (d, i) {
          return i * 3;
        })
        .duration(config.duration);

      function scatterCircle3Ds(elementRef) {
        elementRef
          .attr('cx', (d) => config.xScaleN(d.xValue))
          .attr('r', (d) => {
            return config.rScale(d.radius);
          })
          .style('fill', (d, i) => d.color || colorBox[i]);
        // .attr('stroke', (d, i) => d.color || colorBox[i])
        // .attr('stroke-width', '0.4rem')
        // .attr('stroke-opacity', '0.5');
      }

      selected
        .selectAll('.scatter-circle-3d')
        .data(data)
        .join(
          (enter) => {
            enter
              .append('circle')
              .attr('class', 'scatter-circle-3d')
              .attr('cy', 0)
              .call(scatterCircle3Ds)
              .transition(t)
              .attr('cy', (d) => config.yScale(d.yValue));
          },
          (update) => update,
          (exit) => {
            exit.transition(t).attr('r', 0);
          }
        ) // combine the enter and exit method .join(enter=>enter.append('circle',update=>update,exit=>{}))
        .transition(t)
        .call(scatterCircle3Ds)
        .attr('cy', (d) => config.yScale(d.yValue));

      setUpEvents(config, selected, 'scatter-circle-3d');
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
