import styled from "styled-components";

export const Section = styled.div`
  ${({ sectionStyle = {} }) => sectionStyle}
`;
export const GraphContainerBubble = styled.div`
  height: 100%;
  width: 100%;
  flex: 6;

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
  .bubble-label,
  .bubble-value {
    pointer-events: none;
  }
`;
export const GraphWrpBubble = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  text-transform: capitalize;
  & svg {
    height: ${(props) => (props.height ? `${props.height}px` : "100%")};
    width: ${(props) => (props.width ? `${props.width}px` : "100%")};
    overflow: visible;
  }
  .line-bg-rect-group:hover line,
  .line-bg-rect-group:hover .hover-tooltip-rect,
  .line-bg-rect-group:hover .tooltip-label,
  .line-bg-rect-group:hover .tooltip-color-legend,
  .line-bg-rect-group:hover .tooltip-sublabel {
    display: block !important;
  }

  .line-bg-rect:hover {
    fill: rgba(195, 199, 217, 0.3) !important;
  }

  .column-rect-group:hover {
    fill: rgba(195, 199, 217, 0.3);
  }
`;

export const GraphContainer = styled.div`
  width: 100%;
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
  .bubble-label,
  .bubble-value {
    pointer-events: none;
  }
`;

export const GraphWrp = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  text-transform: capitalize;
  & svg {
    height: ${(props) => (props.height ? `${props.height}px` : "100%")};
    width: ${(props) => (props.width ? `${props.width}px` : "100%")};
    overflow: visible;
  }
  .line-bg-rect-group:hover line,
  .line-bg-rect-group:hover .hover-tooltip-rect,
  .line-bg-rect-group:hover .tooltip-label,
  .line-bg-rect-group:hover .tooltip-color-legend,
  .line-bg-rect-group:hover .tooltip-sublabel {
    display: block !important;
  }

  .line-bg-rect:hover {
    fill: ${({ showRect }) => showRect ? "rgba(195, 199, 217, 0.3)" : "transparent"};
  }

  .column-rect-group:hover {
    fill: rgba(195, 199, 217, 0.1);
  }

  /* .x.axis > .domain,
  .y.axis > .domain {
    stroke: #d9dbde;
  } */

  /* .x.axis > .tick > line:first-child,
  .y.axis > .tick > line:first-child {
    display: none;
  } */
`;

export const Wrapper = styled.div`
  position: relative;
  height: 400px;
  width: 700px;

  &:hover line {
    display: block !important;
  }

  .line-bg-rect-group:hover line,
  .line-bg-rect-group:hover .hoverCircle {
    display: block !important;
  }
`;
