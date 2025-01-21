import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { actualOneD } from "../utils/mockData";
import ResizeHandlerHOC from "../utils/resizeHandlerHOC";
import LinearLineGraph from "./linearLine.graph";
import { GraphContainer, GraphWrp } from "../../styles/index.sc";

const LinearLine = (props) => {
  const refElement = useRef(null);
  const graphRef = useRef(null);

  useEffect(() => {
    let graph = graphRef.current;

    if (props.data) {
      if (!graph) {
        graphRef.current = new LinearLineGraph(refElement.current);
        graph = graphRef.current;
      }
      graph.setData(props.data || actualOneD);
      graph.setConfig({ ...props.config });
      graph.drawGraph(props.config.graphType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, props.config, props.rerender]);

  useEffect(() => {
    let graph = graphRef.current;

    if (!graph) {
      graphRef.current = new LinearLineGraph(refElement.current);
      graph = graphRef.current;
    }
    if (props.resetSelection) {
      graph.onResetFunc();
    }
  }, [props.resetSelection, props.data]);

  useEffect(() => {
    let graph = graphRef.current;
    if (!graph) {
      graphRef.current = new LinearLineGraph(refElement.current);
      graph = graphRef.current;
    }
    if (props.renderToolTipOnLoad) {
      graph.drawGraph(
        props.config.graphType,
        props.renderToolTipOnLoad,
        props.config.activeXLabel
      );
    }
  }, [props.config.activeXLabel, props.data]);

  return (
    <GraphContainer className="linear-line graph-container">
      <GraphWrp
        className="graph-wrp"
        ref={refElement}
        showRect={props.showBackGroundRect}
      />
    </GraphContainer>
  );
};
LinearLine.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  rerender: PropTypes.bool,
  resetSelection: PropTypes.bool,
};
export default ResizeHandlerHOC(LinearLine);
