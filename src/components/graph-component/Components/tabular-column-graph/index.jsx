import TableColumn from "../../graphs/TabularColumn";
import PropTypes from "prop-types";
import PortalTooltip from "./PortalTooltip";
import CustomTooltip from "./tooltip";
import { useState, useRef, useEffect } from "react";
import { LegendSection, Section, GraphWrap } from "./index.sc";
import GraphLegend from "./GraphLegend";

const TabularColumnWraper = ({
  data,
  LegendData,
  barGap = 0.5,
  barWidth = 15,
  barAlignMentXOffset = 8,
  barAlignMentYOffset = 2,
  typeFontSize = 14,
  typeFontWeight = 500,
  typeFrontColor = "#707c8b",
  typeFrontFamily = "Inter",
  iconSize = 20,
  iconSpacing = 5,
  xAxisTextSize = 10,
  xAxisTextColor = "#707c8b",
  xAxisTextWeight = 600,
  xAxisTextFamily = "Inter",
  enableTooltip = true,
  colorDotSize = 10,
  activeXLabel = `Jul '24`,
  tooltipHeaderFontSize = 14,
  tooltipHeaderFontWeight = 700,
  tooltipHeaderFontColor = "#000",
  tooltipHeaderFontFamily = "Inter",
  tooltipNetworkTypeFontSize = 10,
  tooltipNetworkTypeFontWeight = 700,
  tooltipNetworkTypeFontColor = "#000",
  tooltipNetworkTypeFontFamily = "Inter",
  tooltipNetworkValueFontSize = 10,
  tooltipNetworkValueFontWeight = 700,
  tooltipNetworkValueFontColor = "#000",
  tooltipNetworkValueFontFamily = "Inter",
  tooltipLabelFontSize = 10,
  tooltipLabelFontWeight = 500,
  tooltipLabelFontColor = "#707c8b",
  tooltipLabelFontFamily = "Inter",
  enableLegend = true,
  legendIndicatorShape = "circle",
  legendPosition = "bottom",
  legendLabelFontSize = 11,
  legendLabelFontWeight = 600,
  legendLabelFontColor = "#707C8B",
  legendLabelFontFamily = "Inter",
}) => {
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    pos: { left: 0, top: 0 },
    content: "",
  });
  const [tooltipOffset, setTooltipOffset] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });
  const [changeActiveXLabel, setChangeActiveXLabel] = useState(activeXLabel);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const left = Math.round(container.getBoundingClientRect().width * 0.074);
      const right = Math.round(container.getBoundingClientRect().width * 0.074);
      const top = Math.round(container.getBoundingClientRect().height * 0.05);
      const bottom = Math.round(
        container.getBoundingClientRect().height * 0.13
      );
      setTooltipOffset({ left, right, top, bottom });
    }
    return () => {
      containerRef.current = null;
    };
  }, []);

  const handleMouseEnter = (event, eventData) => {
    event.preventDefault(); // Prevent any default action
    setTooltip({
      visible: true,
      pos: { left: event.clientX, top: event.clientY },
      content: eventData,
    });
    setChangeActiveXLabel(eventData.month);
  };

  const handleMouseMove = (event) => {
    event.preventDefault(); // Prevent any default action
    setTooltip((prev) => ({
      ...prev,
      pos: { left: event.clientX, top: event.clientY },
    }));
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, pos: { left: 0, top: 0 }, content: "" });
    setChangeActiveXLabel(activeXLabel);
  };

  const handleMouseClick = (event, d) => {
    // TODO
  };
  const events = {
    handleMouseClick,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
  };

  return (
    <Section ref={containerRef}>
      <LegendSection legendPosition={legendPosition}>
        <GraphWrap>
          <TableColumn
            data={data}
            config={{
              barGap: barGap,
              barWidth: barWidth,
              barAlignMentXOffset: barAlignMentXOffset,
              barAlignMentYOffset: barAlignMentYOffset,
              typeFontSize: typeFontSize,
              typeFontWeight: typeFontWeight,
              typeFrontColor: typeFrontColor,
              typeFrontFamily: typeFrontFamily,
              iconSize: iconSize,
              iconSpacing: iconSpacing,
              xAxisTextSize: xAxisTextSize,
              xAxisTextColor: xAxisTextColor,
              xAxisTextWeight: xAxisTextWeight,
              xAxisTextFamily: xAxisTextFamily,
              enableTooltip: enableTooltip,
              activeXLabel: changeActiveXLabel,
            }}
            events={{ ...events }}
          />
          {enableTooltip && (
            <PortalTooltip
              isOpen={tooltip?.visible}
              pos={tooltip?.pos}
              align={
                tooltip?.pos?.left > window.innerWidth / 2 ? "left" : "right"
              }
              vAlign={
                tooltip?.pos?.top > window.innerHeight / 2 ? "top" : "bottom"
              }
              tooltipOffset={tooltipOffset}
            >
              <CustomTooltip
                data={tooltip.content}
                config={{
                  colorDotSize: colorDotSize,
                  // header
                  tooltipHeaderFontSize: tooltipHeaderFontSize,
                  tooltipHeaderFontWeight: tooltipHeaderFontWeight,
                  tooltipHeaderFontColor: tooltipHeaderFontColor,
                  tooltipHeaderFontFamily: tooltipHeaderFontFamily,
                  // network
                  tooltipNetworkTypeFontSize: tooltipNetworkTypeFontSize,
                  tooltipNetworkTypeFontWeight: tooltipNetworkTypeFontWeight,
                  tooltipNetworkTypeFontColor: tooltipNetworkTypeFontColor,
                  tooltipNetworkTypeFontFamily: tooltipNetworkTypeFontFamily,
                  // value
                  tooltipNetworkValueFontSize: tooltipNetworkValueFontSize,
                  tooltipNetworkValueFontWeight: tooltipNetworkValueFontWeight,
                  tooltipNetworkValueFontColor: tooltipNetworkValueFontColor,
                  tooltipNetworkValueFontFamily: tooltipNetworkValueFontFamily,
                  // label
                  tooltipLabelFontSize: tooltipLabelFontSize,
                  tooltipLabelFontWeight: tooltipLabelFontWeight,
                  tooltipLabelFontColor: tooltipLabelFontColor,
                  tooltipLabelFontFamily: tooltipLabelFontFamily,
                }}
              />
            </PortalTooltip>
          )}
        </GraphWrap>
        {enableLegend && (
          <GraphLegend
            legendData={LegendData}
            shape={legendIndicatorShape}
            legendPosition={legendPosition}
            legendLabelFontSize={legendLabelFontSize}
            legendLabelFontWeight={legendLabelFontWeight}
            legendLabelFontFamily={legendLabelFontFamily}
            legendLabelFontColor={legendLabelFontColor}
          />
        )}
      </LegendSection>
    </Section>
  );
};

// Define prop types
TabularColumnWraper.propTypes = {
  data: PropTypes.object.isRequired,
  LegendData: PropTypes.object.isRequired,
  barGap: PropTypes.number,
  barWidth: PropTypes.number,
  barAlignMentXOffset: PropTypes.number,
  barAlignMentYOffset: PropTypes.number,
  //   type
  typeFontSize: PropTypes.number,
  typeFontWeight: PropTypes.number,
  typeFrontColor: PropTypes.string,
  typeFrontFamily: PropTypes.string,
  //   icon
  iconSize: PropTypes.number,
  iconSpacing: PropTypes.number,
  //   xaxis
  xAxisTextSize: PropTypes.number,
  xAxisTextColor: PropTypes.string,
  xAxisTextWeight: PropTypes.number,
  xAxisTextFamily: PropTypes.string,

  //   tooltip
  enableTooltip: PropTypes.bool,
  colorDotSize: PropTypes.number,
  // header
  tooltipHeaderFontSize: PropTypes.number,
  tooltipHeaderFontWeight: PropTypes.number,
  tooltipHeaderFontColor: PropTypes.string,
  tooltipHeaderFontFamily: PropTypes.string,
  // network
  tooltipNetworkTypeFontSize: PropTypes.number,
  tooltipNetworkTypeFontWeight: PropTypes.number,
  tooltipNetworkTypeFontColor: PropTypes.string,
  tooltipNetworkTypeFontFamily: PropTypes.string,
  // value
  tooltipNetworkValueFontSize: PropTypes.number,
  tooltipNetworkValueFontWeight: PropTypes.number,
  tooltipNetworkValueFontColor: PropTypes.string,
  tooltipNetworkValueFontFamily: PropTypes.string,
  // label
  tooltipLabelFontSize: PropTypes.number,
  tooltipLabelFontWeight: PropTypes.number,
  tooltipLabelFontColor: PropTypes.string,
  tooltipLabelFontFamily: PropTypes.string,
  //   highlight
  activeXLabel: PropTypes.string,
  // legend
  enableLegend: PropTypes.bool,
  legendIndicatorShape: PropTypes.oneOf(["circle", "rect"]),
  legendPosition: PropTypes.oneOf(["left", "right", "top", "bottom"]),
  legendLabelFontSize: PropTypes.number,
  legendLabelFontWeight: PropTypes.number,
  legendLabelFontColor: PropTypes.string,
  legendLabelFontFamily: PropTypes.string,
};

export default TabularColumnWraper;
