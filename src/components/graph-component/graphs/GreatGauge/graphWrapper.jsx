import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { actualOneD } from '../utils/mockData';
import ResizeHandlerHOC from '../utils/resizeHandlerHOC';
import GreatGuageGraph from './greatGuage.graph';
import { GraphContainer, GraphWrp } from '../../styles/index.sc';

const GreatGuage = (props) => {
  const refElement = useRef(null);
  const graphRef = useRef(null);

  useEffect(() => {
    let graph = graphRef.current;

    if (props.data) {
      if (!graph) {
        graphRef.current = new GreatGuageGraph(refElement.current);
        graph = graphRef.current;
      }
      graph.setData(props.data || actualOneD);
      graph.setConfig({ ...props.config });
      graph.drawGraph();
    }
  }, [props.data, props.config, props.rerender]);

  return (
    <GraphContainer className="great-guage graph-container">
      <GraphWrp className="graph-wrp" ref={refElement}></GraphWrp>
    </GraphContainer>
  );
};

GreatGuage.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  rerender: PropTypes.bool,
};

export default ResizeHandlerHOC(GreatGuage);
