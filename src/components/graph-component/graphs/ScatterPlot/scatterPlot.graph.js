import * as d3 from "d3";
import RootGraph from "../utils/rootGraph";
import graphBucket from "../utils/graphBucket";
import { initialValues } from "../utils/graphConst";
import { getGraphUtils } from "../utils/graphUtils";

class ScatterPlotGraph extends RootGraph {
  setData(inData) {
    const data = inData?.data;
    this.data = JSON.parse(JSON.stringify(data));
  }

  setConfig(configObj = {}) {
    this.config = configObj;
  }

  drawGraph() {
    super.drawGraph();

    const data = this.data;
    let config = {
      ...initialValues,
      width: this.width,
      height: this.height,
      xAxisType: "text",
      ...this.config,
    };

    const { minX, maxX, minY, maxY, graphAreaH, graphAreaW, graphAreaL } =
      getGraphUtils(config, data);

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

    // X and Y for line
    const lineX = (d, i) => {
      if (typeof d.label === "string") {
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
      graphAreaH,
      graphAreaW,
      x: lineX,
      y: lineY,
      r: 5,
    };

    //  circles
    const circles = graphBucket.scatterCircle().config(config);
    // d3.select(this.$graphWrp).selectAll(".graphDataSet").remove();

    const circleGrps = this.$graphGrp.selectAll(".scatterCircleGroup").node()
      ? this.$graphGrp.selectAll(".scatterCircleGroup")
      : this.$graphGrp.append("g");

    circleGrps
      .attr("class", "scatterCircleGroup")
      .attr("transform", "translate(" + graphAreaL + ",0)")
      .datum(this.data)
      .call(circles);

    // x-axis
    const xAxis = graphBucket.xAxis().config(config);
    this.$graphGrp.datum([this.data]).call(xAxis);

    // y-axis
    const yAxis = graphBucket.yAxis().config(config);
    this.$graphGrp
      .datum([this.data])
      .call(yAxis)
      .selectAll(".tick text")
      .style("font-size", `${config.tickFontSize}px`);
  }
  onResetFunc() {
    const classSelected = this.$graphGrp.selectAll(".shape");
    classSelected.classed("selected", false);
    classSelected.classed("unselected", false);
  }
}

export default ScatterPlotGraph;
