import React from "react";
import Proptypes from "prop-types";
import styled from "styled-components";
import { colorBox } from "../../graphs/utils/graphConst";

const GraphLegend = ({
    legendData = [],
    // shape,
    legendPosition,
    legendLabelFontSize,
    legendLabelFontWeight,
    graphType,
}) => {
    const shapeObj = {
        circle: Circle,
        diamond: Diamond,
        square: Square,
        triangle: Triangle,
        star: Star,
    };
    return (
        <LegendWrp legendPosition={legendPosition} graphType={graphType}>
            {legendData?.map((legend, i) => (
                <LegendContainer key={i}>
                    <LegendBox
                        bgColor={legend?.color || colorBox[i]}
                        as={shapeObj[legend?.shape.toLowerCase()]}
                    />
                    <LegendLabel
                        legendLabelFontSize={legendLabelFontSize}
                        legendLabelFontWeight={legendLabelFontWeight}
                    >
                        {legend?.label || legendData[0].labels[i]}
                    </LegendLabel>
                </LegendContainer>
            ))}
        </LegendWrp>
    );
};
export default GraphLegend;

GraphLegend.propTypes = {
    legendData: Proptypes.arrayOf(Proptypes.object),
    legendLabelFontWeight: Proptypes.number,
};

export const LegendWrp = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  margin-bottom: ${(props) =>
        (props.graphType === "halfdonut" && props.legendPosition === "left") ||
            (props.legendPosition === "right" && props.graphType === "halfdonut")
            ? "4.2rem"
            : props.graphType === "Radial Basic" &&
                (props.legendPosition === "left" || props.legendPosition === "right")
                ? "6.2rem"
                : "none"};

  ${({ legendPosition }) => {
        switch (legendPosition) {
            case "left":
                return `
           position: absolute;
           flex-direction:column;
        `;
            case "right":
                return `
        position: absolute;
           flex-direction:column;
        `;
        }
    }}
`;
export const LegendContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
export const LegendBox = styled.div``;
export const Circle = styled.div`
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background-color: ${({ bgColor }) => bgColor || "#c3c7d9"};
`;
export const Square = styled.div`
    width: 0.75rem;
    height: 0.75rem;
    background-color: ${({ bgColor }) => bgColor || "#c3c7d9"};

`;
export const Triangle = styled.div`
    width: 0;
    height: 0;
    border-left: 0.375rem solid transparent;
    border-right: 0.375rem solid transparent;
    border-bottom: 0.75rem solid ${({ bgColor }) => bgColor || "#c3c7d9"};
`;
export const Diamond = styled.div`
    width: 0.65rem;
    height: 0.65rem;
    transform: rotate(45deg);
    background-color: ${({ bgColor }) => bgColor || "#c3c7d9"};
`;
export const Star = styled.div`
  --star-color: ${({ bgColor }) => bgColor || "#c3c7d9"};
  margin: 0;
  position: relative;
  display: block;
  width: 0px;
  height: 0px;
  border-right: 0.375rem solid transparent;
  border-bottom: 0.265rem solid var(--star-color);
  border-left: 0.375rem solid transparent;
  transform: rotate(35deg);

  &::before {
    border-bottom: 0.3rem solid var(--star-color);
    border-left: 0.1125rem solid transparent;
    border-right: 0.1125rem solid transparent;
    position: absolute;
    height: 0;
    width: 0;
    top: -0.16875rem;
    left: -0.24375rem;
    display: block;
    content: "";
    transform: rotate(-35deg);
  }

  &::after {
    position: absolute;
    display: block;
    top: 0.01125rem;
    left: -0.39375rem;
    width: 0;
    height: 0;
    border-right: 0.375rem solid transparent;
    border-bottom: 0.265rem solid var(--star-color);
    border-left: 0.375rem solid transparent;
    transform: rotate(-70deg);
    content: "";
  }
`;
export const LegendLabel = styled.div`
  color: #5c5e60;
  font-size: 0.625rem;
  font-size: ${({ legendLabelFontSize }) =>
        legendLabelFontSize ? `${legendLabelFontSize}px` : "10px"};
  font-style: normal;
  font-weight: ${({ legendLabelFontWeight }) => legendLabelFontWeight || 700};
  line-height: 0.5rem; /* 80% */
  letter-spacing: -0.0125rem;
  white-space: nowrap;
`;
