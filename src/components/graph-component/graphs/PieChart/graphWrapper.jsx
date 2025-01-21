import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { actualOneD } from "../utils/mockData";
import ResizeHandlerHOC from "../utils/resizeHandlerHOC";
import PurePieGraph from "./purePie.graph";
import { GraphContainer, GraphWrp } from "../../styles/index.sc";

const PieGraph = (props) => {
  const { height, width } = props.config;
  const refElement = useRef(null);
  const graphRef = useRef(null);

  useEffect(() => {
    let graph = graphRef.current;
    if (props.data) {
      if (!graph) {
        graphRef.current = new PurePieGraph(refElement.current);
        graph = graphRef.current;
      }
      graph.setData(props.data || actualOneD);
      graph.setConfig({ ...props.config });
      graph.drawGraph();
    }
  }, [props.data, props.config, props.rerender]);

  useEffect(() => {
    let graph = graphRef.current;

    if (!graph) {
      graphRef.current = new PurePieGraph(refElement.current);
      graph = graphRef.current;
    }
    if (props.resetSelection) {
      graph.onResetFunc();
    }
  }, [props.resetSelection]);
  return (
    <GraphContainer
      className="pie-circle graph-container"
      graphType={props.config.graphType}
    >
      <GraphWrp
        id="pie-container"
        className="graph-wrp"
        ref={refElement}
        height={height}
        width={width}
      />
    </GraphContainer>
  );
};

PieGraph.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  rerender: PropTypes.bool,
  resetSelection: PropTypes.bool,
};

export default ResizeHandlerHOC(PieGraph);
