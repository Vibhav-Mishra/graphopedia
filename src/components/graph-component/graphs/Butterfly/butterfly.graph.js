import * as d3 from 'd3';
import RootGraph from '../utils/rootGraph';
import graphBucket from '../utils/graphBucket';
import { initialValues } from '../utils/graphConst';
import { getGraphUtils } from '../utils/graphUtils';
import { getAccArr } from '../CoolColumn/columnUtils';

class ButterflyGraph extends RootGraph {
  setData(data) {
    const inData = JSON.parse(JSON.stringify(data));
    this.labels = inData?.labels
      ? inData?.labels
      : [{ label: 'label', value: 'value' }];
    this.data = inData.data;
    this.summary = inData.summary;

    this.filteredData = this.data;
    const formattedData = [];

    for (let i = 0; i < this.filteredData.length; i++) {
      const items = [];
      for (let j = 0; j < this.labels.length; j++) {
        const value = this.filteredData[i][this.labels[j].value];
        const item = {
          data: this.filteredData[i],
          color: this.filteredData[i].color || this.labels[j].color,
          index: j,
          labelIndex: i,
          labelText: this.filteredData[i].label,
          label: this.labels[j].label,
          value,
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
    let config = {
      ...initialValues,
      width: this.width,
      height: this.height,
      xAxisType: 'text',
      summary: this.summary,
      labels: this.labels,
      ...this.config,
    };

    const { minX, maxX, minY, maxY, graphAreaH, graphAreaW, graphAreaL } =
      getGraphUtils(
        config,
        config.graphType === 'group'
          ? this.graphData.flat(Infinity)
          : getAccArr(this.graphData)
      );

    const xScale = d3
      .scaleLinear()
      .range([graphAreaW, 0])
      .domain([maxY + (maxY / 100) * 25, minY < 0 ? minY : 0]);

    const xScaleN = d3
      .scaleLinear()
      .range([0, graphAreaW])
      .domain([minX < 0 ? minX : 0, maxX + (maxX / 100) * 10]);

    const yScale = d3
      .scaleBand()
      .range([config.graphTopPadding, graphAreaH])
      .domain(
        this.graphData.map(function (d, i) {
          return d.label;
        })
      );

    config = {
      ...config,
      xScaleN,
      xScale,
      yScale,
      graphAreaH,
      graphAreaW,
      graphAreaL,
      minY,
      maxY,
    };

    //  Butterfly
    const Butterfly = graphBucket.butterflyRect().config(config);
    const ButterflyGrps = this.$graphGrp.selectAll('.ButterflyRectGroup').node()
      ? this.$graphGrp.selectAll('.ButterflyRectGroup')
      : this.$graphGrp.append('g');

    ButterflyGrps.attr('class', 'ButterflyRectGroup')
      .attr('transform', `translate(${config.width / 2},${config.height / 2})`)
      .datum(this.graphData)
      .call(Butterfly);
  }
}

export default ButterflyGraph;
