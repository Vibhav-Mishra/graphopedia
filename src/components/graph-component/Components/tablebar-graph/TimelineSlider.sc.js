import styled from "styled-components";

export const TimelineContainer = styled.div`
  margin: 20px 0;
  position: relative;
`;

export const Timeline = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  height: 20px;
`;

export const TimelineLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #c2ccd9;
  transform: translateY(-50%);
`;

export const TimelinePoint = styled.div`
  position: relative;
  width: ${({ active, hovered }) => (active || hovered ? "10.5px" : "6.5px")};
  height: ${({ active, hovered }) => (active || hovered ? "10.5px" : "6.5px")};
  background-color: ${({ active, hovered }) =>
    active || hovered ? "#e20074" : "#ccc"};
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  margin-right: ${({ last }) => (last ? "0" : "33.43px")};
  transition: width 0.2s, height 0.2s;

  &::after {
    content: ${({ showLabel }) => (showLabel ? "attr(data-label)" : "")};
    position: absolute;
    top: ${({ active, hovered }) => (active || hovered ? "13.5px" : "11.5px")};
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 9px;
    font-weight: ${({ active, hovered }) =>
      active || hovered ? "700" : "500"};
    font-family: "Inter", sans-serif;
    color: ${({ active, hovered }) => (active || hovered ? "#e20074" : "#ccc")};
  }
`;
