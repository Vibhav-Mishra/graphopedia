import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GraphContainer, GraphWrp } from '../../../styles/index.sc';
import { actualOneD } from '../../utils/mockData';
import ResizeHandlerHOC from '../../utils/resizeHandlerHOC';
import XAxisGraph from './XAxis.graph';

const XAxis = (props) => {
  const refElement = useRef(null);
  const graphRef = useRef(null);

  useEffect(() => {
    let graph = graphRef.current;

    if (props.data) {
      if (!graph) {
        graphRef.current = new XAxisGraph(refElement.current);
        graph = graphRef.current;
      }
      graph.setData(props.data || actualOneD);
      graph.setConfig({ ...props.config });
      graph.drawGraph();
    }
  }, [props.config, props.data, props.rerender]);

  return (
    <GraphContainer className="x-axis-wrp graph-container">
      <GraphWrp className="graph-wrp" ref={refElement} />
    </GraphContainer>
  );
};

XAxis.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  rerender: PropTypes.bool,
};

export default ResizeHandlerHOC(XAxis);
