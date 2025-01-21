import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
  font-size: ${({ fontSize }) => fontSize || "1.063rem"};
  font-weight: ${({ fontWeight }) => fontWeight || "800"};
  text-transform: uppercase;
  line-height: ${({ lineHeight }) => lineHeight || ""};
  font-family: ${({ fontFamily }) =>
    fontFamily || "Arial, sans-serif"} !important;
`;
