import React from "react";
import PropTypes from "prop-types";
import CompetitionColumn from "../../graphs/CompetitionColumn";

const CompetitionColumnGraph = ({
  data,
  barPadding = 0.02,
  rankNumberFontSize = 30,
  rankNumberFontWeight = 700,
  rankNumberFontFamily = "Inter",
  rankNumberPositionY = 10,
  enableRankTextResizer = true,
  enableRankSorted = true,
  valueNumberFontSize = 14,
  valueNumberFontWeight = 600,
  valueNumberFontFamily = "Inter",
  valueNumberFontColor = "#000",
  unitNumberFontSize = 12,
  unitNumberFontWeight = 500,
  unitNumberFontFamily = "Inter",
  unitNumberFontColor = "#606080",
  unitNumberSpace = 21,
  companyFontSize = 10,
  companyFontWeight = 500,
  companyFontFamily = "Inter",
  companyFontColor = "#606080",
}) => {
  return (
    <CompetitionColumn
      data={data}
      config={{
        barPadding: barPadding,
        rankNumberFontSize: rankNumberFontSize,
        rankNumberFontWeight: rankNumberFontWeight,
        rankNumberFontFamily: rankNumberFontFamily,
        rankNumberPositionY: rankNumberPositionY,
        enableRankTextResizer: enableRankTextResizer,
        enableRankSorted:enableRankSorted,
        valueNumberFontSize: valueNumberFontSize,
        valueNumberFontWeight: valueNumberFontWeight,
        valueNumberFontFamily: valueNumberFontFamily,
        valueNumberFontColor: valueNumberFontColor,
        unitNumberFontSize: unitNumberFontSize,
        unitNumberFontWeight: unitNumberFontWeight,
        unitNumberFontFamily: unitNumberFontFamily,
        unitNumberFontColor: unitNumberFontColor,
        unitNumberSpace: unitNumberSpace,
        companyFontSize: companyFontSize,
        companyFontWeight: companyFontWeight,
        companyFontFamily: companyFontFamily,
        companyFontColor: companyFontColor,
      }}
    />
  );
};

export default CompetitionColumnGraph;

CompetitionColumnGraph.propTypes = {
  data: PropTypes.object.isRequired,
  barPadding: PropTypes.number,
  rankNumberFontSize: PropTypes.number,
  rankNumberFontWeight: PropTypes.number,
  rankNumberFontFamily: PropTypes.string,
  rankNumberPositionY: PropTypes.number,
  enableRankTextResizer: PropTypes.bool,
  enableRankSorted:PropTypes.bool,
  valueNumberFontSize: PropTypes.number,
  valueNumberFontWeight: PropTypes.number,
  valueNumberFontFamily: PropTypes.string,
  valueNumberFontColor: PropTypes.string,
  unitNumberFontSize: PropTypes.number,
  unitNumberFontWeight: PropTypes.number,
  unitNumberFontFamily: PropTypes.string,
  unitNumberFontColor: PropTypes.string,
  unitNumberSpace: PropTypes.number,
  companyFontSize: PropTypes.number,
  companyFontWeight: PropTypes.number,
  companyFontFamily: PropTypes.string,
  companyFontColor: PropTypes.string,
};
