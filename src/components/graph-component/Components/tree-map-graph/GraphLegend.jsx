import React from "react";
import Proptypes from "prop-types";
import styled from "styled-components";
import { colorBox } from "../../graphs/utils/graphConst";

const GraphLegend = ({
    legendData = [],
    shape,
    legendPosition,
    legendLabelFontSize,
    legendLabelFontWeight,
    graphType,
}) => {
    return (
        <LegendWrp legendPosition={legendPosition} graphType={graphType}>
            {legendData.map((legend, i) => (
                <LegendContainer key={i}>
                    <LegendBox
                        bgColor={legend?.color || colorBox[i]}
                        shape={shape}
                    ></LegendBox>
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
           
           flex-direction:column;
        `;
            case "right":
                return `
        
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
export const LegendBox = styled.div`
  width: 0.75rem;
  height: 0.75rem;
  background-color: ${({ bgColor }) => bgColor || "#c3c7d9"};
  ${({ shape }) => shape === "circle" && `border-radius:50%`}
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
