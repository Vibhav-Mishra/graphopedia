import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { actualOneD } from "../utils/mockData";
import ResizeHandlerHOC from "../utils/resizeHandlerHOC";
import RadialGraph from "./radial.graph";
import { GraphContainer, GraphWrp } from "../../styles/index.sc";

const Radial = (props) => {
  const { height, width } = props.config;
  const refElement = useRef(null);
  const graphRef = useRef(null);

  useEffect(() => {
    let graph = graphRef.current;

    const modifiedData = props.data
      ? {
          ...props.data,
          data: props.data.data.map((entry) => ({
            ...entry,
            label: `${entry.label} (${entry.value})`,
          })),
        }
      : actualOneD;

    if (modifiedData) {
      if (!graph) {
        graphRef.current = new RadialGraph(refElement.current);
        graph = graphRef.current;
      }
      graph.setData(modifiedData);
      graph.setConfig({ ...props.config });
      graph.drawGraph();
    }
  }, [props.data, props.config, props.rerender]);

  return (
    <GraphContainer
      className="great-guage graph-container"
      graphType={props.config.graphType}
    >
      <GraphWrp
        className="graph-wrp"
        ref={refElement}
        height={height}
        width={width}
      ></GraphWrp>
    </GraphContainer>
  );
};

Radial.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  rerender: PropTypes.bool,
};

export default ResizeHandlerHOC(Radial);
