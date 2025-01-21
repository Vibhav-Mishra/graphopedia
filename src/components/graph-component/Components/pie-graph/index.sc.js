import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;
export const SVGWrapper = styled.div`
  width: 100%;
  height: 100%;
  flex: 6;
`;
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
  gap: 1.25rem;
  overflow-y: auto;
`;
const GridItem = styled.div`
  width: calc(50% - 0.625rem);
  height: 18rem;
  .expandable-pods-content-wrap,
  .expandable-pods-expanded-content-wrap {
    height: 100% !important;
    overflow-y: hidden;
  }
`;

export const GraphWrap = styled.div`
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
  .external-circle {
    visibility: hidden;
    /* opacity:0.5; */
  }

  .hoverSelected {
    visibility: visible !important;
    /* opacity:0.5 !important; */
  }

  .hover-selected {
    transition: all 400ms ease-in-out;
    opacity: 1 !important;
  }
  .hover-unselected {
    transition: all 400ms ease-in-out;
    opacity: 0.2 !important;
  }

  /* ${({ expanded }) =>
    expanded &&
    `
      padding: 3%;
      // padding-left: calc(15% - 30px);
    `}
  ${({ highlight }) =>
    highlight &&
    `
 .selected {
  transition: all 400ms ease-in-out;
  // opacity: 1 !important;
}

.unselected {
  transition: all 400ms ease-in-out;
  // opacity: 0.2 !important;
}

.hover-selected {
  transition: all 400ms ease-in-out;
  opacity: 1 !important;
}
.hover-unselected {
  transition: all 400ms ease-in-out;
  opacity: 0.2 !important;
}
  `} */
  /* ${({ hoverEffect, expantionScale, expantionStrokeWidth }) =>
    hoverEffect &&
    css`
      .selected {
        transform: scale(${expantionScale});
        stroke-width: ${expantionStrokeWidth}px;
      }
      .unselected {
        z-index: 10;
        transform: scale(1);
        stroke-width: 1px;
      }
    `} */
`;

export const TooltipWrapper = styled.div`
  padding: 0.7rem 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
export const TooltipTitle = styled.div`
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 0.5rem;
  color: #585858;
`;
export const TooltipBody = styled.div`
  display: flex;
  flex-direction: row;
`;
export const TooltipBodyLabel = styled.div`
  font-size: 0.55rem;
  line-height: 0.5rem;
  color: #585858;
`;
export const TooltipBodyValue = styled.div`
  font-weight: 700;
  font-size: 0.85rem;
  line-height: 0.75rem;
  color: #000000;
`;

const GraphContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 95%;
  padding-right: 2rem;
`;

const LegendsWrap = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transform: scale(${({ expanded }) => (expanded ? 1.375 : 1)});
`;

export const GaugeGraphWrap = styled.div`
  position: absolute;
  top: ${({ fullSize }) => (fullSize ? "10%" : "20%")};
  height: 100%;
  .graph-wrp {
    width: 100% !important;
    height: 100% !important;
  }
`;

export const ToolTipLeft = styled.div`
  border: 1px solid red;
`;
export const Title = styled.h3`
  font-size: 0.875rem;
  line-height: 20px;
  color: rgb(61, 94, 115);
  font-weight: 600;
  margin: 0;
  padding: 0;
`;
export const TitleContainer = styled.div`
  display: flex;
  justify-content: ${({ position }) =>
    position === "right"
      ? "flex-end"
      : position === "center"
        ? "center"
        : "flex-start"};
  margin-bottom: 15px;
`;

export const ToolTipRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const LegendSection = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow-x: auto;
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
