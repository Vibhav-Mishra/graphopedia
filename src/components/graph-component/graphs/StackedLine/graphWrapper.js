import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { actualOneD } from '../utils/mockData';
import ResizeHandlerHOC from '../utils/resizeHandlerHOC';
import StackedLineGraph from './stackedLine.graph';
import { GraphContainer, GraphWrp } from '../../styles/index.sc';

const StackedLine = (props) => {
  const refElement = useRef(null);
  const graphRef = useRef(null);

  // useEffect hook - creates new d3 component whenever data changes
  useEffect(() => {
    let graph = graphRef.current;

    if (props.data) {
      if (!graph) {
        graphRef.current = new StackedLineGraph(refElement.current);
        graph = graphRef.current;
      }
      graph.setData(props.data || actualOneD);
      graph.setConfig({ ...props.config });
      graph.drawGraph();
    }
  }, [props.data, props.rerender, props.config]);

  useEffect(() => {
    let graph = graphRef.current;

    if (!graph) {
      graphRef.current = new StackedLineGraph(refElement.current);
      graph = graphRef.current;
    }
    if (props.resetSelection) {
      graph.onResetFunc();
    }
  }, [props.resetSelection]);

  return (
    <GraphContainer className="stacked-line graph-container">
      <GraphWrp className="graph-wrp" ref={refElement}></GraphWrp>
    </GraphContainer>
  );
};

StackedLine.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  rerender: PropTypes.bool,
  resetSelection: PropTypes.bool,
};

export default ResizeHandlerHOC(StackedLine);
