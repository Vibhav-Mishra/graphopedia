import React, { useState, useEffect, useRef } from "react";
import SunburstGraph from "../../graphs/SunBurst";
import GraphLegends from "../legends";
import {
  SunburstWrapper,
  TitleContainer,
  Title,
  LegendWrapper,
  SvgWrapper,
  Wrap,
  LeftWrapper,
  RightWrapper,
  DataItem,
  SvgContainer,
  HeadingWrapper,
} from "./index.sc";
import Heading from "../heading";
import SubHeading from "../subheading";
import PortalTooltip from "../portal-tooltip";
import GraphTooltip from "../graph-tooltip";

const LeftRectangle = ({ height }) => (
  <svg
    width="65"
    height={height}
    viewBox="0 0 37 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 5C0 2.23858 2.23858 0 5 0H26.763C28.4035 0 29.9396 0.80472 30.8736 2.15338L35.8172 9.29203C36.5288 10.3195 36.5288 11.6805 35.8172 12.708L30.8736 19.8466C29.9396 21.1953 28.4035 22 26.763 22H5C2.23858 22 0 19.7614 0 17V5Z"
      fill="#EFEFEF"
    />
  </svg>
);

const RightRectangle = ({ height }) => (
  <svg
    width="65"
    height={height}
    viewBox="0 0 37 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M37 17C37 19.7614 34.7614 22 32 22L10.237 22C8.59649 22 7.06037 21.1953 6.1264 19.8466L1.18279 12.708C0.471246 11.6805 0.471246 10.3195 1.18279 9.29203L6.1264 2.15338C7.06037 0.804721 8.59649 1.33158e-06 10.237 1.475e-06L32 3.37758e-06C34.7614 3.619e-06 37 2.23858 37 5L37 17Z"
      fill="#EFEFEF"
    />
  </svg>
);

const Sunburst = ({
  chartTitle,
  titlePosition,
  titleFontSize,
  title,
  innerGraphRadiusPercent,
  backgroundFillColor,
  axialLineStrokes,
  showSectorDividers,
  angleOfRotation,
  radialAxisDashArray,
  legend,
  legendPosition,
  legendIndicator,
  legendLabelFontSize,
  legendLabelFontWeight,
  graphType,
  data,
  legendData,
  showLabel,
  labelFontColor,
  radialAxis,
  radialAxisColors,
  sideLegends,
  showSideLegends,
  highlight,
  fontFamily,
  leftWrapperGap,
  rightWrapperGap,
  tooltip,
}) => {
  const [tooltipData, setTooltipData] = useState(null);
  const [enableTooltip, setEnableTooltip] = useState(true);
  const [toolTipPos, setToolTipPos] = useState({ left: 0, top: 0 });
  const tooltipRef = useRef(null);

  const renderLegend = () => {
    return (
      legend && (
        <LegendWrapper
          graphType={graphType}
          legendPosition={legendPosition}
          title={title}
        >
          <GraphLegends
            graphType={graphType}
            legendData={legendData.map((legend) => ({
              label: legend.title,
              color: legend.color,
            }))}
            shape={legendIndicator}
            legendPosition={legendPosition}
            legendLabelFontSize={legendLabelFontSize}
            legendLabelFontWeight={legendLabelFontWeight}
          />
        </LegendWrapper>
      )
    );
  };

  const onMouseOver = (event, data, sectorIndex, index) => {
    if (enableTooltip) {
      setTooltipData({
        data,
        sectorIndex,
        index,
      });

      setToolTipPos({
        left: event.clientX,
        top: event.clientY - 10,
      });
      setEnableTooltip(true);
    }
  };

  const onMouseLeave = () => {
    setTooltipData(null);
    setEnableTooltip(false);
  };

  const renderTooltip = () => {
    return (
      tooltip &&
      enableTooltip && (
        <PortalTooltip
          isOpen={true}
          pos={toolTipPos}
          tooltipOffset={20}
          tooltipRef={tooltipRef}
        >
          <GraphTooltip
            tooltipData={tooltipData}
            className="tooltip"
            type="two-d"
            graphData={data}
            graphType={graphType}
          />
        </PortalTooltip>
      )
    );
  };

  return (
    <Wrap>
      <SunburstWrapper>
        {title && (
          <TitleContainer position={titlePosition}>
            <Title titleFontSize={titleFontSize}>
              {chartTitle || data?.title}
            </Title>
          </TitleContainer>
        )}
        <SvgWrapper
          titleHeight={title ? 20 + 15 : 0}
          legendPosition={legendPosition}
          graphType={graphType}
        >
          {legend && legendPosition.includes("top") && renderLegend()}
          {showSideLegends && (
            <LeftWrapper
              count={sideLegends[0].content.length}
              gapValue={leftWrapperGap}
            >
              <SvgContainer align="flex-start">
                <LeftRectangle />
                <HeadingWrapper align="50%">
                  <Heading
                    fontSize={"1em"}
                    fontWeight={700}
                    fontFamily={fontFamily}
                  >
                    {sideLegends[0].name}
                  </Heading>
                </HeadingWrapper>
              </SvgContainer>
              {sideLegends[0].content.map((item, index) => (
                <DataItem
                  key={index}
                  align="flex-start"
                  color={item.color}
                  count={sideLegends[0].content.length}
                >
                  <SubHeading fontSize={".667em"} fontFamily={fontFamily}>
                    {item.title}
                  </SubHeading>
                  <Heading
                    color={item.color}
                    fontSize={"1em"}
                    fontFamily={fontFamily}
                  >
                    {item.percentage}
                  </Heading>
                </DataItem>
              ))}
            </LeftWrapper>
          )}
          <SunburstGraph
            data={data}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            angleOfRotation={angleOfRotation}
            radialAxisColors={radialAxisColors}
            radialAxisDashArray={radialAxisDashArray}
            backgroundFillColor={backgroundFillColor}
            innerGraphRadiusPercent={innerGraphRadiusPercent}
            axialLineStrokes={axialLineStrokes}
            showSectorDividers={showSectorDividers}
            labelFontColor={"#FFF"}
            radialAxis={radialAxis}
            highlight={highlight}
            showLabel={showLabel}
            tooltip={tooltip}
          />
          {showSideLegends && (
            <RightWrapper
              count={sideLegends[1].content.length}
              gapValue={rightWrapperGap}
            >
              <SvgContainer align="flex-end">
                <RightRectangle />
                <HeadingWrapper align="55%">
                  <Heading
                    className="heading-overlay"
                    fontSize={"1em"}
                    fontWeight={700}
                    fontFamily={fontFamily}
                  >
                    {sideLegends[1].name}
                  </Heading>
                </HeadingWrapper>
              </SvgContainer>
              {sideLegends[1].content.map((item, index) => (
                <DataItem
                  key={index}
                  align="flex-end"
                  color={item.color}
                  count={sideLegends[1].content.length}
                >
                  <SubHeading fontSize={".667em"} fontFamily={fontFamily}>
                    {item.title}
                  </SubHeading>
                  <Heading
                    color={item.color}
                    fontSize={"1em"}
                    fontFamily={fontFamily}
                  >
                    {item.percentage}
                  </Heading>
                </DataItem>
              ))}
            </RightWrapper>
          )}
          {legend && legendPosition.includes("bottom") && renderLegend()}
          {legend &&
            (legendPosition.includes("left") ||
              legendPosition.includes("right")) &&
            renderLegend()}
        </SvgWrapper>
      </SunburstWrapper>
      {renderTooltip()}
    </Wrap>
  );
};

export default Sunburst;
