import React, { useState, useRef } from "react";
import Radial from "../../graphs/RadialGraph/graphWrapper.jsx";
import PropTypes from "prop-types";
import GraphLegend from "../legends";
import { LegendSection } from "../column-graph/index.sc.js";
import {
  Title,
  TitleContainer,
  GraphWrapRadial,
  SVGWrapper,
  Wrapper,
} from "./index.sc.js";
import PortalTooltip from "../portal-tooltip";
import GraphTooltip from "../graph-tooltip";

const RadialComponent = ({
  tooltip,
  data,
  startAngle,
  endAngle,
  size,
  endRadius,
  arcWidth,
  arcRadius,
  arcPadding,
  enableCenterText,
  dataPosition,
  dataLabelFontSize,
  legendData,
  graphType,
  titlePosition,
  legendLabelFontSize,
  dataLabelColor,
  enableDataLabel,
  legend,
  legendPosition = "bottom",
  legendIndicator = "square",
  highlight,
  arcPathBgColor,
  labelColor,
  lableFontSize,
  subLabelColor,
  subLabelFontSize,
  centerBG = "none",
  centerStroke,
  chartTitle,
  enableArcLabel,
  dataLabelPosition,
}) => {
  const [tooltipData, setTooltipData] = useState(null);
  const [enableTooltip, setEnableTooltip] = useState(false);
  const [toolTipPos, setToolTipPos] = useState({ left: 0, top: 0 });
  const tooltipRef = useRef(null);

  const handleOnClick = (event, d, i) => {
    console.log("handleOnClick", event, d, i);
  };

  const handleMouseOver = (event, d, i) => {
    if (tooltip) {
      setTooltipData({ data: d, index: i });
      setToolTipPos({
        left: event.clientX,
        top: event.clientY - 10,
      });
      setEnableTooltip(true);
    }
  };

  const handleMouseOut = (event, d, i) => {
    if (tooltip) {
      setTooltipData(null);
      setEnableTooltip(false);
      console.log("handleMouseOut", event, d, i);
    }
  };

  const handleMouseEnter = (event, d, i) => {
    if (tooltip) {
      setTooltipData({ data: d, index: i });
      setToolTipPos({
        left: event.clientX,
        top: event.clientY - 10,
      });
      setEnableTooltip(true);
      console.log("handleMouseEnter", event, d, i);
    }
  };

  const handleMouseMove = (event, d, i) => {
    if (tooltip) {
      setTooltipData({ data: d, index: i });
      setToolTipPos({
        left: event.clientX,
        top: event.clientY - 10,
      });
      setEnableTooltip(true);
      console.log("handleMouseMove", event, d, i);
    }
  };

  const handleMouseLeave = (event, d, i) => {
    if (tooltip) {
      setTooltipData(null);
      setEnableTooltip(false);
      console.log("handleMouseLeave", event, d, i);
    }
  };

  const events = {
    handleOnClick,
    handleMouseOver,
    handleMouseOut,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
  };

  const defaultLegendData = data.data;
  const renderLegend = () => {
    return (
      legend && (
        <LegendSection
          graphType={graphType}
          height={size}
          width={size}
          startAngle={startAngle}
          radialPosition={legendPosition}
          endAngle={endAngle}
        >
          <GraphLegend
            legendData={legendData ? legendData : defaultLegendData}
            shape={legendIndicator}
            legendPosition={legendPosition}
            graphType={graphType}
            legendLabelFontSize={legendLabelFontSize}
          />
        </LegendSection>
      )
    );
  };

  const renderTooltip = () => {
    return (
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
    <Wrapper>
      {chartTitle && (
        <TitleContainer position={titlePosition}>
          <Title>{chartTitle}</Title>
        </TitleContainer>
      )}
      <GraphWrapRadial
        legendPosition={legendPosition}
        highlight={highlight ? highlight : false}
        graphType={graphType}
        titleHeight={chartTitle ? 20 + 15 : 0}
      >
        <SVGWrapper>
          <Radial
            data={data}
            tooltip={tooltip}
            config={{
              startAngle: startAngle,
              endAngle: endAngle,
              endRadius: endRadius,
              arcWidth: arcWidth,
              arcRadius: arcRadius,
              arcPadding: arcPadding,
              enableCenterText: enableCenterText,
              dataPosition: dataPosition,
              enableDataLabel: enableDataLabel,
              dataLabelPosition: dataLabelPosition,
              dataLabelFontSize: dataLabelFontSize,
              dataLabelColor: dataLabelColor,
              arcPathBgColor: arcPathBgColor,
              centerStroke: centerStroke,
              labelColor: labelColor,
              lableFontSize: lableFontSize,
              subLabelColor: subLabelColor,
              subLabelFontSize: subLabelFontSize,
              centerBG: centerBG,
              enableArcLabel: enableArcLabel,
              legend: legend,
              legendPosition: legendPosition,
              graphType: graphType,
              ...events,
            }}
          />
        </SVGWrapper>
        {legend && renderLegend()}
      </GraphWrapRadial>
      {renderTooltip()}
    </Wrapper>
  );
};

RadialComponent.propTypes = {
  data: PropTypes.object.isRequired,
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
  endRadius: PropTypes.number,
  arcWidth: PropTypes.number,
  arcPadding: PropTypes.number,
  enableCenterText: PropTypes.bool,
  arcPathBgColor: PropTypes.string,
  labelColor: PropTypes.string,
  subLabelColor: PropTypes.string,
  centerBG: PropTypes.string,
  chartTitle: PropTypes.string,
  enableDataLabel: PropTypes.bool,
  dataLabelFontSize: PropTypes.number,
  enableArcLabel: PropTypes.bool,
  dataLabelPosition: PropTypes.string,
};

export default RadialComponent;
