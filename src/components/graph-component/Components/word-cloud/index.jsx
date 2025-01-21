import React from "react";
import WordCloud from "../../graphs/WordCloud/graphWrapper.jsx";
import PropTypes from "prop-types";
import { Title, TitleContainer, Wrapper } from "./index.sc.js";
const WordCloudComponent = ({
  data,
  minFontSize,
  maxFontSize,
  fontWeight,
  rotateAngle,
  rotateAlternate,
  rotateRandom,
  maxNumberOfData,
  padding,
  chartTitle,
  titlePosition = "center",
}) => {
  return (
    <>
      <Wrapper>
        {chartTitle && (
          <TitleContainer position={titlePosition}>
            <Title>{chartTitle}</Title>
          </TitleContainer>
        )}
        <WordCloud
          data={data}
          config={{
            minFontSize,
            maxFontSize,
            isBold: true,
            rotateAngle,
            rotateRandom,
            rotateAlternate,
            fontWeight,
            maxNumberOfData,
            padding,
          }}
        />
      </Wrapper>
    </>
  );
};

WordCloudComponent.propTypes = {
  data: PropTypes.object.isRequired,
  minFontSize: PropTypes.number,
  maxFontSize: PropTypes.number,
  rotateAngle: PropTypes.number,
  rotateRandom: PropTypes.bool,
  rotateAlternate: PropTypes.bool,
  maxNumberOfData: PropTypes.number,
  padding: PropTypes.number,
  fontWeight: PropTypes.number,
};

export default WordCloudComponent;
