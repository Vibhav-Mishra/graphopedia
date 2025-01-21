// src/components/TreeMapComponent.jsx
import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import TreeMap from "../../graphs/TreeMap/TreeMapWrapper";
import {
    GraphWrap,
    Section,
    Title,
    TitleContainer,
    TooltipSubHeader,
    TooltipTop,
    TooltipBottom,
    TooltipWrapper,
    TooltipHeader,
    LegendSection,
} from "./index.sc";
import PortalTooltip from "./PortalTooltip";
import { extractUniqueLabelsAndColors, getParentLabel } from "./utils";
import GraphLegend from "./GraphLegend";

const TreeMapComponent = ({
    data,
    tile = "treemapResquarify",
    titlePosition = "left",
    chartTitle = "Tree Map",
    defaultTreeColor = "#1D2573",
    isDefaultTreeColor = false,
    noChildrenOpacity = 0.7,
    TextAnchorTypeX = "middle",
    TextAnchorTypeY = "middle",
    textSize = 10.36,
    textColor = "#ffffff",
    textFontWeight = 300,
    showValue = false,
    valueTextSize = 14.5,
    valueTextColor = "#ffffff",
    valueTextFontWeight = 400,
    paddingInner = -2,
    paddingOuter = 4,
    valueType = "value",
    showValueType = "value",
    animationDuration = 1000,
    animationDurationText = 0,
    enableTooltip = false,
    highlightRect = false,
    enableLegend = false,
    legendIndicatorShape = "rect",
    legendPosition = "bottom",
    legendLabelFontSize = 10,
    legendLabelFontWeight = 400,
    tooltipHeaderFontColor = "#000",
    tooltipSubheaderFontColor = "#000",
    tooltipValueFontColor = "#000",
    tooltipHeaderFontSize = 10,
    tooltipSubheaderFontSize = 9,
    tooltipValueFontSize = 14,
    tooltipHeaderFontWeight = 500,
    tooltipSubheaderFontWeight = 400,
    tooltipValueFontWeight = 500,

}) => {
    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    const containerRef = useRef(null);
    const containerRefH = useRef(null)
    const [tooltip, setTooltip] = useState({ visible: false, pos: { left: 0, top: 0 }, content: "" });
    const [currentData, setCurrentData] = useState(data);
    // const [parentLabel, setParentLabel] = useState("");
    const [tooltipOffset, setTooltipOffset] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
    const uniqueLabelsAndColors = extractUniqueLabelsAndColors(currentData, defaultTreeColor, isDefaultTreeColor);

    const handleMouseEnter = (event, eventData) => {
        // setParentLabel(getParentLabel(data, eventData))
        setTooltip({ visible: true, pos: { left: event.clientX, top: event.clientY }, content: eventData });
    };

    const handleMouseMove = (event) => {
        setTooltip((prev) => ({ ...prev, pos: { left: event.clientX, top: event.clientY } }));
    };

    const handleMouseLeave = () => {
        setTooltip({ visible: false, pos: { left: 0, top: 0 }, content: "" });
    };

    const handleMouseClick = (event, d) => {
        if (d?.data?.children) {
            setCurrentData({ label: d?.data?.label, children: d?.data?.children });

        }
    }

    useEffect(() => {
        const container = containerRef.current;
        const containerH = containerRefH.current;
        if (container && containerH) {
            const left = Math.round(container.getBoundingClientRect().width * 0.074)
            const right = Math.round(container.getBoundingClientRect().width * 0.074)
            const top = Math.round(containerH.getBoundingClientRect().height * 0.05)
            const bottom = Math.round(containerH.getBoundingClientRect().height * 0.13)
            setTooltipOffset({ left, right, top, bottom });

            setHeight(containerH.getBoundingClientRect().height);
            setWidth(container.getBoundingClientRect().width);
        }
        return () => {
            containerRef.current = null;
        };
    }, []);

    return (
        <Section ref={containerRefH}>
            <TitleContainer position={titlePosition}>
                <Title>{chartTitle}</Title>
            </TitleContainer>
            <LegendSection legendPosition={legendPosition}>
                <GraphWrap ref={containerRef}>
                    <TreeMap
                        defaultTreeColor={defaultTreeColor}
                        isDefaultTreeColor={isDefaultTreeColor}
                        noChildrenOpacity={noChildrenOpacity}
                        data={currentData}
                        width={width}
                        height={height}
                        TextAnchorTypeX={TextAnchorTypeX}
                        textSize={textSize}
                        textColor={textColor}
                        TextAnchorTypeY={TextAnchorTypeY}
                        textFontWeight={textFontWeight}
                        showValue={showValue}
                        valueTextSize={valueTextSize}
                        valueTextColor={valueTextColor}
                        valueTextFontWeight={valueTextFontWeight}
                        paddingInner={paddingInner}
                        paddingOuter={paddingOuter}
                        valueType={valueType}
                        showValueType={showValueType}
                        animationDurationText={animationDurationText}
                        animationDuration={animationDuration}
                        tile={tile}
                        onMouseEnter={handleMouseEnter}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        onMouseClick={handleMouseClick}
                        enableTooltip={enableTooltip}
                        highlightRect={highlightRect}
                        legendPosition={legendPosition}
                        enableLegend={enableLegend}
                    />
                    {tooltip?.visible && enableTooltip && (
                        <PortalTooltip
                            isOpen={tooltip?.visible}
                            pos={tooltip?.pos}
                            align={tooltip?.pos?.left > window.innerWidth / 2 ? "left" : "right"}
                            vAlign={tooltip?.pos?.top > window.innerHeight / 2 ? "top" : "bottom"}
                            tooltipOffset={tooltipOffset}
                        >
                            <TooltipWrapper>
                                <TooltipTop>
                                    <TooltipSubHeader
                                        color={tooltipSubheaderFontColor}
                                        weight={tooltipSubheaderFontWeight}
                                        size={tooltipSubheaderFontSize}
                                    >{currentData?.label && currentData?.label}</TooltipSubHeader>
                                    <TooltipHeader
                                        color={tooltipHeaderFontColor}
                                        weight={tooltipHeaderFontWeight}
                                        size={tooltipHeaderFontSize}
                                    >{tooltip?.content?.label}</TooltipHeader>
                                </TooltipTop>
                                <TooltipBottom
                                    color={tooltipValueFontColor}
                                    weight={tooltipValueFontWeight}
                                    size={tooltipValueFontSize}
                                >
                                    {tooltip?.content?.[showValueType] && tooltip?.content?.[showValueType] + (showValueType === "value" ? tooltip?.content?.unit && tooltip?.content?.unit : "")}
                                </TooltipBottom>
                            </TooltipWrapper>
                        </PortalTooltip>
                    )}
                </GraphWrap>
                {enableLegend
                    &&
                    <GraphLegend
                        legendData={uniqueLabelsAndColors}
                        shape={legendIndicatorShape}
                        legendPosition={legendPosition}
                        legendLabelFontSize={legendLabelFontSize}
                        legendLabelFontWeight={legendLabelFontWeight}
                    />
                }
            </LegendSection>
        </Section>
    );
};

TreeMapComponent.propTypes = {
    data: PropTypes.object.isRequired,
    defaultTreeColor: PropTypes.string,
    isDefaultTreeColor: PropTypes.bool,
    noChildrenOpacity: PropTypes.number,
    titlePosition: PropTypes.oneOf(["left", "center", "right"]),
    tile: PropTypes.oneOf(["treemapBinary", "treemapDice", "treemapResquarify", "treemapSlice", "treemapSliceDice", "treemapSquarify"]),
    chartTitle: PropTypes.string,
    TextAnchorTypeX: PropTypes.oneOf(["start", "end", "middle"]),
    TextAnchorTypeY: PropTypes.oneOf(["top", "bottom", "middle"]),
    textSize: PropTypes.number,
    textColor: PropTypes.string,
    textFontWeight: PropTypes.number,
    showValue: PropTypes.bool,
    valueTextSize: PropTypes.number,
    valueTextColor: PropTypes.string,
    valueTextFontWeight: PropTypes.number,
    paddingInner: PropTypes.number,
    paddingOuter: PropTypes.number,
    valueType: PropTypes.oneOf(["value", "count"]),
    showValueType: PropTypes.oneOf(["value", "count"]),
    animationDuration: PropTypes.number,
    animationDurationText: PropTypes.number,
    enableTooltip: PropTypes.bool,
    highlightRect: PropTypes.bool,
    enableLegend: PropTypes.bool,
    legendIndicatorShape: PropTypes.oneOf(["circle", "rect"]),
    legendPosition: PropTypes.oneOf(["left", "right", "top", "bottom"]),
    legendLabelFontSize: PropTypes.number,
    legendLabelFontWeight: PropTypes.number,
};

export default TreeMapComponent;

