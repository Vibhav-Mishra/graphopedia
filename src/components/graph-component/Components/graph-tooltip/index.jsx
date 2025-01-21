import React from "react";
import Proptypes from "prop-types";
import {
  LegendColor,
  LegendLabel,
  LegendValue,
  TooltipBody,
  TooltipBodyLabel,
  TooltipLegendContainer,
  TooltipLegendWrp,
  TooltipSubTitle,
  TooltipTitle,
  TooltipTitleValue,
  TooltipWrapper,
  TooltipBodyValue,
  LabelContainer,
  TooltipTitleColor,
} from "./index.sc";
import { colorBox } from "../../graphs/utils/graphConst";
import { formatNumber } from "../../graphs/utils/graphGrid";

const GraphTooltip = ({ tooltipData, formatValue, graphType, graphData }) => {
  if (!tooltipData) return;
  const type = graphData?.labels?.length > 1 ? "two-d" : "one-d";
  const labels = graphData?.labels;
  const { data, rawData } = tooltipData;
  let tooltip1d = {};
  let tooltip2d = {};

  if (type === "two-d") {
    tooltip2d = {
      title: graphData?.title,
      titleValue: rawData?.label,
      subTitle: graphData?.subtitle,
      subTitleValue: "",
      legendData: labels?.map((ele) => {
        return {
          label: ele?.label,
          value: formatValue
            ? formatNumber(rawData ? rawData[ele?.value] : 0)
            : rawData
            ? rawData[ele?.value]
            : 0,
          color: ele?.color,
        };
      }),
    };
  } else {
    tooltip1d = {
      label: data?.label || data?.properties?.NAME,
      value: formatValue
        ? formatNumber(data?.value || data?.properties?.value)
        : data?.value || data?.properties?.value,
      color: data?.color || data?.properties?.color,
    };
  }
  return (
    <>
      {type === "one-d" ? (
        <TooltipWrapper className="one-d">
          <LabelContainer>
            {graphType === "pie" ||
            graphType === "donut" ||
            graphType === "halfdonut" ? (
              <TooltipTitleColor
                bgColor={tooltip1d?.color || colorBox[i]}
              ></TooltipTitleColor>
            ) : null}

            <TooltipTitle>{tooltip1d?.label}</TooltipTitle>
          </LabelContainer>

          <TooltipBody>
            {/* <TooltipBodyLabel>Total Articles</TooltipBodyLabel> */}
            <TooltipBodyValue>{tooltip1d?.value}</TooltipBodyValue>
          </TooltipBody>
        </TooltipWrapper>
      ) : (
        <TooltipWrapper className="two-d">
          <TooltipTitle className="two-d">
            {tooltip2d?.title || "title"}
          </TooltipTitle>
          {tooltip2d?.titleValue && (
            <TooltipTitleValue>{tooltip2d?.titleValue}</TooltipTitleValue>
          )}
          {tooltip2d?.subTitle && (
            <TooltipSubTitle>{tooltip2d?.subTitle}</TooltipSubTitle>
          )}

          <TooltipLegendWrp>
            {tooltip2d?.legendData?.map((ele, i) => (
              <TooltipLegendContainer key={i}>
                <LegendColor bgColor={ele?.color || colorBox[i]}></LegendColor>
                <LegendLabel>{ele?.label}</LegendLabel>
                <LegendValue>{ele?.value && ele?.value}</LegendValue>
              </TooltipLegendContainer>
            ))}
          </TooltipLegendWrp>
        </TooltipWrapper>
      )}
    </>
  );
};

export default GraphTooltip;

GraphTooltip.propTypes = {
  type: Proptypes.string,
  tooltipData: Proptypes.object.isRequired,
  widget: Proptypes.object,
};
