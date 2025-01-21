import React, { useState, useRef } from "react";
import BigBubble from "../../graphs/BigBubble/graphWrapper.jsx";
// import { bubbleGraphData } from "../../graphs/utils/mockData.js";
import PortalTooltip from "../portal-tooltip";
import GraphTooltip from "../graph-tooltip";
import GraphLegend from "../legends";
import styled from "styled-components";
// import PropTypes from "prop-types";
import { LegendSection } from "./index.sc.js";
// import { useEffect } from "react";

const BubbleComponent = ({
  data,
  tooltip,
  highlight,
  graphType,
  title,
  titlePosition,
  titleFontSize,
  legend,
  legendPosition = "bottom",
  legendIndicator = "square",
  legendLabelFontSize,
  forceEnable,
  spaceBetweenCircle,
  hoverCircle,
  strokeOnHover,
  enableSubHeading = true,
  subHeaderTitlePosition = "center",
  subHeaderFontSize = 10,
  subHeaderFontWeight = 600,
  subHeaderFontColor = "#868686",
  subHeaderValueFontSize = 20,
  subHeaderValueFontWeight = 600,
  subHeaderValueFontColor = "#000",
}) => {
  const [enableTooltip, setEnableTooltip] = useState(true);
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

  const [force, setForce] = useState(forceEnable);
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
  const defaultLegendData = [];

  data.data.forEach((item) => {
    const existingLegendItem = defaultLegendData.find(
      (legend) => legend.color === item.color
    );

    if (existingLegendItem) {
      existingLegendItem.labels.push(item.market);
    } else {
      defaultLegendData.push({
        color: item.color,
        labels: ["Positive", "Negative", "Neutral", item.market],
      });
    }
  });

  const renderLegend = () => {
    return (
      legend && (
        <LegendSection
          graphType={graphType}
          legendPosition={legendPosition}
          title={title}
        >
          <GraphLegend
            graphType={graphType}
            legendData={defaultLegendData}
            shape={legendIndicator}
            legendPosition={legendPosition}
            legendLabelFontSize={legendLabelFontSize}
          />
        </LegendSection>
      )
    );
  };
  return (
    <>
      {graphType && (
        <TitleContainer position={titlePosition}>
          {title && <Title titleFontSize={titleFontSize}>{graphType}</Title>}
        </TitleContainer>
      )}
      <GraphWrapper
        style={{ overflow: "hidden" }}
        className="main-wrapper "
        highlight={highlight ? highlight : false}
        legendPosition={legendPosition}
        legend={legend}
        titleHeight={graphType ? 20 + 15 : 0}
        legendLabelFontSize={legendLabelFontSize ? 20 + 15 : 0}
      >
        {legendPosition === "top" && renderLegend()}

        {enableSubHeading && (
          <SubTitleContainer position={subHeaderTitlePosition}>
            {data?.info && data?.info[0]?.subHeading && (
              <SubTitle
                titleFontSize={subHeaderFontSize}
                titleFontWeight={subHeaderFontWeight}
                fontColor={subHeaderFontColor}
              >
                {data.info[0].subHeading}
              </SubTitle>
            )}
            {data?.info && data?.info[0]?.value && (
              <SubTitle
                titleFontSize={subHeaderValueFontSize}
                titleFontWeight={subHeaderValueFontWeight}
                fontColor={subHeaderValueFontColor}
              >
                {data.info[0].value.toLocaleString()}
              </SubTitle>
            )}
          </SubTitleContainer>
        )}

        <BigBubble
          data={data}
          config={{
            ...events,
            forceEnable: forceEnable,
            spaceBetweenCircle: spaceBetweenCircle,
            legendPosition: legendPosition,
            legend: legend,
          }}
          hoverCircle={hoverCircle}
          strokeOnHover={strokeOnHover}
        />

        {renderTooltip()}
        {legendPosition === "bottom" && renderLegend()}
        {(legendPosition === "left" || legendPosition === "right") &&
          renderLegend()}
      </GraphWrapper>
    </>
  );
};

export default BubbleComponent;

const GraphWrapper = styled.div`
  width: 100%;
  height: ${({ titleHeight }) => `calc(100% - ${titleHeight}px)`};
  display: flex;
  flex-direction: ${(props) =>
    props.legendPosition === "right"
      ? "row"
      : props.legendPosition === "left"
      ? "row-reverse"
      : "column"};
  justify-content: center;
  margin-top: ${(props) =>
    props.legendPosition == "bottom" && props.legend ? "3rem" : "none"};
  align-items: center;
  .tooltip {
    position: absolute;
    transition: left 0.3s ease-out, top 0.3s ease-out;
  }
  /* gap:3rem; */
  .graph-wrp {
    width: 100% !important;
    height: 100% !important;
    display: flex;
    justify-content: center;
  }

  ${({ expanded }) =>
    expanded &&
    `
      padding: 3%;
      // padding-left: calc(15% - 30px);
    `}
  ${({ highlight }) =>
    highlight &&
    `
  .selected {
    transition: all 400ms ease;
    opacity: 1 !important;
  }

  .unselected {
    transition: all 400ms ease;
    opacity: 0.2 !important;
  }

  .hover-selected {
    transition: all 400ms ease;
    opacity: 1 !important;
  }
  .hover-unselected {
    transition: all 400ms ease;
    opacity: 0.2 !important;
  }
  `}
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: ${({ position }) =>
    position === "right"
      ? "flex-end"
      : position === "center"
      ? "center"
      : "flex-start"};
`;

const Title = styled.h3`
  font-size: 0.875rem;
  font-size: ${({ titleFontSize }) =>
    titleFontSize ? `${titleFontSize}px` : "0.825rem"};
  line-height: 20px;
  color: rgb(61, 94, 115);
  font-weight: 600;
  letter-spacing: 0px;
`;
const SubTitleContainer = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: ${({ position }) =>
    position === "right"
      ? "flex-end"
      : position === "center"
      ? "center"
      : "flex-start"};
  align-items: center;
  flex-direction: column;
  gap: 0;
`;

const SubTitle = styled.div`
  font-size: ${({ titleFontSize }) =>
    titleFontSize ? `${titleFontSize}px` : "0.825rem"};
  color: ${({ fontColor }) => fontColor || "rgb(61, 94, 115)"};
  font-weight: ${({ titleFontWeight }) =>
    titleFontWeight ? titleFontWeight : 600};
`;
