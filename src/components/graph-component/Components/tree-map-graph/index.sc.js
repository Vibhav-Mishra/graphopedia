import styled from "styled-components";

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  /* margin-bottom: 40px; */
  box-sizing: border-box;
`;
export const TitleContainer = styled.div`
  display: flex;
  justify-content: ${(props) => props.position};
`;
export const Title = styled.h2`
  font-size: 1.5rem;
  margin: 0;
`;
export const GraphWrap = styled.div`
  width: 100%;
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  padding: 3%;
  box-sizing: border-box;
  .overlay{
    background-image: "rgba(0, 0, 0, 0.5)" !important;
    cursor: pointer;
  }
  .tooltip-enabled{
    cursor: pointer;
  }
  .highlighted{
    transition: transform 0.3s ease-in-out;
    /* transform: scale(1.1);  */
    opacity: 1 !important;
    cursor: pointer;
  }
  .reverse-highlighted{
    transition: transform 0.3s ease-in-out;
    opacity: 0.6 !important;
  }
`;

export const TooltipWrapper = styled.div`
  padding: 0.7rem;
  min-width: 5rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const TooltipTop = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TooltipBottom = styled.div`
  color: ${({ color }) => color || "#000"};
  font-size:${({ size }) => size ? `${size}px` : "14px"};
  font-weight: ${({ weight }) => weight || 500};
  line-height: auto;
  text-align: left;
`;

export const TooltipHeader = styled.div`
  color: ${({ color }) => color || "#000"};
  font-size:${({ size }) => size ? `${size}px` : "10px"};
  font-weight: ${({ weight }) => weight || 500};
  line-height: auto;
  text-align: left;
`;

export const TooltipSubHeader = styled.div`
  color: ${({ color }) => color || "#000"};
  font-size:${({ size }) => size ? `${size}px` : "9px"};
  font-weight: ${({ weight }) => weight || 400};
  line-height: auto;
  text-align: left;
`;

export const LegendSection = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 0 2%;
  margin: auto;
  box-sizing: border-box;
  /* overflow-x: auto; */
  align-items: center;
  /* align-items: ${(props) =>
    props.legendPosition == "bottom" ? "flex-start" : "center"
  }; */
  /* &::-webkit-scrollbar {
    display: none;
  } */
  flex: 2;

    
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  ${({ legendPosition }) => {
    switch (legendPosition) {
      case "bottom":
        return `
        flex-direction: column;
        flex:2;
        `
      case "top":
        return `
        flex-direction: column-reverse;
        flex:2;
        `
      case "left":
        return `
          flex-direction: row-reverse;
          flex:2;
        `;
      case "right":
        return `
          flex-direction: row;
          flex:2;
        `;
    }
  }}
`;