import React, { useEffect, useRef, useState } from "react";
import CoolColumn from "../../graphs/CoolColumn/graphWrapper.jsx";
import GraphLegends from "../legends/index.jsx";
// import * as Styles from "./index.sc.js";
import * as Styles from "./index.sc.js"
import PropTypes from "prop-types";
import PortalTooltip from "../portal-tooltip/index.jsx";
import GraphTooltip from "../graph-tooltip/index.jsx";
// import ExpandablePods from "@rmzlib/expandable-pods";

const ColumnGraph = ({
  data,
  legend = false,
  legendData,
  yLabelAlignment = 30,
  enableGridYLine = false,
  enableGridXLine = false,
  gridXTicks = 6,
  gridYTicks = 6,
  gridXYLabelFontSize,
  highlight,
  tooltip,
  graphType,
  legendIndicator = "square",
  chartTitle,
  expandable,
  barAreaHover = true,
  barSize = 25,
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
  axesStrokeColor = "#000",
  axesLabelColor,
  fontFamily,
}) => {
  const [enableTooltip, setEnableTooltip] = useState(tooltip || true);
  const [toolTipPos, setToolTipPos] = useState({ left: 0, top: 0 });
  const [tooltipData, setTooltipData] = useState();
  const [activeTooltipData, setActiveTooltipData] = useState(null);

  const [tooltipEvent, setTooltipEvent] = useState({});
  const [expanded, setExpanded] = useState(expandable || false);
  const tooltipRef = useRef(null);

  const tooltipEnabled = tooltip;

  const calculateTooltipPosition = (d, config) => {
    const maxBarValue = config.hoverRect
      ? graphType === "stack"
        ? d.maxPositiveAcc
        : d.maxValue
      : graphType === "stack"
      ? d.positiveAcc
      : d.value;
    const svgId = `${graphType}-graph`;
    const graphRect = document.getElementById(svgId).getBoundingClientRect();
    const tooltipYoffset = 25;
    const tooltipXoffset = 14;
    const areaWidth = config.xScale.step();
    const tooltipHeight = tooltipRef.current.offsetHeight;
    const tooltipWidth = tooltipRef.current.offsetWidth;
    let top;
    if (config.graphType === "column") {
      top =
        d.value < 0
          ? graphRect.top + config.yScale(0)
          : graphRect.top + config.yScale(d.value);
    } else if (config.graphType === "group") {
      top =
        maxBarValue < 0
          ? graphRect.top + config.yScale(0)
          : graphRect.top + config.yScale(maxBarValue);
    } else {
      top =
        maxBarValue < 0
          ? graphRect.top + config.yScale(0)
          : graphRect.top + config.yScale(maxBarValue);
    }

    const left =
      graphRect.left +
      graphRect.width -
      config.padding.right -
      config.padding.left -
      config.graphAreaW +
      areaWidth / 2 +
      config.xScale(d.label);

    return { top, left };
  };

  const handleOnClick = (event, d, i) => {
    console.log("handleOnClick", event, d, i);
  };

  const handleMouseOver = (event, d, i) => {
    // console.log('handleMouseOver', event, d, i);
  };

  const handleMouseOut = (event, d, i) => {
    // console.log('handleMouseOut', event, d, i);
  };

  const handleMouseEnter = (event, d, config, i) => {
    if (tooltipEnabled) {
      setEnableTooltip(true);
      setTooltipEvent({
        event,
        d,
        i,
      });
      const tData = d.data || d;
      setTooltipData({ data: tData, rawData: d?.rawData });
      const calculatedTooltipPos = calculateTooltipPosition(d, config);
      setToolTipPos({
        ...toolTipPos,
        ...calculatedTooltipPos,
      });
    }
  };
  const handleMouseMove = (event, d, config, i) => {
    if (tooltipEnabled) {
      setTooltipEvent({
        event,
        d,
        i,
      });
      const tData = d.data || d;
      setTooltipData({ data: tData, rawData: d?.rawData });
      const calculatedTooltipPos = calculateTooltipPosition(d, config);
      setToolTipPos({
        ...toolTipPos,
        ...calculatedTooltipPos,
      });
    }
  };

  const handleMouseLeave = (event, data, config, i) => {
    if (event?.relatedTarget?.classList.contains("tooltip-anchor")) {
      return;
    }
    const d = activeTooltipData;
    setTooltipEvent({});
    if (activeXLabel) {
      const tData = d.data || d;
      setTooltipData({ data: tData, rawData: d?.rawData });
      const calculatedTooltipPos = calculateTooltipPosition(d, config);
      setToolTipPos({
        ...calculatedTooltipPos,
      });
    }
  };

  const handleOnLoad = (d, config, i) => {
    const graphRect = document.querySelector("svg").getBoundingClientRect();
    const maxBarValue = config.hoverRect ? d.maxValue : d.value;
    const columnMaxValue =
      config.graphType === "stack" ? d.maxPositiveAcc : maxBarValue;
    setActiveTooltipData({ ...d });
    setEnableTooltip(true);
    if (!tooltipEvent.event) {
      setTimeout(() => {
        if (activeXLabel) {
          const initialTooltipHeight = config.graphType === "column" ? 55 : 155;
          const initialTooltipWidth =
            config.graphType === "column"
              ? 85
              : config.graphType === "group"
              ? 155
              : 242;
          const tooltipHeight = tooltipRef.current.offsetHeight;
          const tooltipWidth = tooltipRef.current.offsetWidth;
          const tData = d.data || d;
          setTooltipData({ data: tData, rawData: d?.rawData });

          const calculatedTooltipPos = calculateTooltipPosition(tData, config);

          setToolTipPos({
            ...toolTipPos,
            ...calculatedTooltipPos,
          });
        }
      }, 1000);
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

  const renderGraphWrap = (isExpanded) => {
    return (
      // <Styles.GraphWrap highlight={highlight} expanded={isExpanded}  legendPosition={legendPosition} legend={legend}>
      //   {(!isExpanded || data?.title || chartTitle) && (<Styles.TitleContainer position={titlePosition}>
      <Styles.GraphWrap
        highlight={highlight}
        expanded={isExpanded}
        legendPosition={legendPosition}
      >
        {(!isExpanded || data?.title || chartTitle) && (
          <Styles.TitleContainer position={titlePosition}>
            <Styles.Title>{chartTitle || data?.title}</Styles.Title>
          </Styles.TitleContainer>
        )}

        {legendPosition.includes("top") && renderLegend()}
        <CoolColumn
          data={data}
          config={{
            graphType: graphType,
            hoverRect: barAreaHover,
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
            dasharray: 0,
            gridXYLabelFontSize: gridXYLabelFontSize,
            gridXTicks: gridXTicks,
            gridYTicks: gridYTicks,
            columnWidth: barSize,
            yAxisType: "number",
            yAxisTicksFormat: true,
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
            // hideYAxis: true,
            // hideXAxis: true,
            enableFullColumn: true,
            singleLineWrp: true,
            activeXLabel: activeXLabel,
            axesStrokeColor: axesStrokeColor,
            axesLabelColor: axesLabelColor,
            fontFamily: fontFamily,

            ...events,
          }}
          renderToolTipOnLoad={handleOnLoad}
        />
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
          tooltipOffset={20}
          // align={toolTipPos.left > window.innerWidth / 2 ? "left" : "right"}
          // vAlign={toolTipPos.top > window.innerHeight / 2 ? "top" : "bottom"}
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
              type="two-d"
              graphData={data}
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
            shape={legendIndicator}
          />
        </Styles.LegendSection>
      )
    );
  };
  return (
    <>
      {expandable ? (
  <div>
    <button onClick={() => setExpanded(true)}>Expand</button>
    {expanded && renderGraphWrap(expandable)}
    <button onClick={() => setExpanded(false)}>Shrink</button>
  </div>
) : (
  renderGraphWrap(false)
)}

    </>
  );
};

ColumnGraph.propTypes = {
  // graphType : PropTypes.oneOf(["group", "stack"]),
  data: PropTypes.object.isRequired,
  yLabelAlignment: PropTypes.number,
  enableGridYLine: PropTypes.bool,
  enableGridXLine: PropTypes.bool,
  gridColor: PropTypes.string,
  axesLabelColor: PropTypes.string,
  axesStrokeColor: PropTypes.string,
  gridXTicks: PropTypes.number,
  gridYTicks: PropTypes.number,
  highlight: PropTypes.bool,
  gridXYLabelFontSize: PropTypes.number,
  barAreaHover: PropTypes.bool,
  barSize: PropTypes.number,
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
  legendIndicator: PropTypes.oneOf(["square", "circle"]),
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
};

export default ColumnGraph;
