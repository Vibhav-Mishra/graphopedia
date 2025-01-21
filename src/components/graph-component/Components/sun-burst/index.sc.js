import styled from "styled-components";

export const SunburstWrapper = styled.div`
  width: 100%;
  height: 100%;
  // display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  //   margin-bottom: 10px;
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

export const LegendWrapper = styled.div`
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
export const SvgWrapper = styled.div`
  position: relative;
  height: ${({ titleHeight }) =>
    titleHeight ? `calc(100% - ${titleHeight}px)` : "100%"};
  width: 100%;
  flex-direction: ${(props) =>
    props.legendPosition === "right"
      ? "row"
      : props.legendPosition === "left"
      ? "row-reverse"
      : props.graphType === "Sunburst Custom"
      ? "row"
      : "column"};
  display: flex;
  justify-content: center;
  gap: ${(props) =>
    props.legendPosition === "left" || props.legendPosition === "right"
      ? "50px"
      : ""};
`;

export const Wrap = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  .sunburst-center-container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    h4 {
      color: ${({ color }) => color};
      font-size: 1rem;
      font-weight: 500 !important;
    }
    p {
      margin: 0;
      line-height: 1rem;
      text-align: center;
      font-size: 0.75rem;
    }
  }
`;

export const SunburstTooltip = styled.div`
  width: 7.5rem;
  height: 5.25rem;
  display: flex;
  padding: 0.5rem 0.625rem;
  flex-direction: column;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  border-radius: 0.1875rem;
  border: 0.1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
`;

export const TooltipTitle = styled.div`
  width: 100%;
`;

export const TooltipTitleText = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: 0.75rem;
`;

export const TooltipTitleUtilization = styled.div`
  color: #000;
  font-size: 0.6875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1rem;
  span {
    color: ${({ color }) => color};
  }
`;

export const TooltipCarrierText = styled.div`
  color: #2f3446;
  font-size: 0.6875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1rem; /* 145.455% */
  width: 100%;
`;

export const TooltipLegendWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const TooltipSquare = styled.div`
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 0.125rem;
  background: ${({ color }) => color};
`;

export const TooltipLegendText = styled.div`
  color: #2f3446;
  font-size: 0.6875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1rem;
  span {
    font-weight: 400;
  }
`;

export const HeadingWrapper = styled.div`
  position: absolute;
  width: 100%;
  left: ${({ align }) => align || "50%"};
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LeftWrapper = styled.div`
  width: calc(100vw / 5);
  max-width: 20%;
  height: 100%;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ gapValue, count }) => (count > 4 ? "0.278em" : gapValue)};
  text-align: left;
`;

export const RightWrapper = styled.div`
  width: calc(100vw / 5);
  max-width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ gapValue, count }) => (count > 4 ? "0.278em" : gapValue)};
  text-align: right;
`;

export const DataItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: ${({ align }) => align || "flex-start"};
  width: 100%;
  height: 100%;
  gap: ${({ count }) => (count > 4 ? "0.0444em" : "0.1333em")};
  font-size: ${({ count }) => (count > 4 ? "0.75em" : "1em")};
  border-left: ${({ align, color }) =>
    align === "flex-start" ? `4px solid ${color}` : "none"};
  border-right: ${({ align, color }) =>
    align === "flex-end" ? `4px solid ${color}` : "none"};
  padding-left: ${({ align }) => (align === "flex-start" ? "0.5rem" : "0")};
  padding-right: ${({ align }) => (align === "flex-end" ? "0.5rem" : "0")};
`;

export const SvgContainer = styled.div`
  position: relative;
  height: 100%;
  width: 65%;
  display: flex;
  justify-content: ${({ align }) => align || "center"};
  align-items: center;
`;
