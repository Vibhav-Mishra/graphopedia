import * as d3 from "d3";
import RootGraph from "../utils/rootGraph";
// import graphBucket from '../utils/graphBucket'
import { initialValues } from "../utils/graphConst";
// import { getGraphUtils } from '../utils/graphUtils'

class PieChartGraph extends RootGraph {
  setData(data) {
    this.data = JSON.parse(JSON.stringify(data));
  }

  setPrevData(data) {
    this.prevData = JSON.parse(JSON.stringify(data));
  }

  drawGraph() {
    super.drawGraph();
    const data = this.data;

    const config = {
      ...initialValues,
      width: this.width,
      height: this.height,
      xAxisType: "text",
    };

    // const { minX, maxX, minY, maxY, graphAreaH, graphAreaW, graphAreaL } =
    //   getGraphUtils(config, data)

    // var width = 500
    // var height = 500
    const innerRadius = 0;
    const outerRadius = 150;

    this.$svg
      .selectAll("g")
      .attr(
        "transform",
        `translate(${config.width / 2}, ${config.height / 2})`
      );

    const createPie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);
    const createArc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);
    // const colors = d3.scaleOrdinal(d3.schemeCategory10)
    const format = d3.format(".2f");

    const graphData = createPie(data);
    const prevData = createPie(this.prevData);
    const group = this.$graphGrp;
    const groupWithData = group.selectAll("g.path").data(graphData);

    this.$graphGrp.selectAll("*").remove();

    const groupWithUpdate = groupWithData.enter().append("g");

    const path = groupWithUpdate
      .append("path")
      .merge(groupWithData.select("path.arc"));

    const angleInterpolation = d3.interpolate(
      createPie.startAngle()(),
      createPie.endAngle()()
    );

    const arcTween = (d, i) => {
      if (prevData.length === 0) {
        const originalEnd = d.endAngle;
        return (t) => {
          const currentAngle = angleInterpolation(t);
          if (currentAngle < d.startAngle) {
            return "";
          }

          d.endAngle = Math.min(currentAngle, originalEnd);

          return createArc(d);
        };
      } else {
        const interpolator = d3.interpolate(prevData[i], d);

        return (t) => createArc(interpolator(t));
      }
    };

    path
      .attr("class", "arc")
      .attr("fill", (d, i) => d[i].color)
      .transition()
      .duration(2000)
      .attrTween("d", arcTween);

    const text = groupWithUpdate
      .append("text")
      .merge(groupWithData.select("text"));

    text
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("fill", "white")
      .style("font-size", 10)
      .transition()
      .attr("transform", (d) => `translate(${createArc.centroid(d)})`)
      .tween("text", (d, i, nodes) => {
        const interpolator = d3.interpolate(prevData[i], d);

        return (t) => d3.select(nodes[i]).text(format(interpolator(t).value));
      });
  }
}

export default PieChartGraph;
