import React, { useEffect, useRef, useState } from "react";
import LinearLine from "../../graphs/LinearLine/graphWrapper.jsx";
import GraphLegends from "./LineGraphLegend.jsx";
import * as Styles from "./index.sc";
import PropTypes from "prop-types";
import PortalTooltip from "../portal-tooltip";
import GraphTooltip from "../graph-tooltip";
import ExapandablePods from "@rmzlib/expandable-pods";
// import { formatNumber } from "../../graphs/utils/graphGrid.js";

const LineGraph = ({
  data,
  legend = false,
  legendData,
  hideYAxis = false,
  hideXAxis = false,
  yLabelAlignment = 30,
  enableGridYLine = false,
  enableGridXLine = false,
  gridXTicks = 6,
  gridYTicks = 6,
  alternateYAxisTicks = false,
  gridXYLabelFontSize,
  // highlight,
  tooltip,
  graphType,
  curveType = "curveLinear",
  lineType = "normal",
  dashPattern = 5.5,
  // curveBetaAlphaTension = 1,
  // legendIndicator = "square",
  chartTitle,
  expandable,
  barAreaHover = true,
  titlePosition,
  legendPosition = "top",
  gridColor = "#D0D3E5",
  showThresholdLabel = false,
  enableThreshold = false,
  thresholdValue,
  thresholdStroke,
  showLabels = true,
  labelPosition = "top",
  labelFontSize,
  labelColor,
  activeXLabel,
  highlightColor,
  pointCircleStrokeWidth,
  pointCircleStroke,
  pointCircleFill,
  // disableCircleLabel,
  enablePointCircle,
  // pointCircleFontSize,
  radiusOfPointCircle,
  // enableCurve,
  enableGradient,
  // enableStep,
  fillOpacity = 1,
  dasharray,
  beginAtZero = true,
  yAxisTicksFormat,
  yAxisType,
  formatTooltipValue = true,
  gridHoverColor,
  xAxisTickHightlight,
  axesStrokeColor,
  axesLabelColor,
  fontFamily,
  showBackGroundRect = false,
  enablePointResizingAnimation = true,
  pointerTypes = "Circle",
  randomPointerTypes = false,
  highlightHoverLine = true,
  radialEffectOnSelectedPoint = true,
  pointerFillEffectOnSelect = true,
  showPointerValue = false,
  showAllPointerValueOnHover = false,
  // showPointerValueOnHover = false,
  pointerTextColor = "#000",
  pointerTextSize = 12,
  pointerTextPositionOffsetY = 5,
  pointerTextPositionOffsetX = 2,
  pointerTextFontFamily = "Inter",
  pointerTextFontWeight = 500,
}) => {
  const [enableTooltip, setEnableTooltip] = useState(tooltip || true);
  const [toolTipPos, setToolTipPos] = useState({ left: 0, top: 0 });
  const [tooltipData, setTooltipData] = useState();
  const [tooltipEvent, setTooltipEvent] = useState({});
  const [expanded, setExpanded] = useState(expandable || false);
  const tooltipRef = useRef(null);
  const [activeTooltipData, setActiveTooltipData] = useState(null);
  const [changeActiveXLabel, setChangeActiveXLabel] = useState(activeXLabel);
  const [updatedData, setUpdatedData] = useState(null);
  const [activeLineColor, setActivelineColor] = useState(null);
  const tooltipEnabled = tooltip;

  useEffect(() => {
    const pointerStyles = ["Circle", "Diamond", "Triangle", "Square", "Star"];

    let updatedLabels = [];
    if (randomPointerTypes && data?.labels?.length > 0) {
      if (data?.labels?.length <= pointerStyles.length) {
        // If length is 4 or less, use all unique styles without repeating
        const availableStyles = [...pointerStyles];
        updatedLabels = data?.labels?.map((label, index) => ({
          ...label,
          pointerStyle:
            availableStyles[index] ||
            pointerStyles[index % pointerStyles.length],
        }));
      } else {
        // If length is greater than 4, randomize with possible repeats
        updatedLabels = data?.labels?.map((label) => ({
          ...label,
          pointerStyle:
            pointerStyles[Math.floor(Math.random() * pointerStyles.length)],
        }));
      }
      setUpdatedData({
        ...data,
        labels: updatedLabels,
      });
    } else {
      updatedLabels = data?.labels?.map((label) => ({
        ...label,
        pointerStyle: pointerTypes,
      }));
      setUpdatedData({
        ...data,
        labels: updatedLabels,
      });
    }
  }, [
    randomPointerTypes,
    data.labels,
    data,
    pointerTypes,
    highlightHoverLine,
    curveType,
    lineType,
  ]);

  const calculateTooltipPosition = (d, config) => {
    const svgId = `${graphType}-graph`;
    const graphRect = document.getElementById(svgId).getBoundingClientRect();
    const top =
      config.graphType === "sarea"
        ? graphRect.top + config.yScale(d?.accValue)
        : graphRect.top + config.yScale(d?.value);

    const left =
      graphRect.left +
      graphRect.width -
      config.padding.right -
      config.padding.left -
      config.graphAreaW +
      config.xScale(d?.label);

    return { top, left };
  };
  const handleOnClick = (event, d, i) => {
    // console.log("handleOnClick", event, d, i);
  };

  const handleMouseOver = (event, d, i) => {
    // console.log('handleMouseOver', event, d, i);
  };

  const handleMouseOut = (event, d, i) => {
    // console.log('handleMouseOut', event, d, i);
  };

  const handleMouseEnter = (event, d, config, i) => {
    // if (tooltipEnabled) {
    setEnableTooltip(true);
    setTooltipEvent({
      event,
      d,
      i,
    });
    const calculatedTooltipPos = calculateTooltipPosition(d, config);

    setToolTipPos({
      ...toolTipPos,

      ...calculatedTooltipPos,
    });
    const tData = d.data || d;
    setTooltipData({ data: tData, rawData: tData });
    setChangeActiveXLabel(d?.data?.label);
    // }
  };
  const handleMouseMove = (event, d, config, i, isPointer, isOverLine) => {
    // if (tooltipEnabled) {
    setTooltipEvent({
      event,
      d,
      i,
    });
    const calculatedTooltipPos = calculateTooltipPosition(d, config);
    setToolTipPos({
      ...toolTipPos,

      ...calculatedTooltipPos,
    });
    setTooltipData({ data: d.data, rawData: d.data });
    setChangeActiveXLabel(d?.data?.label);
    isPointer ? setActivelineColor(d.color) : null;
    showAllPointerValueOnHover && isOverLine
      ? setActivelineColor(d[0]?.color)
      : null;
    // }
  };

  const handleMouseLeave = (event, d, config, i) => {
    if (event?.relatedTarget?.classList.contains("tooltip-anchor")) {
      return;
    }
    setChangeActiveXLabel(activeXLabel);
    setActivelineColor(null);
    const data = activeTooltipData;
    setTooltipEvent({});
    // if (activeXLabel) {
    if (changeActiveXLabel) {
      const tData = d?.data || data;
      setTooltipData({ data: tData, rawData: tData });
      const calculatedTooltipPos = calculateTooltipPosition(data, config);

      setToolTipPos({
        ...calculatedTooltipPos,
      });
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

  if (updatedData?.legends?.length > 0) {
    defaultLegendData = [...updatedData.legends];
  } else {
    defaultLegendData = updatedData?.labels?.map((ele) => ({
      label: ele?.label,
      value: ele?.value,
      color: ele?.color,
      shape: ele?.pointerStyle,
    }));
  }

  const handleOnLoad = (d, config, i) => {
    setActiveTooltipData({ ...d });
    setEnableTooltip(true);
    if (!tooltipEvent.event) {
      // setTimeout(() => {
      // if (activeXLabel) {
      if (changeActiveXLabel) {
        const tData = d.data || d;
        setTooltipData({ data: tData, rawData: tData });
        setChangeActiveXLabel(d?.data?.label);

        const calculatedTooltipPos = calculateTooltipPosition(d, config);

        setToolTipPos({
          ...toolTipPos,
          ...calculatedTooltipPos,
        });
      }
      // }, 1000);
    }
  };
  const renderGraphWrap = (isExpanded) => {
    return (
      <Styles.GraphWrap
        // highlight={highlight}
        expanded={isExpanded}
      >
        {(!isExpanded || data?.title || chartTitle) && (
          <Styles.TitleContainer position={titlePosition}>
            <Styles.Title>{chartTitle || data?.title}</Styles.Title>
          </Styles.TitleContainer>
        )}

        {legendPosition.includes("top") && renderLegend()}
        {updatedData && (
          <LinearLine
            data={updatedData}
            config={{
              graphType: graphType,
              curveType: curveType,
              lineType: lineType,
              dashPattern: dashPattern,
              // curveBetaAlphaTension: curveBetaAlphaTension,
              hoverRect: barAreaHover,
              hideYAxis: hideYAxis,
              hideXAxis: hideXAxis,
              axesStrokeColor,
              axesLabelColor,
              yLabelAlignment: yLabelAlignment
                ? expanded
                  ? yLabelAlignment * 2
                  : yLabelAlignment
                : expanded
                ? 60
                : 30,
              xLabelAlignment: 25,
              enableGridYLine: enableGridYLine,
              enableGridXLine: enableGridXLine,
              gridLineStrokeWidth: 1,
              gridXYLabelFontSize: gridXYLabelFontSize,
              gridXTicks: gridXTicks,
              gridYTicks: gridYTicks,
              alternateYAxisTicks: alternateYAxisTicks,
              dasharray: dasharray,
              yAxisType: yAxisType,
              yAxisTicksFormat: yAxisTicksFormat,
              gridLineXStroke: gridColor,
              gridLineYStroke: gridColor,
              enableTopLabels: showLabels && labelPosition === "top",
              yTotalLabelFS: labelFontSize,
              yTotalLabelColor: labelColor,
              enableRectLabels: showLabels && labelPosition !== "top",
              enableThreshold: enableThreshold,
              disableThreshouldLabel: !showThresholdLabel,
              summary: {
                thresholdArr: [{ label: "", value: thresholdValue }],
              },
              xAxisPosition: "bottom",
              rerender: false,
              thresholdStroke: thresholdStroke,
              hideTicks: true,
              gridHoverColor: gridHoverColor,

              fillOpacity: fillOpacity,
              beginAtZero: beginAtZero,

              // enableCurve: enableCurve,
              enableGradient: enableGradient,
              // enableStep: enableStep,

              enablePointCircle: enablePointCircle,
              r: radiusOfPointCircle,
              pointCircleStrokeWidth: pointCircleStrokeWidth,
              pointCircleStroke: pointCircleStroke,
              pointCircleFill: pointCircleFill,
              // pointCircleFontSize: pointCircleFontSize,
              // disableCircleLabel: disableCircleLabel,

              singleLineWrp: true,
              // activeXLabel: activeXLabel,
              activeXLabel: changeActiveXLabel,
              activeLineColor: activeLineColor,
              highlightColor: gridHoverColor,
              xAxisTickHightlight: xAxisTickHightlight,
              fontFamily: fontFamily,
              enablePointResizingAnimation: enablePointResizingAnimation,
              pointerTypes: pointerTypes,
              highlightHoverLine: highlightHoverLine,
              pointerFillEffectOnSelect: pointerFillEffectOnSelect,
              radialEffectOnSelectedPoint: radialEffectOnSelectedPoint,
              showPointerValue: showPointerValue,
              showAllPointerValueOnHover: showAllPointerValueOnHover,
              // showPointerValueOnHover: showPointerValueOnHover,
              pointerTextColor: pointerTextColor,
              pointerTextSize: pointerTextSize,
              pointerTextPositionOffsetY: pointerTextPositionOffsetY,
              pointerTextPositionOffsetX: pointerTextPositionOffsetX,
              pointerTextFontFamily: pointerTextFontFamily,
              pointerTextFontWeight: pointerTextFontWeight,
              ...events,
            }}
            showBackGroundRect={showBackGroundRect}
            renderToolTipOnLoad={handleOnLoad}
          />
        )}
        {legendPosition.includes("bottom") && renderLegend()}
        {renderTooltip()}
      </Styles.GraphWrap>
    );
  };

  const renderTooltip = () => {
    return (
      tooltipEnabled &&
      enableTooltip && (
        <PortalTooltip
          isOpen={true}
          pos={toolTipPos}
          // align={toolTipPos.left > window.innerWidth / 2 ? "left" : "right"}
          // align={"left"}
          // vAlign={toolTipPos.top > window.innerHeight / 2 ? "top" : "bottom"}
          // vAlign={"top"}
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
              formatValue={formatTooltipValue}
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
        <Styles.LegendSection legendPosition={legendPosition}>
          <GraphLegends
            legendData={legendData ? legendData : defaultLegendData}
            // shape={legendIndicator}
          />
        </Styles.LegendSection>
      )
    );
  };
  return (
    <>
      {expandable ? (
        <ExapandablePods
          onExpand={(e) => {
            setExpanded(true);
          }}
          onShrink={(e) => {
            setExpanded(false);
          }}
          title={chartTitle ? chartTitle : data?.title}
          content={renderGraphWrap(expandable)}
        />
      ) : (
        renderGraphWrap(false)
      )}
    </>
  );
};

LineGraph.propTypes = {
  data: PropTypes.object.isRequired,
  curveType: PropTypes.oneOf([
    "curveLinear",
    "curveNatural",
    "curveCardinal",
    "curveBasis",
    "curveBasisClosed",
    "curveBasisOpen",
    "curveStep",
    "curveStepAfter",
    "curveStepBefore",
    "curveMonotoneX",
    "curveMonotoneY",
    "curveBumpX",
    "curveBumpY",
    "curveBundle",
    "curveCardinal",
    "curveCardinalClosed",
    "curveCardinalOpen",
    "curveCatmullRom",
    "curveCatmullRomClosed",
    "curveCatmullRomOpen",
    "curveLinearClosed",
  ]),
  // curveBetaAlphaTension: PropTypes.number,
  lineType: PropTypes.oneOf(["normal", "dashed"]),
  dashPattern: PropTypes.number,
  yLabelAlignment: PropTypes.number,
  hideYAxis: PropTypes.bool,
  hideXAxis: PropTypes.bool,
  enableGridYLine: PropTypes.bool,
  enableGridXLine: PropTypes.bool,
  gridColor: PropTypes.string,
  gridXTicks: PropTypes.number,
  gridYTicks: PropTypes.number,
  // highlight: PropTypes.bool,
  gridXYLabelFontSize: PropTypes.number,
  dasharray: PropTypes.array,
  enablePointCircle: PropTypes.bool,
  radiusOfPointCircle: PropTypes.number,
  pointCircleStrokeWidth: PropTypes.number,
  // disableCircleLabel: PropTypes.bool,
  // pointCircleFontSize: PropTypes.number,
  pointCircleFill: PropTypes.string,
  pointCircleStroke: PropTypes.string,
  axesStrokeColor: PropTypes.string,
  axesLabelColor: PropTypes.string,

  gridHoverColor: PropTypes.string,

  fillOpacity: PropTypes.number,
  beginAtZero: PropTypes.bool,

  formatTooltipValue: PropTypes.bool,

  yAxisType: PropTypes.oneOf(["number", "text"]),
  yAxisTicksFormat: PropTypes.bool,

  tooltip: PropTypes.bool,
  legend: PropTypes.bool,
  legendData: PropTypes.array,
  legendPosition: PropTypes.oneOf([
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
  ]),
  // legendIndicator: PropTypes.oneOf(["square", "circle"]),
  titlePosition: PropTypes.oneOf(["left", "center", "right"]),
  chartTitle: PropTypes.string,
  enableThreshold: PropTypes.bool,
  showThresholdLabel: PropTypes.bool,
  thresholdValue: PropTypes.number,
  thresholdStroke: PropTypes.string,
  showLabels: PropTypes.bool,
  labelFontSize: PropTypes.number,
  labelColor: PropTypes.string,
  labelPosition: PropTypes.oneOf(["top", "inside"]),
  activeXLabel: PropTypes.string,
  highlightColor: PropTypes.string,
  showBackGroundRect: PropTypes.bool,
  enablePointResizingAnimation: PropTypes.bool,
  pointerTypes: PropTypes.oneOf([
    "Circle",
    "Diamond",
    "Triangle",
    "Square",
    "Star",
  ]),
  randomPointerTypes: PropTypes.bool,
  highlightHoverLine: PropTypes.bool,
  radialEffectOnSelectedPoint: PropTypes.bool,
  pointerFillEffectOnSelect: PropTypes.bool,
  showPointerValue: PropTypes.bool,
  showAllPointerValueOnHover: PropTypes.bool,
  // showPointerValueOnHover: PropTypes.bool,
  pointerTextColor: PropTypes.string,
  pointerTextSize: PropTypes.number,
  pointerTextPositionOffsetY: PropTypes.number,
  pointerTextPositionOffsetX: PropTypes.number,
  pointerTextFontFamily: PropTypes.string,
  pointerTextFontWeight: PropTypes.number,
};

export default LineGraph;
