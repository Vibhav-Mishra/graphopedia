import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { GraphContainer, GraphWrp } from "../../Styles/index.sc";
import { actualOneD } from "../utils/mockData";
import ResizeHandlerHOC from "../utils/resizeHandlerHOC";
import CoolColumnGraph from "./coolColumn.graph";

const CoolColumn = (props) => {
  const refElement = useRef(null);
  const graphRef = useRef(null);
  useEffect(() => {
    let graph = graphRef.current;
    if (props.data) {
      if (!graph) {
        graphRef.current = new CoolColumnGraph(refElement.current);
        graph = graphRef.current;
      }
      graph.setConfig({ ...props.config });
      graph.setData(props.data || actualOneD, props.config.graphType);
      graph.drawGraph(props.config.graphType);
    }
  }, [props.config, props.data]);

  useEffect(() => {
    let graph = graphRef.current;

    if (!graph) {
      graphRef.current = new CoolColumnGraph(refElement.current);
      graph = graphRef.current;
    }
    if (props.resetSelection) {
      graph.onResetFunc();
    }
  }, [props.resetSelection]);

  useEffect(() => {
    let graph = graphRef.current;
    if (!graph) {
      graphRef.current = new CoolColumnGraph(refElement.current);
      graph = graphRef.current;
    }
    if (props.renderToolTipOnLoad) {
      graph.drawGraph(props.config.graphType,props.renderToolTipOnLoad, props.config.activeXLabel);
    }
  }, [props.config.activeXLabel]);

  return (
    <GraphContainer className="cool-column graph-container">
      <GraphWrp className="graph-wrp" ref={refElement} />
    </GraphContainer>
  );
};

CoolColumn.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  rerender: PropTypes.bool,
  resetSelection: PropTypes.bool,
};

export default ResizeHandlerHOC(CoolColumn);
