import styled from 'styled-components'

export const Flex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
`
export const Wrapper = styled.div`
  width: 90vw;
  height: 90vh;
  position: relative;
  max-width: 400px; 
  max-height: 400px;
`;

export const Heading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: lighter;
  font-size: ${({ fontSize }) => `${fontSize}px`};
  height: 10%;
  margin-bottom:12px;
`
export const Svgshow=styled.div`
  & svg {
    fill:${({color})=>color};
    width: 100%;
    height: 100%;
    margin-top: 4px;
  }
`
export const Bottom = styled.div`
  border-radius: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  width: ${({ width, height }) => `${Math.min(width, height) / 50}rem`};
  height: 5rem;
  background: ${({ bgColor }) => bgColor};
  margin-top: -1rem;
`
export const Text = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  margin-left: 8%;
  text-align: center;
  font-size: ${({ arrowCircleSize }) => `${arrowCircleSize}px`};
`
export const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  width: ${({ arrowCircleSize }) => `${arrowCircleSize}px`};
  height: ${({ arrowCircleSize }) => `${arrowCircleSize}px`};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
`
