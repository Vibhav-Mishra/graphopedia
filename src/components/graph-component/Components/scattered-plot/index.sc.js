import styled from "styled-components";

export const GraphWrapScatter = styled.div`
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
    props.legendPosition === "right" || props.legendPosition === "left"
      ? "60px"
      : "10px"};
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

export const LegendSection = styled.div`
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
