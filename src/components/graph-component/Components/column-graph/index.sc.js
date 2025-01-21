import styled from "styled-components";
export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const SVGWrapper = styled.div`
  width: 100%;
  height: 100%;
  flex: 6;
`;
const GraphWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  flex-direction: ${(props) =>
    props.legendPosition === "right"
      ? "row"
      : props.legendPosition === "left"
      ? "row-reverse"
      : "column"};
  justify-content: center;

  align-items: center;
  .tooltip {
    position: absolute;
    transition: left 0.3s ease-out, top 0.3s ease-out;
  }

  .graph-wrp {
    width: 100% !important;
    height: 100% !important;
    display: flex;
    justify-content: center;
  }
  /* .graph-wrp .y.axis .tick line {
    display: none;
  }
  .graph-wrp .y.axis .tick .y-axis-line {
    display: block !important;
  }
  .graph-wrp .y.axis text {
    fill: #606080;
  }

  .graph-wrp .y.axis .domain {
    stroke: #c2ccd9;
  } */

  ${({ expanded }) =>
    expanded &&
    `
      padding: 3%;
      // padding-left: calc(15% - 30px);
    `}
  ${({ highlight }) =>
    highlight &&
    `
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
  `}
`;
const LegendSection = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  padding: 10px;
  justify-content: center;
  overflow-x: auto;
  align-items: center;
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  justify-content: ${({ legendPosition }) => {
    if (legendPosition?.includes("left")) {
      return "flex-start";
    } else if (legendPosition?.includes("center")) {
      return "center";
    } else if (legendPosition?.includes("right")) {
      return "flex-end";
    } else {
      return "center";
    }
  }};
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: ${({ position }) =>
    position === "right"
      ? "flex-end"
      : position === "center"
      ? "center"
      : "flex-start"};
  margin-bottom: 10px;
`;

const Title = styled.h3`
  font-size: 0.875rem;
  line-height: 20px;
  color: rgb(61, 94, 115);
  font-weight: 600;
  letter-spacing: 0px;
  margin: 0px;
  padding: 0px;
`;
export { GraphWrap, LegendSection, Title, TitleContainer };
