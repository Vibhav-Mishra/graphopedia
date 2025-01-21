import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { actualOneD } from "../utils/mockData";
import ResizeHandlerHOC from "../utils/resizeHandlerHOC";
import BestBarGraph from "./bestBar.graph";
import { GraphContainer, GraphWrp } from "../../styles/index.sc";

const TableBar = (props) => {
  const refElement = useRef(null);
  const graphRef = useRef(null);

  useEffect(() => {
    let graph = graphRef.current;

    if (props.data) {
      if (!graph) {
        graphRef.current = new BestBarGraph(refElement.current);
        graph = graphRef.current;
      }
      graph.setConfig({ ...props.config });
      graph.setData(props.data || actualOneD);
      graph.drawGraph(props.config.graphType);
    }
  }, [props.config, props.data, props.rerender]);

  useEffect(() => {
    let graph = graphRef.current;

    if (!graph) {
      graphRef.current = new BestBarGraph(refElement.current);
      graph = graphRef.current;
    }
    if (props.resetSelection) {
      graph.onResetFunc();
    }
  }, [props.resetSelection]);

  useEffect(() => {
    let graph = graphRef.current;
    if (!graph) {
      graphRef.current = new BestBarGraph(refElement.current);
      graph = graphRef.current;
    }
    if (props.renderToolTipOnLoad && props.config.activeYLabel) {
      graph.drawGraph(
        props.config.graphType,
        props.renderToolTipOnLoad,
        props.config.activeYLabel
      );
    }
  }, [props.config.activeYLabel]);

  return (
    <GraphContainer className="best-bar graph-container">
      <GraphWrp className="graph-wrp" ref={refElement} />
    </GraphContainer>
  );
};

TableBar.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  rerender: PropTypes.bool,
  resetSelection: PropTypes.bool,
};
export default ResizeHandlerHOC(TableBar);
