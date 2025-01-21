import React, { useRef, useState, useEffect } from "react";
import GraphLegends from "../legends/index.jsx";
import * as Styles from "./index.sc.js";
import PropTypes from "prop-types";
import PortalTooltip from "../portal-tooltip/index.jsx";
import GraphTooltip from "../graph-tooltip/index.jsx";
import Table from "../../graphs/TableBar/table.jsx";
import TimelineSlider from "./TimelineSlider.jsx";
import { mockData } from "./barData.js";

const TableBarGraph = ({
  data,
  legend = false,
  legendData,
  yLabelAlignment = 30,
  xLabelAlignment = 25,
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
  expandable = false,
  barAreaHover = true,
  barSize = 25,
  titlePosition,
  legendPosition = "top",
  gridColor = "#D0D3E5",
  showThresholdLabel = false,
  enableThreshold = false,
  thresholdValue,
  thresholdStroke,
  dataLabelPosition = "top",
  dataLabelFontWeight,
  labelFontSize,
  labelColor,
  activeXLabel,
  activeYLabel,
  axesStrokeColor = "#000",
  axesLabelColor,
  hideYAxis = false,
  hideXAxis = false,
  enableDataLabel = false,
  dataLabelFontSize,
  dataLabelColor,
  title,
  padding,
  enableTextOverBar,
  textOverBarColor,
  textOverBarFontSize,
  fontFamily,
}) => {
  const [filteredData, setFilteredData] = useState(
    mockData.data.filter((item) => item.period === mockData.data[0].period)
  );

  const [category, setCategory] = useState("total");

  const handleDateChange = (date) => {
    setFilteredData(mockData.data.filter((item) => item.period === date));
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  useEffect(() => {
    setFilteredData(
      mockData.data.filter((item) => item.period === mockData.data[0].period)
    );
  }, []);

  const filteredHeaders = (headers) => {
    return headers
      .filter(
        (header) => header.startsWith(`${category}_`) || header === "eng_market"
      )
      .map((header) =>
        header === "eng_market" ? header : header.replace(`${category}_`, "")
      );
  };

  const [enableTooltip, setEnableTooltip] = useState(tooltip || true);
  const [toolTipPos, setToolTipPos] = useState({ left: 0, top: 0 });
  const [tooltipData, setTooltipData] = useState();
  const [activeTooltipData, setActiveTooltipData] = useState(null);

  const [tooltipEvent, setTooltipEvent] = useState({});
  const [expanded, setExpanded] = useState(expandable || false);
  const tooltipRef = useRef(null);
  const [hoveredYLabel, setHoveredYLabel] = useState(activeYLabel || null);
  const graphRef = useRef(null);
  const isInsideGraph = useRef(false);

  const tooltipEnabled = tooltip;

  useEffect(() => {
    const handleMouseEnterGraph = () => {
      isInsideGraph.current = true;
    };

    const handleMouseLeaveGraph = () => {
      isInsideGraph.current = false;
      setHoveredYLabel(activeYLabel);
      setEnableTooltip(false);
    };

    const graphElement = graphRef.current;
    if (graphElement) {
      graphElement.addEventListener("mouseenter", handleMouseEnterGraph);
      graphElement.addEventListener("mouseleave", handleMouseLeaveGraph);
    }

    return () => {
      if (graphElement) {
        graphElement.removeEventListener("mouseenter", handleMouseEnterGraph);
        graphElement.removeEventListener("mouseleave", handleMouseLeaveGraph);
      }
    };
  }, [activeYLabel]);

  const calculateTooltipPosition = (d, config) => {
    const svgId = `${graphType}-graph`;
    const graphRect = document.getElementById(svgId).getBoundingClientRect();
    const areaWidth = config.yScale.step();
    const maxBarValue = config.hoverRect
      ? graphType === "stack"
        ? d.maxPositiveAcc
        : d.maxValue
      : graphType === "group"
      ? d.positiveAcc
      : d.value < 0
      ? 0
      : d.value;
    const top =
      (config.graphType === "stack"
        ? graphRect.top + config.yScale(d?.label)
        : graphRect.top + config.yScale(d?.label)) +
      areaWidth / 2;

    const left =
      graphRect.left +
      graphRect.width -
      config.padding.right -
      config.padding.left -
      config.graphAreaW +
      config.xScale(maxBarValue < 0 ? 0 : maxBarValue);

    return { top, left };
  };

  const handleOnClick = (event, d, i) => {
    console.log("handleOnClick", event, d, i);
  };

  const handleMouseOver = (event, d, i) => {
    setHoveredYLabel(d.label);
    // console.log('handleMouseOver', event, d, i);
  };

  const handleMouseOut = (event, d, i) => {
    setHoveredYLabel(null);
    // console.log('handleMouseOut', event, d, i);
  };

  const handleMouseEnter = (event, d, config, i) => {
    setHoveredYLabel(d.label);
    if (tooltipEnabled) {
      setEnableTooltip(true);
      setTooltipEvent({
        event,
        d,
        i,
      });
      const tData = d?.data || d;
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
      setEnableTooltip(true);
      setTooltipEvent({
        event,
        d,
        i,
      });
      const tData = d?.data || d;
      setTooltipData({ data: tData, rawData: d?.rawData });
      const calculatedTooltipPos = calculateTooltipPosition(d, config);
      setToolTipPos({
        ...toolTipPos,
        ...calculatedTooltipPos,
      });
    }
  };

  const handleMouseLeave = (event, data, config, i) => {
    if (!isInsideGraph.current) {
      setHoveredYLabel(activeYLabel);
      if (event?.relatedTarget?.classList.contains("tooltip-anchor")) {
        return;
      }
      if (!hoveredYLabel) {
        setEnableTooltip(false);
        return;
      }
      const d = activeTooltipData;
      setTooltipEvent({});
      if (hoveredYLabel) {
        const tData = d.data || d;
        setTooltipData({ data: tData, rawData: d?.rawData });
        const calculatedTooltipPos = calculateTooltipPosition(d, config);
        setToolTipPos({
          ...calculatedTooltipPos,
        });
      }
    }
  };

  const handleOnLoad = (d, config, i) => {
    setActiveTooltipData({ ...d });
    setEnableTooltip(true);
    if (!tooltipEvent.event) {
      setTimeout(() => {
        if (hoveredYLabel) {
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
        className="graph-wrp"
        ref={graphRef}
      >
        {(!isExpanded || data?.title || chartTitle) && title && (
          <Styles.TitleContainer position={titlePosition}>
            <Styles.Title>{chartTitle || data?.title}</Styles.Title>
          </Styles.TitleContainer>
        )}
        <div>
          <button onClick={() => handleCategoryChange("post")}>POSTPAID</button>
          <button onClick={() => handleCategoryChange("pre")}>PREPAID</button>
          <button onClick={() => handleCategoryChange("total")}>TOTAL</button>
        </div>
        <Table
          data={filteredData.map((item) => {
            const filteredItem = {};
            Object.keys(item).forEach((header) => {
              if (
                header.startsWith(`${category}_`) ||
                header === "eng_market"
              ) {
                filteredItem[
                  header === "eng_market"
                    ? "eng_market"
                    : header.replace(`${category}_`, "").toUpperCase()
                ] = item[header];
              }
            });
            return filteredItem;
          })}
        />
        <TimelineSlider data={mockData.data} onDateChange={handleDateChange} />
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
          align="right"
          tooltipOffset={15}
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

  return <>{renderGraphWrap(false)}</>;
};

TableBarGraph.defaultProps = {
  padding: {
    left: 0,
    top: 0,
    bottom: 20,
    right: 5,
  },
};

TableBarGraph.propTypes = {
  // graphType : PropTypes.oneOf(["group", "stack"]),
  data: PropTypes.object.isRequired,

  //layouts
  yLabelAlignment: PropTypes.number,
  xLabelAlignment: PropTypes.number,
  padding: PropTypes.object,

  enableTextOverBar: PropTypes.bool,
  textOverBarColor: PropTypes.string,
  textOverBarFontSize: PropTypes.number,

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
  title: PropTypes.bool,
  enableThreshold: PropTypes.bool,
  showThresholdLabel: PropTypes.bool,
  thresholdValue: PropTypes.number,
  thresholdStroke: PropTypes.string,
  labelColor: PropTypes.string,
  enableDataLabel: PropTypes.bool,
  dataLabelPosition: PropTypes.oneOf(["top", "inside"]),
  dataLabelFontWeight: PropTypes.string,
  activeXLabel: PropTypes.string,
  activeYLabel: PropTypes.string,
  hideYAxis: PropTypes.bool,
  hideXAxis: PropTypes.bool,
  dataLabelFontSize: PropTypes.number,
  dataLabelColor: PropTypes.string,
};

export default TableBarGraph;
