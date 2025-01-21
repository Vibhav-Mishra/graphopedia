import React, { useState, useRef } from "react";
import PieChart from "../../graphs/PieChart/graphWrapper.jsx";
import { LegendSection } from "../column-graph/index.sc.js";
import { GraphWrap, SVGWrapper, Title, Wrapper } from "./index.sc.js";
import { TitleContainer } from "./index.sc.js";
import GraphLegend from "../legends";
import PortalTooltip from "../portal-tooltip";
import GraphTooltip from "../graph-tooltip";
import PropTypes from "prop-types";

const PieGraphComponent = ({
  data,
  innerRadius,
  arcLabel = false,
  arcLabelFontsize,
  arcLabelColor,
  arcValueColor,
  arcValueFontWeight,
  arcGap,
  tooltip = false,
  legendData,
  legend = false,
  legendPosition = "bottom",
  legendIndicator = "square",
  legendLabelFontSize,
  highlight = false,
  hoverExternalRadialEffect = true,
  externalOuterRadius = 10,
  externalCornerRadius = 5,
  externalArcOpacity = 0.3,
  selectExpantion = true,
  expansionOffset = 0.2,
  expansionAnimationDuration = 400,
  arcDividerStrokeColor,
  enableCenterText = false,
  subLabelColor = "#000",
  averageValue = false,
  enablePolyline = false,
  polylineColor,
  graphType,
  titlePosition,
  strokeWidth = 1,
  startAngle,
  endAngle,
  subLabelFontSize,
  size,
  polylineFontSize,
  chartTitle,
}) => {
  const [enableTooltip, setEnableTooltip] = useState(false);
  const [toolTipPos, setToolTipPos] = useState({ left: 0, top: 0 });
  const [tooltipData, setTooltipData] = useState();
  const [expanded, setExpanded] = useState(false);
  const [enableNeedle, setEnableNeedle] = useState(false);
  const [tooltipEvent, setTooltipEvent] = useState({}); // Add this line
  const tooltipRef = useRef(null);
  const tooltipEnabled = tooltip;
  const handleOnClick = (event, d, i) => {
    // console.log("handleOnClick", event, d, i);
  };

  let totalValue = 0;
  data.data.forEach((item) => {
    totalValue += item.value;
  });
  const averageValueShow = (totalValue / data.data.length).toFixed(2);

  const handleMouseOver = (event, d, i) => {
    // console.log('handleMouseOver', event, d, i);
  };

  const handleMouseOut = (event, d, i) => {
    // console.log('handleMouseOut', event, d, i);
  };
  const handleMouseEnter = (event, d, i) => {
    if (tooltipEnabled) {
      setEnableTooltip(true);
      setTooltipEvent({
        event,
        d,
        i,
      });
      setToolTipPos({
        ...toolTipPos,
        left: 0,
        top: event.clientY - 10,
      });
      const tData = d.data || d;
      setTooltipData({ data: tData, rawData: d?.rawData });
    }
  };
  const handleMouseMove = (event, d, i) => {
    if (tooltipEnabled) {
      setTooltipEvent({
        event,
        d,
        i,
      });
      setToolTipPos({
        ...toolTipPos,
        left: event.clientX,
        top: event.clientY - 10,
      });
    }
  };

  const handleMouseLeave = (event, d, i) => {
    if (tooltipEnabled) {
      setTooltipEvent({});
      setToolTipPos({
        left: 0,
        top: 0,
      });
      setEnableTooltip(false);
      setTooltipData();
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

  let defaultLegendData = [];
  const twoD = data?.labels?.length > 1;

  if (data?.legends?.length > 0) {
    defaultLegendData = [...data.legends];
  } else {
    if (twoD) {
      defaultLegendData = data?.labels.map((ele) => ({
        label: ele?.label,
        value: ele?.label?.replaceAll(" ", "").toLowerCase(),
        color: ele?.color,
      }));
    } else {
      defaultLegendData = data?.legends?.map((ele) => ({
        label: ele?.label,
        value: ele?.value,
        color: ele?.color,
      }));
    }
  }

  const renderTooltip = () => {
    return (
      tooltipEnabled &&
      enableTooltip && (
        <PortalTooltip
          isOpen={true}
          pos={toolTipPos}
          tooltipOffset={20}
          tooltipRef={tooltipRef}
        >
          <div
            className="tooltip"
            style={{
              position: "relative",
            }}
          >
            <GraphTooltip
              tooltipData={tooltipData}
              className="tooltip"
              type="two-d"
              graphData={data}
              graphType={graphType}
            />
            <div
              className="tooltip-anchor"
              style={{
                position: "absolute",
                inset: "0px",
              }}
            ></div>
          </div>
        </PortalTooltip>
      )
    );
  };
  const renderLegend = () => {
    return (
      legend && (
        <LegendSection
          graphType={graphType}
          halfdonutPosition={legendPosition}
          height={size}
          width={size}
          startAngle={startAngle}
          endAngle={endAngle}
        >
          <GraphLegend
            legendPosition={legendPosition}
            legendLabelFontSize={legendLabelFontSize}
            graphType={graphType}
            legendData={legendData ? legendData : defaultLegendData}
            shape={legendIndicator}
          />
        </LegendSection>
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
      <GraphWrap
        // highlight={highlight ? highlight : false}
        legendPosition={legendPosition}
        graphType={graphType}
        titleHeight={chartTitle ? 20 + 15 : 0}
        // hoverEffect={selectExpantion ? selectExpantion : false}
        // expantionStrokeWidth={expantionStrokeWidth}
        // expantionScale={expantionScale}
      >
        <SVGWrapper>
          <PieChart
            data={data}
            config={{
              innerRadius: innerRadius,
              arcLabel: arcLabel,
              arcDividerStrokeColor: arcDividerStrokeColor,
              enableCenterText: enableCenterText,
              arcLabelFontsize: arcLabelFontsize,
              arcValueFontWeight: arcValueFontWeight,
              enablePolyline: enablePolyline,
              polylineColor: polylineColor,
              graphType: graphType,
              percentValue: false,
              arcLabelColor: arcLabelColor,
              arcValueColor: arcValueColor,
              subLabelColor: subLabelColor,
              averageValue: averageValue,
              startAngle: graphType === "halfdonut" ? startAngle : 0,
              endAngle: graphType === "halfdonut" ? endAngle : 2 * Math.PI,
              strokeWidth: strokeWidth,
              subLabelFontSize: subLabelFontSize,

              legendPosition: legendPosition,
              polylineFontSize: polylineFontSize,
              arcGap: arcGap,
              averageValueShow: averageValueShow,
              legend: legend,
              highlight: highlight,
              hoverExternalRadialEffect: hoverExternalRadialEffect,
              selectExpantion: selectExpantion,
              externalOuterRadius: externalOuterRadius,
              externalCornerRadius: externalCornerRadius,
              externalArcOpacity: externalArcOpacity,
              expansionOffset: expansionOffset,
              expansionAnimationDuration: expansionAnimationDuration,
              // legendPosition: legendPosition,
              ...events,
            }}
          />
        </SVGWrapper>
        {legend && renderLegend()}
      </GraphWrap>
      {renderTooltip()}
    </Wrapper>
  );
};

PieGraphComponent.propTypes = {
  data: PropTypes.object.isRequired,
  arcLabel: PropTypes.bool,
  arcLabelFontsize: PropTypes.number,
  enablePolyline: PropTypes.bool,
  polylineColor: PropTypes.string,
  enableCenterText: PropTypes.bool,
  subLabelColor: PropTypes.string,
  tooltip: PropTypes.bool,
  legend: PropTypes.bool,
  legendData: PropTypes.array,
  legendIndicator: PropTypes.oneOf(["square", "circle"]),
  highlight: PropTypes.bool,
  arcDividerStrokeColor: PropTypes.string,
  graphType: PropTypes.object.string,
  chartTitle: PropTypes.string,
  titlePosition: PropTypes.oneOf(["center", "left", "right"]),
  hoverExternalRadialEffect: PropTypes.bool,
  selectExpantion: PropTypes.bool,
  externalOuterRadius: PropTypes.number,
  externalCornerRadius: PropTypes.number,
  externalArcOpacity: PropTypes.number,
  expansionOffset: PropTypes.number,
  expansionAnimationDuration: PropTypes.number,
};

export default PieGraphComponent;
