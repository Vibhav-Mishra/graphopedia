import RootGraph from "../utils/rootGraph";
import graphBucket from "../utils/graphBucket";
import { initialValues, colorBox } from "../utils/graphConst";
import { getGraphUtils } from "../utils/graphUtils";
import { bubbleCircleForce } from "./bubbleCircleForce";

class BigBubbleGraph extends RootGraph {
  setData(data) {
    const inData = JSON.parse(JSON.stringify(data));
    this.labels = inData?.labels
      ? inData?.labels
      : [{ label: "label", value: "value" }];
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
    // const data = this.graphData[0];
    let config = {
      ...initialValues,
      width: this.width,
      height: this.height,
      xAxisType: "text",
      graphType: "group",
      forceEnable: true,
      ...this.config,
    };

    const { graphAreaH, graphAreaW, graphAreaL } = getGraphUtils(
      config,
      this.graphData.flat(Infinity)
    );

    config = {
      ...config,
      graphAreaH,
      graphAreaW,
      graphAreaL,
    };

    let circles;
    if (config.forceEnable) {
      //  rect
      circles = bubbleCircleForce().config(config);
    } else {
      //  rect
      // circles = graphBucket.bubbleCircle().config(config)
      circles = bubbleCircleForce().config(config);
    }

    const circleGrps = this.$graphGrp.selectAll(".bubbleCircleGroup").node()
      ? this.$graphGrp.selectAll(".bubbleCircleGroup")
      : this.$graphGrp.append("g");

    circleGrps
      .attr("class", "bubbleCircleGroup")
      .attr("transform", "translate(" + graphAreaL + ",0)")
      .datum(this.graphData)
      .call(circles);
  }
}

export default BigBubbleGraph;
