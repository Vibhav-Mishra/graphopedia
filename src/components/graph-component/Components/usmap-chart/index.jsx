import { useEffect, useState } from "react";
import USMapChart from "../../graphs/USMap/graphWrapper.jsx";
import PropTypes from "prop-types";
import GraphLegends from "../legends";
import * as Styles from "./index.sc";

const USMapGraph = ({ data, ...props }) => {
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    setRerender(!rerender);
  }, [data]);

  const legendData = data?.data.map((item) => {
    return {
      label: item.label,
      color: item.color,
    };
  });

  const renderLegend = () => {
    return (
      props.legend && (
        <Styles.LegendSection legendPosition={props.legendPosition}>
          <GraphLegends
            legendData={legendData ? legendData : defaultLegendData}
            shape={props.legendIndicator}
          />
        </Styles.LegendSection>
      )
    );
  };

  return (
    <Styles.GraphWrap>
      {props.chartTitle && props.enableTitle && (
        <Styles.TitleContainer position={props.titlePosition}>
          <Styles.Title>{props.chartTitle || data?.title}</Styles.Title>
        </Styles.TitleContainer>
      )}
      <USMapChart
        data={data}
        config={{
          ...props,
        }}
      />
      {renderLegend()}
    </Styles.GraphWrap>
  );
};
USMapGraph.propTypes = {
  data: PropTypes.object,
  rerender: PropTypes.bool,
  resetSelection: PropTypes.bool,
};

export default USMapGraph;
