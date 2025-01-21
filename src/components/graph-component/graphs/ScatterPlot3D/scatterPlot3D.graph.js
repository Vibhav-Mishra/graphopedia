import * as d3 from 'd3';
import RootGraph from '../utils/rootGraph';
import graphBucket from '../utils/graphBucket';
import { colorBox, initialValues } from '../utils/graphConst';
import { getGraphUtils, getMinMax } from '../utils/graphUtils';

class ScatterPlot3DGraph extends RootGraph {
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
          ...this.filteredData[i],
          rawdata: this.filteredData[i],
          label: this.filteredData[i].label,
          value,
          accValue:
            (formattedData[k - 1] && formattedData[k - 1][i]?.accValue
              ? formattedData[k - 1][i]?.accValue
              : 0) + parseFloat(value),
          labelText: this.labels[k].label,
          index: i,
          labelIndex: k,
          color:
            this.data[i]?.color ||
            colorBox[(this.labels.length > 1 ? k : i) % colorBox.length],
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

    const data = this.graphData;
    let config = {
      ...initialValues,
      width: this.width,
      height: this.height,
      xAxisType: 'text',
      ...this.config,
    };

    const { graphAreaH, graphAreaW, graphAreaL } = getGraphUtils(config, data);

    const { max: maxX, min: minX } = getMinMax(data[0]);
    const { max: maxY, min: minY } = getMinMax(data[1]);

    const xScale = d3
      .scaleBand()
      .range([0, graphAreaW])
      .domain(
        data.map(function (d, i) {
          return d.label;
        })
      );

    const xScaleN = d3
      .scaleLinear()
      .range([0, graphAreaW])
      .domain([minX < 0 ? minX : 0, maxX + (maxX / 100) * 10]);

    const yScale = d3
      .scaleLinear()
      .range([graphAreaH, config.graphTopPadding])
      .domain([minY < 0 ? minY : 0, maxY + (maxY / 100) * 25]);

    // const rScale = d3
    //   .scaleLinear()
    //   .range([d3.min([graphAreaH, graphAreaW]), 0])
    //   .domain([minR / 2, (maxR - maxR * 0.25) / 2]);

    const rScale = d3
      .scaleLinear()
      .range([d3.min([graphAreaH, graphAreaW]) / 3, 0])
      .domain([1, 0]);

    // X and Y for line
    const lineX = (d, i) => {
      if (typeof d.label === 'string') {
        return xScale(d.label) + xScale.bandwidth() / 2;
      } else {
        return xScaleN(d.label);
      }
    };

    const lineY = (d, i) => {
      return yScale(d.value);
    };

    config = {
      ...config,
      xScaleN,
      xScale,
      yScale,
      rScale,
      graphAreaH,
      graphAreaW,
      x: lineX,
      y: lineY,
      r: 5,
    };

    // x-axis
    const xAxis = graphBucket.xAxis().config(config);
    this.$graphGrp.datum([this.data]).call(xAxis);

    // y-axis
    const yAxis = graphBucket.yAxis().config(config);
    this.$graphGrp.datum([this.data]).call(yAxis);

    //  circles
    const circles = graphBucket.scatterCircle3D().config(config);
    // d3.select(this.$graphWrp).selectAll(".graphDataSet").remove();

    const circleGrps = this.$graphGrp.selectAll('.scatterCircleGroup').node()
      ? this.$graphGrp.selectAll('.scatterCircleGroup')
      : this.$graphGrp.append('g');

    circleGrps
      .attr('class', 'scatterCircleGroup')
      .attr('transform', 'translate(' + graphAreaL + ',0)')
      .datum(data[0])
      .call(circles);
  }

  onResetFunc() {
    const classSelected = this.$graphGrp.selectAll('.scatter-circle-3d');
    classSelected.classed('selected', false);
    classSelected.classed('unselected', false);
  }
}

export default ScatterPlot3DGraph;
