import styled from "styled-components";

export const Container = styled.div`
  width: 12.5rem;
  height: 6.25rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2.90418px 5.80835px rgba(88, 88, 88, 0.3);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: space-between;
  justify-content: space-between;
`;

export const SmallContainer = styled.div`
  min-width: 5.75rem;
  min-height: 3.63rem;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0px 2.90418px 5.80835px rgba(88, 88, 88, 0.3);
  padding: 0.7rem 0.875rem;
  display: flex;
  flex-direction: column;
  align-items: space-between;
  justify-content: space-between;
  box-sizing: border-box;
`;

export const TooltipTitle = styled.div`
  color: #000;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const TooltipSubTitle = styled.div`
color: #000;
font-size: 0.6875rem;
font-style: normal;
font-weight: 400;
line-height: normal;
}`;

export const TooltipLabel = styled.div`
  olor: #585858;
  font-size: 0.6875rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const TooltipLegend = styled.div`
  height: 0.31rem;
  width: 1.25rem;
  background-color: ${({ color }) => color};
`;

export const TooltipBodyWrapper = styled.div`
  display: flex;
  // height: 100%;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
`;

export const TooltipBody = styled.div`
  width: 100%;
  display: flex;
  gap: 0.313rem;
  justify-content: space-between;
`;
export const TooltipBodyLabel = styled.div`
  font-size: 0.65rem;
  line-height: 0.5rem;
  color: #585858;
`;

export const TooltipBodyValue = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 0.75rem;
  color: #000000;
`;
