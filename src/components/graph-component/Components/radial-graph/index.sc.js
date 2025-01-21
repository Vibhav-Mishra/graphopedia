import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: ${({ position }) =>
    position === "right"
      ? "flex-end"
      : position === "center"
      ? "center"
      : "flex-start"};
  margin-bottom: 15px;
`;

export const Title = styled.h3`
  font-size: 0.875rem;
  line-height: 20px;
  color: rgb(61, 94, 115);
  font-weight: 600;
  letter-spacing: 0px;
  margin: 0px;
  padding: 0px;
`;

export const GraphWrapRadial = styled.div`
  width: 100%;
  height: ${({ titleHeight }) => `calc(100% - ${titleHeight}px)`};
  display: flex;

  flex-direction: ${(props) =>
    props.legendPosition === "right"
      ? "row"
      : props.legendPosition === "left"
      ? "row-reverse"
      : props.legendPosition === "bottom"
      ? "column"
      : "column-reverse"};
  justify-content: center;

  align-items: center;
  .tooltip {
    position: absolute;
    transition: left 0.3s ease-out, top 0.3s ease-out;
  }
  /* gap:3rem; */
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

export const SVGWrapper = styled.div`
  width: 100%;
  height: 100%;
  flex: 6;
`;
