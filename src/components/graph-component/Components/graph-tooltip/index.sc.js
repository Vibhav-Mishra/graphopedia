import styled from "styled-components";

export const TooltipWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: ${({ theme }) => theme.background};
  min-width: 4rem;
  
  &.one-d {
    padding: 0.7rem 0.875rem;
    /* min-height: 3.125rem; */
  }
  &.two-d {
    /* width: fit-content;
    min-width: 14.625rem;
    height: fit-content; */
    min-height: 7rem;
    flex-shrink: 0;
    padding: 1.25rem 1.5625rem;
  }
`;
export const TooltipTitle = styled.div`
  font-weight: 500;
  font-size: 0.8rem;
  line-height: 0.5rem;
  color: #585858;
  text-transform: capitalize;
  &.two-d {
    color: #000;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;
export const TooltipBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.313rem;
`;
export const TooltipBodyLabel = styled.div`
  font-size: 0.65rem;
  line-height: 0.5rem;
  color: #585858;
`;

// 2-d
export const TooltipTitleValue = styled.div`
  color: #000;
  font-size: 0.6875rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
export const TooltipSubTitle = styled.div`
  color: #585858;
  font-size: 0.6875rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const TooltipLegendWrp = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.9rem;
`;
export const TooltipLegendContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;
export const LegendColor = styled.div`
  width: 1.25rem;
  height: 0rem;
  border: ${({ bgColor }) => `3px solid ${bgColor || "#c3c7d9"}`};
`;
export const LegendLabel = styled.div`
  color: #585858;
  font-size: 0.6875rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
export const LegendValue = styled.div`
  color: #000;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
export const TooltipBodyValue = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 0.75rem;
  color: #000000;
`;
export const LabelContainer = styled.div`
  display: flex;
  align-items: center;
`;
export const TooltipTitleColor = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  background-color: ${({ bgColor }) => bgColor || "#c3c7d9"};
  border-radius: 50%;
  margin-right: 4px;
`;
