import * as d3 from 'd3';
// import ColorParser from '../utils/colorParser';
import { initialValues } from '../utils/graphConst'; // colorBox,
import { setUpEvents } from '../utils/graphEvents';

export const radialPie = function radialPie() {
  let config = {
    ...initialValues,
    innerRadius: 0,
    arcLabelFontsize: '10px',
    minLabelValue: 30,
  };

  // draw the graph here
  function graph(selected) {
    selected.each(function (data) {
      const value = 100 / data.length;

      const modifiedData = data.map((item) => {
        return { ...item, size: value };
      });

      const formattedData = d3.pie().value((d) => d.size)(modifiedData);

      const maxValue = d3.max(formattedData, function (d) {
        return d.data.value;
      });

      const radiusScale = d3
        .scaleLinear()
        .domain([0, maxValue < 100 ? 100 : maxValue])
        .range([0, 100]);

      const arcGenerator = d3
        .arc()
        .innerRadius(config.innerRadius)
        .outerRadius((d) => radiusScale(d.data.value));

      function pathLabelTransform() {
        return function (d) {
          return `translate(${arcGenerator.centroid(d)})`;
        };
      }

      function arcTween1() {
        return function (d) {
          // console.log(d);
          const interpolate = d3.interpolate(
            {
              ...this._current,
              startAngle: Math.PI * 2,
              endAngle: Math.PI * 2,
              data: { ...this._current, value: 0 },
            },
            d
          );

          const _this = this;
          return function (t) {
            _this._current = interpolate(t);
            return arcGenerator(_this._current);
          };
        };
      }

      function arcTween() {
        return function (d) {
          const interpolate = d3.interpolate({ ...this._current }, d);
          const _this = this;
          return function (t) {
            _this._current = interpolate(t);
            return arcGenerator(_this._current);
          };
        };
      }

      function arcRemoveTween() {
        return function (d) {
          const interpolate = d3.interpolate(d, {
            ...this._current,
            startAngle: 2 * Math.PI,
            endAngle: 2 * Math.PI,
            data: { ...this._current, value: 0 },
          });
          const _this = this;
          return function (t) {
            _this._current = interpolate(t);
            return arcGenerator(_this._current);
          };
        };
      }

      selected
        .selectAll('.radial-pie-path-grp')
        .data(formattedData)
        .join(
          (enter) => {
            enter
              .append('path')
              .attr('class', 'radial-pie-path-grp')
              .attr('d', arcGenerator) // d element draws the path in a svg
              .style('fill', (d) => d.data.color)
              .style('opacity', 0.7)
              .style('stroke', '#fff')
              .style('stroke-width', '4')
              .transition()
              .duration(config.duration) // config.duration
              .attrTween('d', arcTween1());
          },
          (update) => {
            update
              .attr('d', arcGenerator) // d element draws the path in a svg
              .style('fill', (d) => d.data.color)
              .transition()
              .duration(config.duration)
              .attrTween('d', arcTween());
          },
          (exit) =>
            exit
              .transition()
              .duration(config.duration)
              .attrTween('d', arcRemoveTween())
              .remove()
        );

      // setup annotation
      // label-text
      if (config.arcLabel === true) {
        const textGroup = selected
          .selectAll('.radial-pie-label-text-group')
          .data(data)
          .join(
            (enter) => {
              enter.append('g').attr('class', 'radial-pie-label-text-group');
            },
            (update) => update,
            (exit) => exit.remove()
          );

        textGroup
          .selectAll('.radial-pie-label-text')
          .data(formattedData)
          .join(
            (enter) => {
              enter
                .append('text')
                .attr('class', 'radial-pie-label-text')
                .text((d) =>
                  d.data.value >= config.minLabelValue ? d.data.label : ''
                )
                .transition()
                .duration(config.duration)
                .attr('transform', pathLabelTransform())
                .style('text-anchor', 'middle')
                .style('font-size', config.arcLabelFontsize);
            },
            (update) => {
              update
                .text((d) =>
                  d.data.value >= config.minLabelValue ? d.data.label : ''
                )
                .attr('transform', pathLabelTransform());
            },
            (exit) => exit.remove()
          );

        // value - text;
        textGroup
          .selectAll('.radial-pie-value-text')
          .data(formattedData)
          .join(
            (enter) => {
              enter
                .append('text')
                .attr('class', 'radial-pie-value-text')
                .text((d) =>
                  d.data.value >= config.minLabelValue ? d.data.value + '%' : ''
                )
                .transition()
                .duration(config.duration)
                .attr('transform', pathLabelTransform())
                .style('text-anchor', 'middle')
                .attr('dy', '10px') // The same text with a shift along the y-axis
                .style('font-weight', 'bold')
                .style('font-size', config.arcLabelFontsize);
            },
            (update) => {
              update
                .text((d) =>
                  d.data.value >= config.minLabelValue ? d.data.value + '%' : ''
                )
                .attr('transform', pathLabelTransform());
            },
            (exit) => exit.remove()
          );
      }

      setUpEvents(config, selected, 'pie-path');
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
