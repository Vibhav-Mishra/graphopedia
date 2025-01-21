import * as d3 from 'd3';
import RootGraph from '../utils/rootGraph';
import graphBucket from '../utils/graphBucket';
import { initialValues, colorBox } from '../utils/graphConst';
import { getGraphUtils } from '../utils/graphUtils';
import { getAccArr } from '../CoolColumn/columnUtils';

class StackedLineGraph extends RootGraph {
  setData(data) {
    const inData = JSON.parse(JSON.stringify(data));
    this.labels = inData?.labels
      ? inData?.labels
      : [{ label: 'label', value: 'value' }];
    this.data = inData.data;
    this.summary = inData.summary;

    this.filteredData = this.data;
    const formattedData = [];
    // process data object with multiple values
    for (let k = 0; k < this.labels.length; k++) {
      const items = [];
      for (let i = 0; i < this.filteredData.length; i++) {
        const value = this.filteredData[i][this.labels[k].value];
        const item = {
          ...this.labels[k],
          label: this.filteredData[i].label,
          value: parseFloat(value),
          accValue:
            (formattedData[k - 1] && formattedData[k - 1][i]?.accValue
              ? formattedData[k - 1][i]?.accValue
              : 0) + parseFloat(value),
          labelText: this.labels[k].label,
          index: i,
          labelIndex: k,
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

    // console.log("this.graphData", this.graphData);
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
      summary: this.summary,
      labels: this.labels,
      ...this.config,
      padding: { ...initialValues.padding, ...this.config.padding },
    };

    const { minX, maxX, minY, maxY, graphAreaH, graphAreaW, graphAreaL } =
      getGraphUtils(config, getAccArr(this.graphData));

    const xScale = d3
      .scalePoint()
      .range([0, graphAreaW * 0.95])
      .domain(
        data.map(function (d, i) {
          return d.label;
        })
      );

    const xScaleN = d3
      .scaleLinear()
      .range([0, graphAreaW * 0.95])
      .domain([minX < 0 ? minX : 0, maxX + (maxX / 100) * 10]);

    const yScale = d3
      .scaleLinear()
      .range([graphAreaH, config.graphTopPadding])
      .domain([
        minY < 0 ? minY : 0,
        config.yDomain || maxY + maxY * (config.yDomainMultiplayer || 0.25),
      ]);

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

    // x-axis
    const xAxis = graphBucket.xAxis().config(config);
    this.$graphGrp.datum([data]).call(xAxis);

    // y-axis
    const yAxis = graphBucket.yAxis().config(config);
    this.$graphGrp.datum([data]).call(yAxis);

    //  Lines
    const lines = graphBucket.stackedLinePath().config(config);
    const lineGrps = this.$graphGrp.selectAll('.linePathGroup').node()
      ? this.$graphGrp.selectAll('.linePathGroup')
      : this.$graphGrp.append('g');

    lineGrps
      .attr('class', 'linePathGroup')
      .attr('transform', 'translate(' + graphAreaL + ',0)')
      .datum(this.graphData)
      .call(lines);
  }

  onResetFunc() {
    const classSelected = this.$graphGrp.selectAll('.line-bg-rect-group');
    classSelected.classed('selected', false);
    classSelected.classed('unselected', false);
  }
}
export default StackedLineGraph;
