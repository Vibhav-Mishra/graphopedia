import { useEffect, useState } from "react";
import Radar from "../../graphs/Radar/graphWrapper.jsx";
import PropTypes from "prop-types";
import GraphLegends from "../legends";
import * as Styles from "./index.sc";

const RadarGraph = ({
  data,

  ...props
}) => {
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
      <Radar
        data={data}
        config={{
          backgroundType: props.radarType,
          ...props,
        }}
      />
      {renderLegend()}
    </Styles.GraphWrap>
  );
};
RadarGraph.propTypes = {
  data: PropTypes.object,
  radarType: PropTypes.oneOf(["circle", "polygon"]),
  rerender: PropTypes.bool,
  resetSelection: PropTypes.bool,
};

export default RadarGraph;
