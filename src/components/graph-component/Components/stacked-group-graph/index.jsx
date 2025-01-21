import StackedGroupColumn from "../../graphs/StackedGroupColumn/graphWrapper";
import {
  LegendWrapper,
  StackedGroupGraphContainer,
  SvgWrapper,
  TitleContainer,
  Title,
} from "./index.sc";
import GraphLegends from "../legends";
import PortalTooltip from "../portal-tooltip";
import GraphTooltip from "../graph-tooltip/index.jsx";
import { useState } from "react";
import NewGraphTooltip from "../new-graph-tooltip/index.jsx";

const StackedGroup = ({
  data,
  chartTitle,
  title,
  titlePosition,
  titleFontSize,
  topSpace,
  graphType,
  bottomTextSpace,
  gapBetweenGroups,
  strokeColor,
  labelFontSize,
  labelFontWeight,
  labelFontFamily,
  labelalignmentXaxis,
  labelalignmentYaxis,
  groupLabelFontSize,
  groupLabelFontWeight,
  groupLabelFontFamily,
  cursorPointerShow,
  groupWidth,
  padding,
  paddingOuter,
  labelColor,
  groupLabelColor,
  legend,
  legendPosition,
  legendIndicator,
  legendLabelFontSize,
  highlight,
}) => {
  const [toolTipPos, setToolTipPos] = useState({ top: 0, left: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState({});

  const legendData = Object.entries(data.colors).map(([key, value]) => {
    return {
      label: key,
      color: value,
    };
  });

  const handleMouseEnter = (xPos, yPos, graphData, group) => {
    setShowTooltip(true);
    const transformedData = {
      title: graphData?.label,
      subTitle: group,
      labels: Object.entries(graphData)
        .filter((item) => item[0] !== "label")
        .map(([key, value]) => {
          return {
            label: key,
            value: value,
            color: data.colors[key],
          };
        }),
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

  const renderLegend = () => {
    return (
      legend && (
        <LegendWrapper
          graphType={graphType}
          legendPosition={legendPosition}
          title={title}
        >
          <GraphLegends
            graphType={graphType}
            legendData={legendData}
            shape={legendIndicator}
            legendPosition={legendPosition}
            legendLabelFontSize={legendLabelFontSize}
          />
        </LegendWrapper>
      )
    );
  };

  return (
    <StackedGroupGraphContainer title={title}>
      {title && (
        <TitleContainer position={titlePosition}>
          <Title titleFontSize={titleFontSize}>
            {chartTitle || data?.title}
          </Title>
        </TitleContainer>
      )}
      <SvgWrapper legendPosition={legendPosition}>
        {legend && legendPosition.includes("top") && renderLegend()}
        <StackedGroupColumn
          data={data}
          events={{
            handleMouseEnter: handleMouseEnter,
            handleMouseLeave: handleMouseLeave,
          }}
          topSpace={topSpace}
          bottomTextSpace={bottomTextSpace}
          gapBetweenGroups={gapBetweenGroups}
          strokeColor={strokeColor}
          labelFontSize={labelFontSize}
          labelFontWeight={labelFontWeight}
          labelFontFamily={labelFontFamily}
          labelalignmentXaxis={labelalignmentXaxis}
          labelalignmentYaxis={labelalignmentYaxis}
          groupLabelFontSize={groupLabelFontSize}
          groupLabelFontWeight={groupLabelFontWeight}
          groupLabelFontFamily={groupLabelFontFamily}
          cursorPointerShow={cursorPointerShow}
          groupWidth={groupWidth}
          padding={padding}
          paddingOuter={paddingOuter}
          labelColor={labelColor}
          groupLabelColor={groupLabelColor}
          legendPosition={legendPosition}
          highlight={highlight}
        />
        {legend && legendPosition.includes("bottom") && renderLegend()}
        {legend &&
          (legendPosition.includes("left") ||
            legendPosition.includes("right")) &&
          renderLegend()}
        {renderTooltip()}
      </SvgWrapper>
    </StackedGroupGraphContainer>
  );
};

export default StackedGroup;
