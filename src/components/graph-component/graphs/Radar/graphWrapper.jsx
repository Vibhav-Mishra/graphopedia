import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { GraphContainer, GraphWrp } from "../../Styles/index.sc";
import ResizeHandlerHOC from "../utils/resizeHandlerHOC";
import RadarGraph from "./radar.graph";

const Radar = (props) => {
  const refElement = useRef(null);
  const graphRef = useRef(null);

  useEffect(() => {
    let graph = graphRef.current;

    if (props.data && props.data?.data[0]) {
      if (!graph) {
        graphRef.current = new RadarGraph(refElement.current);
        graph = graphRef.current;
      }

      graph.setData(props.data);
      graph.setConfig({ ...props.config });

      graph.drawGraph();
    }
  }, [props.data, props.config, props.rerender, props?.data?.data]);

  useEffect(() => {
    let graph = graphRef.current;

    if (!graph) {
      graphRef.current = new RadarGraph(refElement.current);
      graph = graphRef.current;
    }
    if (props.resetSelection) {
      graph.onResetFunc();
    }
  }, [props.resetSelection]);

  return (
    <GraphContainer
      className="radar-rings graph-container"
      graphType={props.config.graphType}
    >
      <GraphWrp className="graph-wrp" ref={refElement} />
    </GraphContainer>
  );
};

Radar.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  rerender: PropTypes.bool,
  resetSelection: PropTypes.bool,
};

export default ResizeHandlerHOC(Radar);
