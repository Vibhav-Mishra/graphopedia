import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GraphContainer, GraphWrp } from '../../styles/index.sc';
import { actualOneD } from '../utils/mockData';
import ResizeHandlerHOC from '../utils/resizeHandlerHOC';
import RadialPieGraph from './radialPie.graph';

const RadialPieChart = (props) => {
  const refElement = useRef(null);
  const graphRef = useRef(null);

  useEffect(() => {
    let graph = graphRef.current;

    if (props.data) {
      if (!graph) {
        graphRef.current = new RadialPieGraph(refElement.current);
        graph = graphRef.current;
      }
      graph.setData(props.data || actualOneD);
      graph.setConfig({ ...props.config });
      graph.drawGraph();
    }
  }, [props.data, props.config, props.rerender]);

  useEffect(() => {
    let graph = graphRef.current;

    if (!graph) {
      graphRef.current = new RadialPieGraph(refElement.current);
      graph = graphRef.current;
    }
    if (props.resetSelection) {
      graph.onResetFunc();
    }
  }, [props.resetSelection]);

  return (
    <GraphContainer className="radial-pie-chart graph-container">
      <GraphWrp className="graph-wrp" ref={refElement} />
    </GraphContainer>
  );
};

RadialPieChart.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  rerender: PropTypes.bool,
  resetSelection: PropTypes.bool,
};

export default ResizeHandlerHOC(RadialPieChart);
