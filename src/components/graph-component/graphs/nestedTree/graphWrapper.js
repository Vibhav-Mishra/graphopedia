import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GraphContainer, GraphWrp } from '../../Components/styled-components';
import { actualOneD } from '../utils/mockData';
import ResizeHandlerHOC from '../utils/resizeHandlerHOC';
// import {
//   actualOneD,
//   actualTwoD,
//   actualTwoD2,
//   actualTwoD4,
// } from "../utils/mockData";
import NestedTreeGraph from './nestedTree.graph';

const NestedTree = (props) => {
  const refElement = useRef(null);
  // const [data, setData] = useState(props.data || actualOneD);
  let graph;

  // // useEffect hook - creates new d3 component whenever data changes
  // useEffect(() => {
  //   graph = graph || new NestedTreeGraph(refElement.current);
  //   graph.setData(data);
  //   graph.setConfig({ ...props.config });
  //   graph.drawGraph();
  // }, [data]);

  // // useEffect(() => {
  // //   setTimeout(() => {
  // //     setData(actualTwoD);
  // //   }, 5000);
  // // }, []);

  // useEffect hook - creates new d3 component whenever data changes
  useEffect(() => {
    if (props.data) {
      graph = graph || new NestedTreeGraph(refElement.current);
      graph.setData(props.data || actualOneD);
      graph.setConfig({ ...props.config });
      graph.drawGraph();
    }
  }, [props.data, props.rerender]);

  return (
    <GraphContainer className="nested-tree graph-container">
      <GraphWrp className="graph-wrp" ref={refElement}></GraphWrp>
    </GraphContainer>
  );
};
NestedTree.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  rerender: PropTypes.bool,
};
export default ResizeHandlerHOC(NestedTree);
