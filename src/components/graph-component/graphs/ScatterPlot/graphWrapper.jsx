import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { GraphContainer, GraphWrp } from "../../styles/index.sc";
import { actualOneD } from "../utils/mockData";
import ResizeHandlerHOC from "../utils/resizeHandlerHOC";

import ScatterPlotGraph from "./scatterPlot.graph";

const ScatterPlot = (props) => {
  const refElement = useRef(null);
  const graphRef = useRef(null);

  useEffect(() => {
    let graph = graphRef.current;

    if (props.data) {
      if (!graph) {
        graphRef.current = new ScatterPlotGraph(refElement.current);
        graph = graphRef.current;
      }
      graph.setData(props.data || actualOneD);
      graph.setConfig({
        ...props.config,
        tickFontSize: props.tickFontSize,
        highlight: props.highlight,
        shape: props.shape,
        strokeOnHover: props.strokeOnHover,
        hoverCircle: props.hoverCircle,
        transformOnHover: props.transformOnHover,
      });
      graph.drawGraph();
    }
  }, [
    props.data,
    props.config,
    props.rerender,
    props.legendPosition,
    props.tickFontSize,
    props.highlight,
    props.shape,
    props.strokeOnHover,
    props.hoverCircle,
    props.transformOnHover,
  ]);

  useEffect(() => {
    let graph = graphRef.current;

    if (!graph) {
      graphRef.current = new ScatterPlotGraph(refElement.current);
      graph = graphRef.current;
    }
    if (props.resetSelection) {
      graph.onResetFunc();
    }
  }, [props.resetSelection]);

  return (
    <GraphContainer className="scatter-plot graph-container">
      <GraphWrp className="graph-wrp" ref={refElement}></GraphWrp>
    </GraphContainer>
  );
};

ScatterPlot.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  rerender: PropTypes.bool,
  resetSelection: PropTypes.bool,
  highlight: PropTypes.bool,
  shape: PropTypes.string,
};

export default ResizeHandlerHOC(ScatterPlot);
