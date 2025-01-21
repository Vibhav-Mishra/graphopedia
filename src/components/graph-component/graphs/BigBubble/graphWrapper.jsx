import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { bubbleGraphData } from "../utils/mockData";
import ResizeHandlerHOC from "../utils/resizeHandlerHOC";
import BigBubbleGraph from "./bigBubble.graph";
import { GraphContainerBubble, GraphWrpBubble } from "../../styles/index.sc";

const BigBubble = (props) => {
  const refElement = useRef(null);
  const graphRef = useRef(null);

  useEffect(() => {
    let graph = graphRef.current;
    if (props.data) {
      if (!graph) {
        graphRef.current = new BigBubbleGraph(refElement.current);
        graph = graphRef.current;
      }
      graph.setData(props.data || bubbleGraphData);
      graph.setConfig({
        ...props.config,
        hoverCircle: props.hoverCircle,
        strokeOnHover: props.strokeOnHover,
      });
      graph.drawGraph();
    }
  }, [
    props.data,
    props.config.legendPosition,
    props.config.legend,
    props.config.forceEnable,
    props.rerender,
    props.hoverCircle,
    props.strokeOnHover,
  ]);

  useEffect(() => {
    let graph = graphRef.current;

    if (!graph) {
      graphRef.current = new BigBubbleGraph(refElement.current);
      graph = graphRef.current;
    }
    if (props.resetSelection) {
      graph.onResetFunc();
    }
  }, [props.resetSelection]);

  return (
    <GraphContainerBubble className="big-bubble graph-container">
      <GraphWrpBubble className="graph-wrp" ref={refElement} />
    </GraphContainerBubble>
  );
};

BigBubble.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  rerender: PropTypes.bool,
  resetSelection: PropTypes.bool,
  hoverCircle: PropTypes.bool,
  strokeOnHover: PropTypes.bool,
};

export default ResizeHandlerHOC(BigBubble);
