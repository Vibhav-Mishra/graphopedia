import styled from "styled-components";
import React, { useState, useRef } from "react";
import ScatterPlot from "../../graphs/ScatterPlot/graphWrapper.jsx";
import { GraphWrapScatter, LegendSection } from "./index.sc.js";
import GraphLegend from "../legends";
import PortalTooltip from "../portal-tooltip";
import GraphTooltip from "../graph-tooltip";

const ScatterComponent = ({
  data,
  legendData,
  graphType,
  legend,
  legendPosition,
  legendIndicator,
  legendLabelFontSize,
  tooltip,
  gridXYLabelFontSize,
  axesLabelColor,
  fontFamily,
  highlight,
  shape,
  strokeOnHover,
  hoverCircle,
  transformOnHover,
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
    console.log("handleOnClick", event, d, i);
  };

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
    defaultLegendData = data.legends.map((ele) => ({
      label: ele.label,
      value: ele.value,
      color: ele.color,
    }));
  } else {
    if (twoD) {
      defaultLegendData = data?.labels.map((ele) => ({
        label: ele?.label,
        value: ele?.label?.replaceAll(" ", "").toLowerCase(),
        color: ele?.color,
      }));
    } else {
      defaultLegendData = data?.data?.map((ele) => ({
        label: ele.label,
        value: ele.value,
        color: ele.color,
      }));
    }
  }

  const renderTooltip = () => {
    return (
      tooltip &&
      tooltipEnabled && (
        <PortalTooltip
          isOpen={true}
          pos={toolTipPos}
          tooltipOffset={10}
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
      legend &&
      defaultLegendData.length > 0 && (
        <LegendSection graphType={graphType} legendPosition={legendPosition}>
          <GraphLegend
            graphType={graphType}
            legendData={legendData ? legendData : defaultLegendData}
            legendLabelFontSize={legendLabelFontSize}
            shape={legendIndicator}
            legendPosition={legendPosition}
          />
        </LegendSection>
      )
    );
  };

  return (
    <GraphWrapScatter legendPosition={legendPosition}>
      {legend && legendPosition.includes("top") && renderLegend()}
      <ScatterPlot
        data={data}
        legendPosition={legendPosition}
        config={{
          gridXYLabelFontSize: gridXYLabelFontSize,
          axesLabelColor: axesLabelColor,
          fontFamily: fontFamily,
          ...events,
        }}
        highlight={highlight}
        shape={shape}
        strokeOnHover={strokeOnHover}
        hoverCircle={hoverCircle}
        transformOnHover={transformOnHover}
      />
      {legend && legendPosition.includes("bottom") && renderLegend()}
      {legend &&
        (legendPosition.includes("left") || legendPosition.includes("right")) &&
        renderLegend()}
      {renderTooltip()}
    </GraphWrapScatter>
  );
};

export default ScatterComponent;
