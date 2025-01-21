import graphBucket from "../utils/graphBucket";
import { initialValues } from "../utils/graphConst";
import RootGraph from "../utils/rootGraph";

// import { initialValues } from '../utils/graphConst';

class WordCloudGraph extends RootGraph {
  setData(data) {
    const inData = JSON.parse(JSON.stringify(data));
    this.labels = inData?.labels
      ? inData?.labels
      : [{ label: "label", value: "value" }];
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

    //  WordCloud
    const WordCloud = graphBucket.wordCloud().config(config);
    const WordCloudGrps = this.$graphGrp
      .attr("transform", `translate(${config.width / 2},${config.height / 2})`)

      .selectAll(".WordCloudGroup")
      .node()
      ? this.$graphGrp.selectAll(".WordCloudGroup")
      : this.$graphGrp.append("g");

    WordCloudGrps.attr("class", "WordCloudGroup")

      .datum(this.graphData)
      .call(WordCloud);
  }

  onResetFunc() {
    const classSelected = this.$graphGrp.selectAll(".word-cloud-text");
    classSelected.classed("selected", false);
    classSelected.classed("unselected", false);
  }
}

export default WordCloudGraph;
