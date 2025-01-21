import * as d3 from 'd3';
import RootGraph from '../utils/rootGraph';
import graphBucket from '../utils/graphBucket';
import { initialValues, colorBox } from '../utils/graphConst';
import { getGraphUtils } from '../utils/graphUtils';

class HotHeatMapGraph extends RootGraph {
  setData(data) {
    const inData = JSON.parse(JSON.stringify(data));
    this.labels = inData?.labels
      ? inData?.labels
      : [{ label: 'label', value: 'value' }];
    this.data = inData.data;
    this.labels = inData.labels;

    this.filteredData = this.data;
    const formattedData = [];
    // process data object with multiple values

    for (let k = 0; k < this.labels.length; k++) {
      const items = [];
      for (let i = 0; i < this.filteredData.length; i++) {
        const value = this.filteredData[i][this.labels[k].value];
        const item = {
          label: this.filteredData[i].label,
          displayLabels:
            value.split(' ').length > 0 ? value.split(' ')[1] : '-',
          displayLabel:
            this.filteredData[i][`${this.labels[k].value}DisplayLabel`] || '',
          value: parseInt(value.split(' ')[0]),
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
            : colorBox[i % colorBox.length],
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
    const data = this.graphData[0];
    let config = {
      ...initialValues,
      width: this.width,
      height: this.height,
      xAxisType: 'text',
      graphType: 'group1',
      ...this.config,
    };

    const { minX, maxX, minY, maxY, graphAreaH, graphAreaW, graphAreaL } =
      getGraphUtils(config, this.graphData.flat(Infinity));

    const xScale = d3
      .scaleBand()
      .range([0, graphAreaW])
      .domain(
        this.labels.map(function (d, i) {
          return d.label;
        })
      );

    const xScaleN = d3
      .scaleLinear()
      .range([0, graphAreaW])
      .domain([minX < 0 ? minX : 0, maxX + (maxX / 100) * 10]);

    const yScale = d3
      .scaleBand()
      .range([config.graphTopPadding, graphAreaH])
      .domain(
        data.map(function (d, i) {
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
      minY,
      maxY,
    };
    const xWidth = config.xScale.bandwidth();
    const yWidth = config.yScale.bandwidth();

    config = {
      ...config,
      xWidth,
      yWidth,
    };

    console.log('xWidth', xWidth, yWidth);
    // x-axis
    const xAxis = graphBucket.xAxis().config(config);
    this.$graphGrp.datum([this.labels]).call(xAxis);

    // y-axis
    const yAxis = graphBucket.yAxis().config(config);
    this.$graphGrp.datum([data]).call(yAxis);

    //  rect
    const rects = graphBucket.heatRect().config(config);

    const rectGrps = this.$graphGrp.selectAll('.heatRectGroup').node()
      ? this.$graphGrp.selectAll('.heatRectGroup')
      : this.$graphGrp.append('g');

    rectGrps
      .attr('class', 'heatRectGroup')
      .attr('transform', 'translate(' + graphAreaL + ',0)')
      .datum(this.graphData)
      .call(rects);
  }
}

export default HotHeatMapGraph;
