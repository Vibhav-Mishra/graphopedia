import graphBucket from '../utils/graphBucket';
import { initialValues } from '../utils/graphConst';
import RootGraph from '../utils/rootGraph';

class WorldMapGraph extends RootGraph {
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

    // generates the graph
    const WorldMap = graphBucket.worldMap().config(config);

    // creates the g attribute
    const WorldMapGraph = this.$graphGrp.selectAll('.WorldMapGroup').node()
      ? this.$graphGrp.selectAll('.WorldMapGroup')
      : this.$graphGrp.append('g');

    WorldMapGraph.attr('class', 'WorldMapGroup')
      // .attr('transform', `translate(${config.width / 2},${config.height / 2})`)
      .datum(this.graphData)
      .call(WorldMap);
  }
}

export default WorldMapGraph;
