import * as d3 from 'd3';
import RootGraph from '../utils/rootGraph';
import graphBucket from '../utils/graphBucket';
import { initialValues, colorBox } from '../utils/graphConst';
import { getGraphUtils } from '../utils/graphUtils';
import { extractLeafValues } from './columnUtils';

class CoolColumnGraph extends RootGraph {
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
        const currentItem = JSON.parse(JSON.stringify(this.filteredData[i]));
        this.labels.forEach((ele) => {
          delete currentItem[ele.value];
        });
        const item = {
          ...currentItem,
          label: this.filteredData[i].label,
          value,
          labelText: this.labels[k].label,
          index: i,
          color: this.labels[k].color
            ? this.labels[k].color
            : this.data[i].color
            ? this.data[i].color
            : colorBox[i % colorBox.length],
          rawData: this.filteredData[i],
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
      ...this,
      ...initialValues,
      width: this.width,
      height: this.height,
      xAxisType: 'text',
      ...this.config,
    };

    const { minY, maxY, graphAreaH, graphAreaW, graphAreaL } = getGraphUtils(
      config,
      extractLeafValues(this.graphData)
    );

    const xScale = d3
      .scaleBand()
      .range([0, graphAreaW])
      .domain(
        data.map(function (d, i) {
          return d.label;
        })
      );

    const yScale = d3
      .scaleLinear()
      .range([graphAreaH, config.graphTopPadding])
      .domain([
        minY < 0 ? minY : 0,
        maxY +
          (maxY / 100) *
            (config.graphType === 'timeline' || config.enableFullColumn
              ? 1
              : 25),
      ]);

    config = {
      ...config,
      xScale,
      yScale,
      graphAreaH,
      graphAreaW,
      minY,
      maxY,
    };

    // y-axis
    const yAxis = graphBucket.yAxis().config(config);
    this.$graphGrp.datum([data]).call(yAxis);

    //  rect
    const rects = graphBucket.columnRect3D().config(config);

    const rectGrps = this.$graphGrp.selectAll('.columnRect3DGroup').node()
      ? this.$graphGrp.selectAll('.columnRect3DGroup')
      : this.$graphGrp.append('g');

    rectGrps
      .attr('class', 'columnRect3DGroup')
      .attr('transform', 'translate(' + graphAreaL + ',0)')
      .datum(this.graphData)
      .call(rects);

    // x-axis
    const xAxis = graphBucket.xAxis().config(config);
    this.$graphGrp.datum([data]).call(xAxis);
  }

  onResetFunc() {
    const classSelected = this.$graphGrp.selectAll('.column-rect-3d');
    classSelected.classed('selected', false);
    classSelected.classed('unselected', false);
  }
}

export default CoolColumnGraph;
