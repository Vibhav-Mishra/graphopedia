import RootGraph from '../utils/rootGraph';
import graphBucket from '../utils/graphBucket';
import { initialValues, colorBox } from '../utils/graphConst';

class RadialRingsGraph extends RootGraph {
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
          label: `${this.filteredData[i].label}%`,
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
            : colorBox[(this.labels.length > 1 ? k : i) % colorBox.length],
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
    const config = {
      ...initialValues,
      width: this.width,
      height: this.height,
      xAxisType: 'text',
      summary: this.summary,
      labels: this.labels,
      ...this.config,
    };

    //  Radial
    const radial = graphBucket.radialCirclePath().config(config);
    const radialGrps = this.$graphGrp.selectAll('.radialCirclePathGroup').node()
      ? this.$graphGrp.selectAll('.radialCirclePathGroup')
      : this.$graphGrp.append('g');

    radialGrps
      .attr('class', 'radialCirclePathGroup')
      .attr('transform', `translate(${config.width / 2},${config.height / 2})`)
      .datum(this.graphData)
      .call(radial);
  }

  onResetFunc() {
    const classSelected = this.$graphGrp.selectAll('.radial-rings');
    classSelected.classed('selected', false);
    classSelected.classed('unselected', false);
  }
}

export default RadialRingsGraph;
