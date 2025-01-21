import graphBucket from '../utils/graphBucket';
import { initialValues } from '../utils/graphConst';
import RootGraph from '../utils/rootGraph';

class RadialPieGraph extends RootGraph {
  setData(data) {
    const inData = JSON.parse(JSON.stringify(data));
    this.labels = inData?.labels
      ? inData?.labels
      : [{ label: 'label', value: 'value' }];
    this.data = inData.data;
    this.summary = inData.summary;

    this.filteredData = this.data;
    const arr = data.data;
    this.graphData = Object.values(
      arr.reduce((acc, cur) => Object.assign(acc, { [cur.label]: cur }), {})
    );
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
      summary: this.summary,
      labels: this.labels,
      ...this.config,
    };

    //  Radial Pie
    // generates the graph
    const RadialPie = graphBucket.radialPie().config(config);

    // creates the g attribute
    const RadialPieGraph = this.$graphGrp.selectAll('.RadialPieGroup').node()
      ? this.$graphGrp.selectAll('.RadialPieGroup')
      : this.$graphGrp.append('g');

    RadialPieGraph.attr('class', 'RadialPieGroup')
      .attr('transform', `translate(${config.width / 2},${config.height / 2})`)
      .datum(this.graphData)
      .call(RadialPie);
  }

  onResetFunc() {
    const classSelected = this.$graphGrp.selectAll('.radial-pie-chart');
    classSelected.classed('selected', false);
    classSelected.classed('unselected', false);
  }
}

export default RadialPieGraph;
