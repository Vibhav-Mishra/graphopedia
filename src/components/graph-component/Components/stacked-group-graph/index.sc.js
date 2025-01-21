import styled from "styled-components";


export const SvgWrapper = styled.div`
 height: 100%;
width: 100%;
gap:0.8rem;
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

export const StackedGroupGraphContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap:${({title})=>title?"0.38rem":""}

`;

export const LegendWrapper = styled.div`
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
  font-size: 0.875rem;
   font-size: ${({ titleFontSize }) =>
    titleFontSize ? `${titleFontSize}px` : "0.825rem"};
  line-height: 20px;
  color: rgb(61, 94, 115);
  font-weight: 600;
  letter-spacing: 0px;
  margin: 0px;
  padding: 0px;
`;