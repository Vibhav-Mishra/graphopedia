import * as d3 from "d3";

class RootGraph {
  constructor($graphWrp) {
    this.$graphWrp = undefined;
    this.$svg = undefined;
    this.$svgNode = undefined;
    this.$graphGrp = undefined;

    this.width = undefined;
    this.height = undefined;

    this.data = [];

    this.preferences = {};
    this.padding = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    };
    this.margin = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    };

    this.init($graphWrp);
  }

  init($graphWrp) {
    this.$graphWrp = $graphWrp;
    const currentEle = d3.select($graphWrp);
    this.$svg = currentEle.select("svg").node()
      ? currentEle.select("svg")
      : currentEle.append("svg");
    this.$svgNode = this.$svg.node();
    this.$graphGrp = this.$svg.select("g").node()
      ? this.$svg.select("g")
      : this.$svg.append("g");
  }

  setup() {
    const clientHeight =
      this.$svgNode.clientHeight !== 0
        ? this.$svgNode.clientHeight
        : this.$svgNode.getBoundingClientRect().height;

    this.height =
      clientHeight -
      this.margin.top -
      this.margin.bottom -
      this.padding.top -
      this.padding.bottom;

    const clientWidth =
      this.$svgNode.clientWidth !== 0
        ? this.$svgNode.clientWidth
        : this.$svgNode.getBoundingClientRect().width;

    this.width =
      clientWidth -
      this.margin.left -
      this.margin.right -
      this.padding.left -
      this.padding.right;

    if (clientHeight === 0 || clientWidth === 0) {
      /* empty */
    }
  }

  drawGraph(graphType) {
    this.setup();
    this.uniqueId = `${graphType}-graph`;
    this.$svg.attr("id", this.uniqueId);
  }
}

export default RootGraph;
