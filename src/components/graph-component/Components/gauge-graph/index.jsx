import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useRef } from "react";
import GaugeGraph from "../../graphs/GaugeGraph/graphWrapper.jsx";
import PropTypes from "prop-types";
import { Title, TitleContainer } from "./index.sc";

const GuageGraphComponent = ({
  data,
  size,
  chartTitle,
  innerTitle,
  innerTitleTextColor,
  innerTitleTextSize,
  titleSize,
  titlePosition = "left",
  needleFillColor,
  needleWidth = 8,
  needleLength = 0,
  centerTextColor,
  centerTextWidth,
  arcColor,
  targetTextFontSize,
  targetTextColor,
  graphType,
  // arrowCircleSize,
  arcWidth,
  upArrow,
  downArrow,
  isPositiveGood = true,
  gaugeType,
  value = 10,
  needleType = "pointerNeedle",
  isNeedleGradient = false,
  needleGradientColor1 = "lightgrey",
  needleGradientColor2 = "transparent",
  isOnlyHalfDoughnutVariant = false,
  needleOpacity = 0.7,
  ...props
}) => {
  const prevVal = useRef(0);

  useEffect(() => {
    prevVal.current = value;
  }, [value]);

  let diffValue = (value - prevVal.current).toFixed(2);

  let currentValue = value;
  let preVal = prevVal.current;
  return (
    <div style={{ width: "100%" }}>
      <Section>
        <TitleContainer position={titlePosition}>
          <Title>{chartTitle || data?.title}</Title>
        </TitleContainer>

        <GraphWrap>
          <GaugeGraph
            graphType={graphType}
            rangeData={data}
            // titleShow={title}
            // title={graphType}
            value={value}
            // titleSize={titleSize}
            needleFillColor={needleFillColor}
            needleWidth={needleWidth}
            needleLength={needleLength}
            height={size}
            width={size}
            centerTextColor={centerTextColor}
            centerTextWidth={centerTextWidth}
            arcColor={arcColor}
            targetText={targetTextFontSize}
            targetTextColor={targetTextColor}
            // arrowCircleSize={arrowCircleSize}
            arcWidth={arcWidth}
            downArrow={downArrow}
            upArrow={upArrow}
            currentValue={currentValue}
            preVal={preVal}
            isPositiveGood={isPositiveGood}
            diffData={{
              diffValue: diffValue,
              arrowDir: diffValue >= 0 ? "up" : "down",
              bgColor: diffValue <= 0 ? "#22d273" : "#fc6c6c",
            }}
            gaugeType={gaugeType}
            needleType={needleType}
            isNeedleGradient={isNeedleGradient}
            needleGradientColor1={needleGradientColor1}
            needleGradientColor2={needleGradientColor2}
            needleOpacity={needleOpacity}
            innerTitle={innerTitle}
            innerTitleTextColor={innerTitleTextColor}
            innerTitleTextSize={innerTitleTextSize}
            isOnlyHalfDoughnutVariant={isOnlyHalfDoughnutVariant}
          />
        </GraphWrap>
      </Section>
    </div>
  );
};

GuageGraphComponent.propTypes = {
  // graphType : PropTypes.oneOf(["group", "stack"]),
  chartTitle: PropTypes.string,
  titlePosition: PropTypes.oneOf(["left", "center", "right"]),
  innerTitle: PropTypes.string,
  innerTitleTextColor: PropTypes.string,
  innerTitleTextSize: PropTypes.number,
  value: PropTypes.number.isRequired,
  needleWidth: PropTypes.number,
  needleLength: PropTypes.number,
  needleOpacity: PropTypes.number,
  centerTextColor: PropTypes.string,
  centerTextWidth: PropTypes.number,

  arcColor: PropTypes.string,

  arcWidth: PropTypes.number,
  targetTextFontSize: PropTypes.number,
  targetTextColor: PropTypes.string,
  isPositiveGood: PropTypes.number,
  gaugeType: PropTypes.oneOf(["default", "semicircle"]),
  needleType: PropTypes.oneOf(["none", "rectangleNeedle", "pointerNeedle"]),
  isNeedleGradient: PropTypes.bool,
  isOnlyHalfDoughnutVariant: PropTypes.bool,
};

export default GuageGraphComponent;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin-bottom: 40px;
`;
const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  width: 100%;
`;

const GraphWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  ${({ expanded }) =>
    expanded &&
    css`
      padding: 3%;
      // padding-left: calc(15% - 30px);
    `}
  .graph-wrp {
    width: 100% !important;
    height: 100% !important;
  }
`;
