import React, { useState, useEffect, useRef } from "react";
import PolarGraph from "../../graphs/Polar";
import {
  PolarWrapper,
  TitleContainer,
  Title,
  SvgWrapper,
  Wrap,
} from "./index.sc";
import PortalTooltip from "../portal-tooltip";
import GraphTooltip from "../graph-tooltip";

const Polar = ({
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
  legendPosition,
  graphType,
  data,
  radialAxis,
  radialAxisColors,
  highlight,
  showLabel,
  labelFontColor,
  labelFontSize,
  labelFontWeight,
  labelFontFamily,
  showAxisLabel,
  axisLabelFontSize,
  axisLabelFontColor,
  axisLabelFontFamily,
  axisLabelFontWeight,
  tooltip,
}) => {
  const [tooltipData, setTooltipData] = useState(null);
  const [enableTooltip, setEnableTooltip] = useState(true);
  const [toolTipPos, setToolTipPos] = useState({ left: 0, top: 0 });
  const tooltipRef = useRef(null);

  // useEffect(() => {
  //   // const handleResize = () => {
  //   //   setSvgHeight(window.innerWidth < 768 ? "16" : "35");
  //   // };

  //   window.addEventListener("resize", handleResize);
  //   handleResize();

  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  const onMouseOver = (event, data, sectorIndex, index) => {
    if (tooltip) {
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
      <PolarWrapper>
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
          <PolarGraph
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
            labelFontColor={labelFontColor}
            labelFontSize={labelFontSize}
            radialAxis={radialAxis}
            highlight={highlight}
            showLabel={showLabel}
            labelFontWeight={labelFontWeight}
            labelFontFamily={labelFontFamily}
            showAxisLabel={showAxisLabel}
            axisLabelFontSize={axisLabelFontSize}
            axisLabelFontColor={axisLabelFontColor}
            axisLabelFontFamily={axisLabelFontFamily}
            axisLabelFontWeight={axisLabelFontWeight}
            tooltip={tooltip}
          />
        </SvgWrapper>
      </PolarWrapper>
      {renderTooltip()}
    </Wrap>
  );
};

export default Polar;
