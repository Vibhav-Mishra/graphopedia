import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GraphContainer, GraphWrp } from '../../Components/styled-components';
import HotHeatMapGraph from './hotHeatMap.graph';
import { heatData } from '../utils/mockData';
import ResizeHandlerHOC from '../utils/resizeHandlerHOC';

const HotHeatMap = (props) => {
  const refElement = useRef(null);
  let graph;

  // useEffect hook - creates new d3 component whenever data changes
  useEffect(() => {
    if (props.data) {
      graph = graph || new HotHeatMapGraph(refElement.current);
      graph.setData(props.data || heatData);
      graph.setConfig({ ...props.config });
      graph.drawGraph();
    }
  }, [props.data, props.rerender]);

  return (
    <GraphContainer className="hot-heat-map graph-container">
      <GraphWrp className="graph-wrp" ref={refElement}></GraphWrp>
    </GraphContainer>
  );
};

HotHeatMap.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  rerender: PropTypes.bool,
};
export default ResizeHandlerHOC(HotHeatMap);
