import styled from 'styled-components'

export const GraphWrapButterfly = styled.div`
  width: 100%;
  height: 100%;
  .graph-wrp {
    width: 100% !important;
    height: 100% !important;
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

 export const TitleContainer = styled.div`
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

 export const Title = styled.h3`
    font-size: ${({ titleFontSize }) =>
    titleFontSize ? `${titleFontSize}px` : "0.825rem"};
  line-height: 20px;
  color: rgb(61, 94, 115);
  font-weight: 600;
  letter-spacing: 0px;
  margin: 0px;
  padding: 0px;
`;

export const LegendSection = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  padding: 10px;
  justify-content: center;
  overflow-x: auto;
  align-items: center;
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

export const GraphWrapper = styled.div`
 height: 100%;
width: 100%;
flex-direction: ${(props) =>
    props.legendPosition === "right"
      ? "row"
      : props.legendPosition === "left"
      ? "row-reverse"
      : "column"};
      display: flex;
      justify-content: center;
      gap:${(props)=>
      props.legendPosition==="left" || props.legendPosition ==="right" ?"50px":""
      }
`;