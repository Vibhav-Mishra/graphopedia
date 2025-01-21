import styled from "styled-components";

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  /* margin-bottom: 40px; */
  box-sizing: border-box;
`;
export const GraphWrap = styled.div`
  /* width: 100%; */
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  padding: 1%;
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