import * as d3 from 'd3';
import RootGraph from '../utils/rootGraph';
import { initialValues, colorBox } from '../utils/graphConst';
import { nestedTreeData1 } from './mockData';

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

    //  rect
    // var paths = graphBucket.nestedTreePath().config(config);

    const pathGrps = this.$graphGrp.selectAll('.treePathGroup').node()
      ? this.$graphGrp.selectAll('.treePathGroup')
      : this.$graphGrp.append('g');
    // this.$graphWrp
    const treemap = (data) => {
      return d3
        .treemap()
        .size([config.width, config.height])
        .paddingOuter(3)
        .paddingTop(19)
        .paddingInner(1)
        .round(true)(
        d3
          .hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value)
      );
    };

    const root = treemap(nestedTreeData1);
    const format = d3.format(',d');
    const color = d3.scaleSequential([8, 0], d3.interpolateMagma);

    const node = pathGrps
      .selectAll('g')
      .data(d3.group(root, (d) => d.height))
      .join('g')
      .attr('class', 'filter-wrp')
      .selectAll('g')
      .data((d) => d[1])
      .join('g')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`);

    node.append('title').text(
      (d) =>
        `${d
          .ancestors()
          .reverse()
          .map((d) => d.data.name)
          .join('/')}\n${format(d.value)}`
    );

    node
      .append('rect')
      .attr('id', (d) => (d.nodeUid = `node-${Math.random()}`))
      .attr('fill', (d) => color(d.height))
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0);
    node
      .append('clipPath')
      .attr('id', (d) => (d.clipUid = `clip-${Math.random()}`));
    // .append("use")
    // .attr(
    //   "xlink:href",
    //   (d) => `url(${document.location.pathname}#${d.nodeUid})`
    // );

    node
      .append('text')
      .attr('clip-path', (d) => `url(#${d.clipUid})`)
      .style('display', (d) => {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        return w > 50 && h > 40 ? 'block' : 'none';
      })
      .selectAll('tspan')
      .data((d) =>
        d.data.name.split(/(?=[A-Z][^A-Z])/g).concat(format(d.value))
      )
      .join('tspan')
      .attr('fill-opacity', (d, i, nodes) =>
        i === nodes.length - 1 ? 0.7 : null
      )
      .text((d) => d);

    node
      .filter((d) => d.children)
      .selectAll('tspan')
      .attr('dx', 3)
      .attr('y', 13);

    node
      .filter((d) => !d.children)
      .selectAll('tspan')
      .attr('x', 3)
      .attr(
        'y',
        (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
      );
  }
}

export default NestedTreeGraph;
