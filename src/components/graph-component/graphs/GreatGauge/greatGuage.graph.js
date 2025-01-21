import RootGraph from '../utils/rootGraph';
import graphBucket from '../utils/graphBucket';
import { initialValues, colorBox } from '../utils/graphConst';

class GreatGuageGraph extends RootGraph {
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
          label: this.filteredData[i].label,
          value: parseInt(value),
          accValue:
            (formattedData[k - 1] && formattedData[k - 1][i]?.accValue
              ? formattedData[k - 1][i]?.accValue
              : 0) + parseInt(value),
          labelText: this.labels[k].label,
          index: i,
          arrRadiusValue:
            (items[items.length - 1]?.arrRadiusValue || 0) +
            (this.filteredData[i - 1]?.arcRadius || 1),
          color: this.labels[k].color
            ? this.labels[k].color
            : this.data[i].color
            ? this.data[i].color
            : colorBox[i % colorBox.length],
          ...this.filteredData[i],
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
    // const data = this.graphData[0];
    const config = {
      ...initialValues,
      width: this.width,
      height: this.height,
      xAxisType: 'text',
      summary: this.summary,
      ...this.config,
    };
    // console.log("this.graphData", this.graphData);
    //  Gauge
    const gauge = graphBucket.circlePath().config(config);
    const gaugeGrps = this.$graphGrp.selectAll('.circlePathGroup').node()
      ? this.$graphGrp.selectAll('.circlePathGroup')
      : this.$graphGrp.append('g');

    gaugeGrps
      .attr('class', 'circlePathGroup')
      .attr('transform', `translate(${config.width / 2},${config.height / 2})`)
      .datum(this.graphData)
      .call(gauge);
  }
}

export default GreatGuageGraph;
