import * as d3 from 'd3';
import { initialValues } from '../utils/graphConst';
import { setUpEvents } from '../utils/graphEvents';
import geoJSONData from './geoJson.json';
import { countryCoordinates } from './countries';

export const worldMap = function worldMap() {
  let config = {
    ...initialValues,
  };

  const pointsData = [];

  // Draw the graph here
  function graph(selected) {
    selected.each(function (data) {
      // get country code from the data
      const countries = data.map((country) => country.value);

      // find the country coordinated based on the country code
      countries.forEach((countryCode) => {
        const countryData = countryCoordinates.find(
          (item) => item.alpha3 === countryCode
        );
        if (countryData) {
          const { latitude, longitude } = countryData;
          pointsData.push({ lat: latitude, lon: longitude });
        }
      });

      const projection = d3
        .geoEquirectangular()
        .fitSize([config.width, config.height], geoJSONData);

      const pathGenerator = d3.geoPath().projection(projection);

      // defs for repeated pattern
      const defs = selected.append('defs');

      // pattern
      const pattern = defs
        .append('pattern')
        .attr('id', 'dotted-background')
        .attr('width', 6)
        .attr('height', 6)
        .attr('patternUnits', 'userSpaceOnUse');

      // pattern to be plot in a line
      pattern
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 6)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 5)
        .attr('stroke-dasharray', '1,2');

      selected
        .selectAll('path')
        .data(geoJSONData.features)
        .join('path')
        .style('fill', 'url(#dotted-background)')
        .attr('d', (d) => pathGenerator(d));

      function plotPoints(selection) {
        // outer points
        selection
          .selectAll('.outer-point')
          .data(pointsData)
          .enter()
          .append('ellipse')
          .attr('class', 'outer-point')
          .attr('cx', (d) => projection([d.lon, d.lat])[0])
          .attr('cy', (d) => projection([d.lon, d.lat])[1])
          .attr('rx', 5.249)
          .attr('ry', 4.259)
          .attr('opacity', 0.3)
          .style('fill', '#675EF2');

        // inner points
        selection
          .selectAll('.inner-point')
          .data(pointsData)
          .enter()
          .append('ellipse')
          .attr('class', 'inner-point')
          .attr('cx', (d) => projection([d.lon, d.lat])[0])
          .attr('cy', (d) => projection([d.lon, d.lat])[1])
          .attr('rx', 2.44727)
          .attr('ry', 1.98566)
          .style('fill', '#675EF2');
      }
      plotPoints(selected); // Plot points after drawing the graph
    });

    setUpEvents(config, selected, 'world-map');
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
