import * as d3 from 'd3';
import RootGraph from '../utils/rootGraph';
import { initialValues, colorBox } from '../utils/graphConst';
import { mockData } from './mockDataGeo';

class NestedTreeGraph extends RootGraph {
  setData(data) {
    const inData = JSON.parse(JSON.stringify(data));
    this.labels = inData?.labels
      ? inData?.labels
      : [{ label: 'label', value: 'value' }];
    this.data = inData.data;

    this.filteredData = this.data;
    const formattedData = [];
    // process data object with multiple values
    for (let k = 0; k < this.labels.length; k++) {
      const items = [];
      for (let i = 0; i < this.filteredData.length; i++) {
        const value = this.filteredData[i][this.labels[k].value];
        const item = {
          label: this.filteredData[i].label,
          value: parseInt(value),
          accValue:
            (formattedData[k - 1] && formattedData[k - 1][i]?.accValue
              ? formattedData[k - 1][i]?.accValue
              : 0) + parseInt(value),
          labelText: this.labels[k].label,
          index: i,
          color: this.labels[k].color
            ? this.labels[k].color
            : this.data[i].color
            ? this.data[i].color
            : colorBox[k % colorBox.length],
        };
        items.push(item);
      }
      formattedData.push(items);
    }
    this.graphData = formattedData;
  }

  setConfig(configObj = {}) {
    this.config = configObj;
  }

  drawGraph() {
    super.drawGraph();
    const config = {
      ...initialValues,
      width: this.width,
      height: this.height,
      ...this.config,
    };

    // const format = d3
    //   .formatLocale({
    //     decimal: '.',
    //     thousands: ',',
    //     grouping: [3],
    //     currency: ['£', ''],
    //   })
    //   .format('$,d');

    const nest = Array.from(d3.group(mockData, (d) => d.region)).map((d) => {
      const pairs = Array.from(d3.group(d[1], (d) => d.country)).map((d) => {
        const pairs1 = Array.from(d3.group(d[1], (d) => d.city)).map((d) => {
          const total = d3.sum(d[1], function (d) {
            return d.value;
          });
          return {
            key: d[0],
            value: total,
          };
        });
        return {
          key: d[0],
          values: pairs1,
        };
      });
      return {
        key: d[0],
        values: pairs,
      };
    });

    const treemap = d3
      .treemap()
      .size([config.width, config.height])
      .padding(1)
      .round(true);

    const root = d3
      .hierarchy({ values: nest }, function (d) {
        return d.values;
      })
      .sum(function (d) {
        return d.value;
      });
    // .sort(function (a, b) {
    //   return b.value - a.value;
    // });

    treemap(root);
    console.log(root.leaves());
    d3.select(this.$graphWrp).selectAll('svg').remove();

    const graphWrp = d3.select(this.$graphWrp);
    const spacing = 20;
    const regionWrp = graphWrp
      .selectAll('.regions-wrp')
      .data([root.ancestors()])
      .enter()
      .append('div')
      .attr('class', 'regions-wrp');

    const regions = regionWrp
      .selectAll('.regions')
      .data((d) => {
        return d[0].children;
      })
      .enter()
      .append('div')
      .attr('class', 'regions')
      .style('background-color', 'green')
      .style('left', function (d) {
        return d.x0 + 'px';
      })
      .style('top', function (d) {
        return d.y0 + 'px';
      })
      .style('width', function (d) {
        return d.x1 - d.x0 + 'px';
      })
      .style('height', function (d) {
        return d.y1 - d.y0 + 'px';
      });

    regions
      .append('div')
      .attr('class', 'regions-label')
      .text(function (d) {
        return d.data.key;
      });

    const countries = regions
      .selectAll('.countries')
      .data((d) => {
        return d.children;
      })
      .enter()
      .append('div')
      .attr('class', 'countries')
      .style('background-color', 'yellow')
      .style('left', function (d) {
        return (
          (d.x0 > d.depth ? d.x0 - d?.parent?.x0 - d.parent.depth || 0 : 0) +
          'px'
        );
      })
      .style('top', function (d) {
        return (
          (d.y0 > d.depth ? d.y0 - d?.parent?.y0 - d.parent.depth || 0 : 0) +
          (d.y0 - d?.parent?.y0 > d.depth ? 0 : 1) * spacing +
          'px'
        );
      })
      .style('width', function (d) {
        return d.x1 - d.x0 - d.parent.depth + 'px';
      })
      .style('height', function (d) {
        return (
          d.y1 -
          d.y0 -
          -d.parent.depth -
          (d.y0 - d?.parent?.y0 > d.depth ? 0 : 1) * spacing +
          'px'
        );
      });

    countries
      .append('div')
      .attr('class', 'countries-label')
      .text(function (d) {
        return d.data.key;
      });

    countries
      .selectAll('.citys')
      .data((d) => {
        return d.children;
      })
      .enter()
      .append('div')
      .attr('class', 'citys')
      .style('background-color', 'orange')
      .style('left', function (d) {
        return (
          (d.x0 > d.depth ? d.x0 - d?.parent?.x0 - d.parent.depth || 0 : 0) +
          'px'
        );
      })
      .style('top', function (d) {
        return (
          (d.y0 > d.depth ? d.y0 - d?.parent?.y0 - d.parent.depth || 0 : 0) +
          (d.y0 - d?.parent?.y0 > d.depth ? 0 : 1) * spacing +
          'px'
        );
      })
      .style('width', function (d) {
        return d.x1 - d.x0 + d.parent.depth + 'px';
      })
      .style('height', function (d) {
        return (
          d.y1 -
          d.y0 +
          d.parent.depth -
          spacing *
            (d.y1 - d.y0 === d.parent.y1 - d.parent.y0 - d.parent.depth
              ? 2
              : 1) +
          'px'
        );
      });

    // var node = d3
    //   .select(this.$graphWrp)
    //   .append("div")
    //   .attr("class", "region-wrp")
    //   .selectAll(".node")
    //   .data(root.leaves())
    //   .enter()
    //   .append("div")
    //   .attr("class", "node")
    //   .style("background-color", "red")
    //   .style("left", function (d) {
    //     return d.x0 + "px";
    //   })
    //   .style("top", function (d) {
    //     return d.y0 + "px";
    //   })
    //   .style("width", function (d) {
    //     return d.x1 - d.x0 + "px";
    //   })
    //   .style("height", function (d) {
    //     return d.y1 - d.y0 + "px";
    //   });

    // node
    //   .append("div")
    //   .attr("class", "node-label")
    //   .text(function (d) {
    //     return (
    //       d.parent.parent.data.key +
    //       " to " +
    //       d.parent.data.key +
    //       "\n" +
    //       d.data.key
    //     );
    //   });

    // node
    //   .append("div")
    //   .attr("class", "node-value")
    //   .text(function (d) {
    //     return format(d.value);
    //   });

    // this.$graphWrp
  }
}

export default NestedTreeGraph;
