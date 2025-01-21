import styled from "styled-components";

const GraphWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  .graph-wrp {
    width: 100% !important;
    height: 100% !important;
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
  padding: 10px;
  display: flex;
  align-items: flex-start;
  overflow-x: auto;
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  justify-content: ${({ legendPosition }) => {
    if (legendPosition?.includes("left")) {
      return "flex-start";
    } else if (legendPosition?.includes("center")) {
      return "center";
    } else if (legendPosition?.includes("right")) {
      return "flex-end";
    } else {
      return "center"; // Default value if legendPosition is not provided or doesn't match any condition
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
