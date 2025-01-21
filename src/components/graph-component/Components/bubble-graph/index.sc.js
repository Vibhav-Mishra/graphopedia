import styled from "styled-components";

export const LegendSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  overflow-x: auto;
  align-items: center;
  align-items: ${(props)=>
  props.legendPosition=="bottom"?"flex-start":"center"
  };
  &::-webkit-scrollbar {
    display: none;
  }
  flex: 2;

    
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  ${({ legendPosition }) => {
    switch (legendPosition) {
      case "left":
        return `
          flex-direction: row;
          justify-content:center
          flex:2;
        `;
      case "right":
        return `
          flex-direction: row;
          justify-content: center;
          flex:2;
  
        `;
    }
  }}
`;
