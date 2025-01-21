import ButterFlyGraphCustom from "../../graphs/ButterflyCustom/graphWrapper.jsx";
// import { data } from "./butterflyData.js";
import {
  GraphWrapButterfly,
  TitleContainer,
  Title,
  LegendSection,
  GraphWrapper,
} from "./index.sc.js";
import GraphLegend from "../legends/index.jsx";
import PortalTooltip from "../portal-tooltip/index.jsx";
import { useState } from "react";
import NewGraphTooltip from "../new-graph-tooltip/index.jsx";

const ButterflyCustom = ({
  data,
  chartTitle,
  graphType,
  barBackGroundColor,
  barHeight,
  labelFontSize,
  iconSize,
  iconSpacing,
  title,
  titlePosition,
  titleFontSize,
  legend,
  legendPosition,
  legendIndicator,
  legendLabelFontSize,
  valueFontSize,
  labelFontWeight,
  valueFontWeight,
  categoryFontSize,
  categoryFontWeight,
  fontFamilyLabel,
  fontFamilyValue,
  CenterGap,
  TextGap,
  isPercent,
  backgroundOpacityShow,
  backgroundOpacity,
  barInnerPadding,
  //   labelValueGap,
  //   TextTopMargin,
  labelColor,
  valueColor,
  categoryColor,
  textalignmentXaxis,
  textalignmentYaxis,
  customBarHeight,
  subTitleGap,
}) => {
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
      // Filter out entries with the same color
      const uniqueColors = {};
      defaultLegendData = data
        ?.filter((ele) => {
          if (!uniqueColors[ele.color]) {
            uniqueColors[ele.color] = true;
            return true;
          }
          return false;
        })
        .map((ele) => ({
          label: ele?.quality,
          color: ele?.color,
        }));
    }
  }
  const renderLegend = () => {
    return (
      legend && (
        <LegendSection
          graphType={graphType}
          legendPosition={legendPosition}
          // title={title}
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

  const [toolTipPos, setToolTipPos] = useState({ top: 0, left: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState({});

  const handleMouseEnter = (xPos, yPos, graphData, group) => {
    setShowTooltip(true);
    const transformedData = {
      title: graphData?.category,
      subTitle: graphData?.label,
      labels: {
        label: graphData?.category,
        value: graphData?.value,
        color: graphData?.color,
      },
    };
    setTooltipData(transformedData);

    setToolTipPos({ top: yPos, left: xPos });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setToolTipPos({ top: 0, left: 0 });
  };

  const renderTooltip = () => {
    return (
      showTooltip && (
        <PortalTooltip isOpen={true} pos={toolTipPos} tooltipOffset={30}>
          <div
            className="tooltip"
            style={{
              position: "relative",
            }}
          >
            <NewGraphTooltip data={tooltipData} />
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

  return (
    <GraphWrapButterfly>
      {title && (
        <TitleContainer position={titlePosition}>
          <Title titleFontSize={titleFontSize}>
            {" "}
            {chartTitle || data?.title}
          </Title>
        </TitleContainer>
      )}
      <GraphWrapper legendPosition={legendPosition}>
        {legend && legendPosition.includes("top") && renderLegend()}
        <ButterFlyGraphCustom
          data={data}
          events={{
            handleMouseEnter,
            handleMouseLeave,
          }}
          graphType={graphType}
          barBackGroundColor={barBackGroundColor}
          barHeight={barHeight}
          labelFontSize={labelFontSize}
          iconSize={iconSize}
          iconSpacing={iconSpacing}
          valueFontSize={valueFontSize}
          labelFontWeight={labelFontWeight}
          valueFontWeight={valueFontWeight}
          categoryFontSize={categoryFontSize}
          categoryFontWeight={categoryFontWeight}
          fontFamilyLabel={fontFamilyLabel}
          fontFamilyValue={fontFamilyValue}
          CenterGap={CenterGap}
          TextGap={TextGap}
          isPercent={isPercent}
          backgroundOpacityShow={backgroundOpacityShow}
          backgroundOpacity={backgroundOpacity}
          barInnerPadding={barInnerPadding}
          //   labelValueGap={labelValueGap}
          labelColor={labelColor}
          valueColor={valueColor}
          //   TextTopMargin={TextTopMargin}
          categoryColor={categoryColor}
          textalignmentXaxis={textalignmentXaxis}
          textalignmentYaxis={textalignmentYaxis}
          legendPosition={legendPosition}
          customBarHeight={customBarHeight}
          subTitleGap={subTitleGap}
        />
        {legend && legendPosition.includes("bottom") && renderLegend()}
        {legend &&
          (legendPosition.includes("left") ||
            legendPosition.includes("right")) &&
          renderLegend()}
        {renderTooltip()}
      </GraphWrapper>
    </GraphWrapButterfly>
  );
};

export default ButterflyCustom;
