import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
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
  margin-bottom: 15px;
`;

export const Title = styled.h3`
  font-size: 0.875rem;
  line-height: 20px;
  color: rgb(61, 94, 115);
  font-weight: 600;
  letter-spacing: 0px;
  margin: 0px;
  padding: 0px;
`;
