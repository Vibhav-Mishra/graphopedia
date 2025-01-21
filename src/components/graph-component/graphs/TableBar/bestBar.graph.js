import * as d3 from "d3";
import RootGraph from "../utils/rootGraph";
import graphBucket from "../utils/graphBucket";
import { initialValues, colorBox } from "../utils/graphConst";
import { getGraphUtils } from "../utils/graphUtils";
import { getAccArr } from "../CoolColumn/columnUtils";

class BestBarGraph extends RootGraph {
  setData(data) {
    const inData = JSON.parse(JSON.stringify(data));
    this.labels = inData?.labels
      ? inData?.labels
      : [{ label: "label", value: "value" }];

    // this.data = inData?.data;
    const mainData = JSON.parse(JSON.stringify(inData?.data));
    const dataLength = mainData.length || 15;
    this.data = mainData.filter(
      (ele, i) => i < (this.config.maxData || dataLength)
    );

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
          color: this.labels[k].color
            ? this.labels[k].color
            : this.data[i].color
            ? this.data[i].color
            : colorBox[(this.labels.length > 1 ? k : i) % colorBox.length],
          rawData: this.filteredData[i],
          // color: this.data[i].color ? this.data[i].color : colorBox[k],
        };
        if (this.config.graphType === "stack") {
          item.positiveAcc =
            (formattedData[k - 1] && formattedData[k - 1][i]?.positiveAcc
              ? formattedData[k - 1][i]?.positiveAcc
              : 0) + (parseInt(value) > 0 ? parseInt(value) : 0);
          item.negativeAcc =
            (formattedData[k - 1] && formattedData[k - 1][i]?.negativeAcc
              ? -formattedData[k - 1][i]?.negativeAcc
              : 0) + (parseInt(value) < 0 ? Math.abs(parseInt(value)) : 0);
          item.negativeAcc = -item.negativeAcc; // Add negative sign to negativeAcc
        }
        items.push(item);
      }
      formattedData.push(items);
    }
    this.graphData = formattedData;
  }

  setConfig(configObj = {}) {
    this.config = configObj;
  }

  drawGraph(graphType, renderToolTipOnLoad, activeLabel) {
    super.drawGraph(graphType);
    const data = this.graphData[0];
    let config = {
      ...initialValues,
      width: this.width,
      height: this.height,
      xAxisType: "text",
      graphType: "group1",

      ...this.config,
    };

    const { minY, maxY, graphAreaH, graphAreaW, graphAreaL } = getGraphUtils(
      config,
      config.graphType === "group"
        ? this.graphData.flat(Infinity)
        : getAccArr(this.graphData)
    );

    const xScale = d3
      .scaleLinear()
      .range([graphAreaW, 0])
      .domain([maxY + (maxY / 100) * 25, minY < 0 ? minY : 0]);

    const xScaleN = d3
      .scaleLinear()
      .range([graphAreaW, 0])
      .domain([maxY + (maxY / 100) * 25, minY < 0 ? minY : 0]);

    const yScale = d3
      .scaleBand()
      .range([config.graphTopPadding, graphAreaH])
      .domain(
        data.map(function (d, i) {
          return d.label;
        })
      );

    config = {
      ...config,
      xScaleN,
      xScale,
      yScale,
      graphAreaH,
      graphAreaW,
      minY,
      maxY,
    };

    // x-axis
    const xAxis = graphBucket.xAxis().config(config);
    this.$graphGrp.datum([data]).call(xAxis);

    // y-axis
    const yAxis = graphBucket.yAxis().config(config);
    this.$graphGrp.datum([data]).call(yAxis);

    //  rect
    const rects = graphBucket.barRect().config(config);

    const rectGrps = this.$graphGrp.selectAll(".barRectGroup").node()
      ? this.$graphGrp.selectAll(".barRectGroup")
      : this.$graphGrp.append("g");

    rectGrps
      .attr("class", "barRectGroup")
      .attr("transform", "translate(" + graphAreaL + ",0)")
      .datum(this.graphData)
      .call(rects);

    if (renderToolTipOnLoad) {
      this.getInitialTooltipData(renderToolTipOnLoad, activeLabel, config);
    }
  }

  onResetFunc() {
    const classSelected = this.$graphGrp.selectAll(".column-rect");
    classSelected.classed("selected", false);
    classSelected.classed("unselected", false);
  }

  getInitialTooltipData(renderToolTipOnLoad, activeLabel, config) {
    let d = this.graphData;
    const labelValues = {};
    const positiveAccValues = {};
    const negativeAccValues = {};
    return d[0].map((ele, ii) => {
      const newEle = { ...ele };

      for (let iii = 0; iii < d.length; iii++) {
        const { positiveAcc, negativeAcc, labelText, value, color, rawData } =
          d[iii][ii];
        newEle[labelText] = value;
        newEle[`${labelText}Color`] = color;
        newEle[`label`] = rawData.label;

        // Update the maximum value for the label
        const currentLabel = rawData.label;
        if (!labelValues[currentLabel] || value > labelValues[currentLabel]) {
          labelValues[currentLabel] = value;
        }
        // Update the maximum positive acceleration value
        if (
          !positiveAccValues[currentLabel] ||
          positiveAcc > positiveAccValues[currentLabel]
        ) {
          positiveAccValues[currentLabel] = positiveAcc;
        }

        // Update the minimum negative acceleration value
        if (
          !negativeAccValues[currentLabel] ||
          negativeAcc < negativeAccValues[currentLabel]
        ) {
          negativeAccValues[currentLabel] = negativeAcc;
        }
        // Set the maxPositiveAcc key with the maximum positive acceleration value for the label
        newEle["maxPositiveAcc"] = positiveAccValues[newEle.label];

        // Set the minNegativeAcc key with the minimum negative acceleration value for the label
        newEle["minNegativeAcc"] = negativeAccValues[newEle.label];
      }
      // Set the maxValue key with the maximum value for the label
      newEle["maxValue"] = labelValues[newEle.label];

      if (newEle.rawData.label === activeLabel) {
        renderToolTipOnLoad(newEle, config);
      }
    });
  }
}

export default BestBarGraph;
