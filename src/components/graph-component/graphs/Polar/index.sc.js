import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow: visible;
  svg {
    overflow: visible;
  }

  .polar-graph-center-container-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translate(-50%, -50%);
    overflow: hidden;
  }
`;

export const TooltipContainer = styled.div`
  pointer-events: none;
  position: fixed;
  z-index: 1000001;
`;
export const TooltipWrap = styled.div`
  position: fixed;
  display: none;
  pointer-events: none;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px 2.90418px 5.80835px rgba(88, 88, 88, 0.3);
  border-radius: 3px;
  overflow: hidden;
  width: fit-content;
`;
export const Tip = styled.div`
  height: 0.75rem;
  width: 0.75rem;
  display: none;
  position: fixed;
  svg {
    height: 100%;
    width: 100%;
    position: absolute;
    transform-origin: center;
  }
`;
