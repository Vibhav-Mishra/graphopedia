import * as d3 from 'd3';
import RootGraph from '../../utils/rootGraph';
import graphBucket from '../../utils/graphBucket';
import { initialValues, colorBox } from '../../utils/graphConst';
import { getGraphUtils } from '../../utils/graphUtils';
import { getAccArr } from '../../CoolColumn/columnUtils';

class XAxisGraph extends RootGraph {
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
          color: this.data[i].color ? this.data[i].color : colorBox[k],
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

    const { minX, maxX, minY, maxY, graphAreaH, graphAreaW } = getGraphUtils(
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

    // x-axis
    const xAxis = graphBucket.xAxis().config(config);
    this.$graphGrp.datum([data]).call(xAxis);
  }
}

export default XAxisGraph;
