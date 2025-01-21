import styled from "styled-components";

export const GraphContainer = styled.div`
  position: relative;
  height: 100%;

  .region-wrp {
    background-color: blue;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .regions,
  .countries,
  .citys,
  .regions-label,
  .countries-label {
    position: absolute;
    overflow: hidden;
  }
  .citys,
  .countries,
  .regions {
    border: 1px solid #fff;
  }
  .node {
    box-sizing: border-box;
    line-height: 1em;
    overflow: hidden;
    position: absolute;
    white-space: pre;
    background: #ddd;
  }

  .node-label,
  .node-value {
    margin: 4px;
  }

  .node-value {
    margin-top: -2px;
  }

  .node-value {
    font-weight: bold;
  }

  .regions-label {
    color: #fff;
  }
`;

export const GraphWrp = styled.div`
  position: relative;
  height: 100%;
  width: 100%;

  & svg {
    height: 100%;
    width: 100%;
  }
  .selected {
    transition: all 400ms ease;
    opacity: 1 !important;
  }

  .unselected {
    transition: all 400ms ease;
    opacity: 0.2 !important;
  }

  .hover-selected {
    transition: all 400ms ease;
    opacity: 1 !important;
  }
  .hover-unselected {
    transition: all 400ms ease;
    opacity: 0.2 !important;
  }
`;

export const Wrapper = styled.div`
  position: relative;
  height: 400px;
  width: 700px;

  .line-bg-rect-group:hover line,
  .line-bg-rect-group:hover .hoverCircle {
    display: block !important;
  }
`;
