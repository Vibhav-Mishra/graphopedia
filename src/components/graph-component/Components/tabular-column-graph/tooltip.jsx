import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #fff;
`;

const Header = styled.div`
  font-size: ${(props) => `${props.fontSize}px` || "10px"};
  font-weight: ${(props) => props.fontWeight || "normal"};
  color: ${(props) => props.fontColor || "#000"};
  font-family: ${(props) => props.fontFamily || "Arial, sans-serif"};
  text-align: left;
  margin-bottom: 10px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
`;

const TypeLabel = styled.div`
  font-size: ${(props) => `${props.fontSize}px` || "10px"};
  font-weight: ${(props) => props.fontWeight || "normal"};
  color: ${(props) => props.fontColor || "#000"};
  font-family: ${(props) => props.fontFamily || "Arial, sans-serif"};
  display: flex;
  align-items: center;
  width: 70px;
`;

const DataLabel = styled.div`
  font-size: ${(props) => `${props.fontSize}px` || "10px"};
  font-weight: ${(props) => props.fontWeight || "normal"};
  color: ${(props) => props.fontColor || "#000"};
  font-family: ${(props) => props.fontFamily || "Arial, sans-serif"};
  display: flex;
  align-items: center;
  width: 50px;
`;

const ColorDot = styled.div`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 50%;
  margin-right: 5px;
`;

const CustomTooltip = ({ data, config }) => (
  <Container>
    <Header
      fontSize={config.tooltipHeaderFontSize}
      fontWeight={config.tooltipHeaderFontWeight}
      fontColor={config.tooltipHeaderFontColor}
      fontFamily={config.tooltipHeaderFontFamily}
    >
      {data?.month}
    </Header>
    <Row>
      <TypeLabel></TypeLabel>
      {data?.type1?.data.map((item, index) => (
        <DataLabel
          key={index}
          fontSize={config.tooltipNetworkTypeFontSize}
          fontWeight={config.tooltipNetworkTypeFontWeight}
          fontColor={config.tooltipNetworkTypeFontColor}
          fontFamily={config.tooltipNetworkTypeFontFamily}
        >
          <ColorDot
            style={{ backgroundColor: item.color }}
            size={config.colorDotSize}
          />
          {item.type}
        </DataLabel>
      ))}
    </Row>
    {Object.keys(data)
      .filter((key) => key.startsWith("type"))
      .map((typeKey) => {
        const typeData = data[typeKey];
        return (
          <Row key={typeKey}>
            <TypeLabel
              fontSize={config.tooltipLabelFontSize}
              fontWeight={config.tooltipLabelFontWeight}
              fontColor={config.tooltipLabelFontColor}
              fontFamily={config.tooltipLabelFontFamily}
            >
              {typeData.type}
            </TypeLabel>
            {typeData.data.map((item, index) => (
              <DataLabel
                key={index}
                fontSize={config.tooltipNetworkValueFontSize}
                fontWeight={config.tooltipNetworkValueFontWeight}
                fontColor={config.tooltipNetworkValueFontColor}
                fontFamily={config.tooltipNetworkValueFontFamily}
              >
                {item.value}%
              </DataLabel>
            ))}
          </Row>
        );
      })}
  </Container>
);

export default CustomTooltip;
