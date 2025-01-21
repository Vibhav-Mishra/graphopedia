import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { GraphContainer, GraphWrp } from "../../styles/index.sc";
import { actualOneD } from "../utils/mockData";
import ResizeHandlerHOC from "../utils/resizeHandlerHOC";
import WordCloudGraph from "./wordCloud.graph";

const WordCloud = (props) => {
  const refElement = useRef(null);
  const graphRef = useRef(null);

  useEffect(() => {
    let graph = graphRef.current;
    if (props.data) {
      if (!graph) {
        graphRef.current = new WordCloudGraph(refElement.current);
        graph = graphRef.current;
      }
      graph.setData(props.data || actualOneD);
      graph.setConfig({ ...props.config });
      graph.drawGraph();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, props.rerender, props.config]);

  useEffect(() => {
    let graph = graphRef.current;

    if (!graph) {
      graphRef.current = new WordCloudGraph(refElement.current);
      graph = graphRef.current;
    }
    if (props.resetSelection) {
      graph.onResetFunc();
    }
  }, [props.resetSelection]);

  return (
    <GraphContainer className="WordCloud-rings graph-container">
      <GraphWrp className="graph-wrp" ref={refElement} />
    </GraphContainer>
  );
};

WordCloud.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  rerender: PropTypes.bool,
  resetSelection: PropTypes.bool,
};

export default ResizeHandlerHOC(WordCloud);
