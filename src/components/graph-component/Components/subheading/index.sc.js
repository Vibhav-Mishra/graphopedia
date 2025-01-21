import styled from "styled-components";

export const Wrapper = styled.div`
  color: ${({ color }) => color || "#6c6c6c"};
  font-size: ${({ fontSize }) => fontSize || ".75rem"};
  font-weight: ${({ fontWeight }) => fontWeight};
  text-transform: uppercase;
  line-height: ${({ lineHeight }) => lineHeight || ""};
  display: flex;
  align-items: flex-end;
  font-family: ${({ fontFamily }) =>
    fontFamily || "Arial, sans-serif"}!important;
`;
