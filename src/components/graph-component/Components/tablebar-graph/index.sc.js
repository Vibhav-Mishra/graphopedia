import styled from "styled-components";

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

  gap: ${(props) =>
    (props.legendPosition === "right" || props.legendPosition === "left") &&
    (props.graphType === "pie" ||
      props.graphType === "donut" ||
      props.graphType === "halfdonut")
      ? "2.5rem"
      : (props.legendPosition === "top" || props.legendPosition === "bottom") &&
        (props.graphType === "pie" ||
          props.graphType === "donut" ||
          props.graphType === "halfdonut")
      ? "1rem"
      : props.legendPosition === "bottom-left" ||
        props.legendPosition === "bottom-center" ||
        props.legendPosition === "bottom-right"
      ? "12px"
      : props.legend === "false"
      ? "10px"
      : "0px"};
  align-items: center;
  .tooltip {
    position: absolute;
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
  display: flex;
  padding: 10px;
  justify-content: center;
  overflow-x: auto;
  align-items: center;
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  margin-top: ${(props) => {
    const startAngleFirstDigit = Math.abs(props.startAngle).toString()[0];
    const endAngleFirstDigit = Math.abs(props.endAngle).toString()[0];

    if (
      (props.graphType === "halfdonut" &&
        props.halfdonutPosition === "bottom" &&
        startAngleFirstDigit === "1" &&
        endAngleFirstDigit === "1") ||
      (startAngleFirstDigit === "1" && endAngleFirstDigit === "1")
    ) {
      return `calc(-0.5 * (min(${props.height}px, ${props.width}px) - 20px))`;
    } else {
      return "none";
    }
  }};

  margin-top: ${(props) =>
    ((props.graphType === "halfdonut" &&
      props.halfdonutPosition === "bottom") ||
      (props.radialPosition === "bottom" &&
        props.graphType === "Radial Basic")) &&
    (!(props.startAngle >= 0 && props.endAngle >= 0) ||
      (props.startAngle >= 1 && props.endAngle <= 1))
      ? `calc(-0.5 * (min(${props.height}px, ${props.width}px) - 20px))`
      : "none"};

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  width: ${(props) =>
    props.graphType == "pie" ||
    props.graphType == "donut" ||
    props.graphType == "halfdonut"
      ? "fit-content"
      : "100%"};
  /* width: fit-content; */
  ${({ legendPosition }) => {
    switch (legendPosition) {
      case "left":
        return `
          flex-direction: row;
          align-items: flex-start;
          justify-content: flex-start;
        `;
      case "right":
        return `
          flex-direction: row;
          align-items: flex-end;
          justify-content: flex-end;
        `;
    }
  }}
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
  }}
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
