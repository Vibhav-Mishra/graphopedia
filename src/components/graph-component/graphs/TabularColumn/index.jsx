import React, { useEffect } from "react";
import styled from "styled-components";
import ColumnGraph from "./ColumnGraph";

const TableColumn = ({ data, config, events }) => {
  const types =
    data.length > 0
      ? Object.keys(data[0]).filter((key) => key.startsWith("type"))
      : [];

  const typesObj = Object.keys(data[0])
    .filter((key) => key.startsWith("type"))
    .map((key) => data[0][key].type);

  return (
    <Container>
      <StyledTable>
        <tbody>
          {types.map((typeKey, typeIndex) => (
            <StyledTr key={typeIndex}>
              <StyledTd>
                <div
                  style={{
                    fontSize: config.iconSize ? `${config.iconSize}px` : "24px",
                  }}
                  dangerouslySetInnerHTML={{ __html: data[0][typeKey].svgIcon }}
                />
                <StyledSpan
                  fontSize={config.typeFontSize}
                  fontWeight={config.typeFontWeight}
                  fontColor={config.typeFrontColor}
                  fontFamily={config.typeFrontFamily}
                  marginLeft={config.iconSpacing}
                >
                  {data[0][typeKey].type}
                </StyledSpan>
              </StyledTd>
              {data.map((item, monthIndex) => (
                <StyledTdData
                  key={monthIndex}
                  active={item.month === config.activeXLabel}
                  crossOver={
                    item.month === config.activeXLabel &&
                    typesObj.some(
                      (type, index) =>
                        index % 2 !== 0 && type === item[typeKey].type
                    )
                  }
                  tooltip={config.enableTooltip}
                  onMouseEnter={(event) => events.handleMouseEnter(event, item)}
                  onMouseMove={(event) => events.handleMouseMove(event, item)}
                  onMouseLeave={events.handleMouseLeave}
                >
                  <ColumnGraph data={item[typeKey].data} config={config} />
                </StyledTdData>
              ))}
            </StyledTr>
          ))}
        </tbody>
        <StyledTfoot>
          <tr>
            <th></th>
            {data.map((item, monthIndex) => (
              <StyledTh
                key={monthIndex}
                textSize={config.xAxisTextSize}
                textColor={config.xAxisTextColor}
                textWeight={config.xAxisTextWeight}
                textFamily={config.xAxisTextFamily}
                active={item.month === config.activeXLabel}
              >
                {item.month}
              </StyledTh>
            ))}
          </tr>
        </StyledTfoot>
      </StyledTable>
    </Container>
  );
};

export default TableColumn;

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
`;

const StyledTable = styled.table`
  width: 100%;
  height: 100%;
  border-collapse: collapse;
`;

const StyledTr = styled.tr`
  &:nth-of-type(even) {
    background-color: #f0f2f5;
  }
`;

const StyledTd = styled.td`
  display: flex;
  align-items: flex-end;
  height: 100%;
  padding-left: 10px;
  padding-top: 20px;
  padding-bottom: 30px;
  box-sizing: border-box;
`;

const StyledSpan = styled.span`
  margin-left: ${(props) => `${props.marginLeft}px` || "5px"};
  display: flex;
  align-items: flex-end;
  font-size: ${(props) =>
    `${props.fontSize}px` || "16px"}; /* Default size if not provided */
  font-weight: ${(props) =>
    props.fontWeight || "normal"}; /* Default weight if not provided */
  color: ${(props) =>
    props.fontColor || "#000"}; /* Default color if not provided */
  font-family: ${(props) =>
    props.fontFamily ||
    "Arial, sans-serif"}; /* Default font-family if not provided */
`;

const StyledTdData = styled.td`
  vertical-align: bottom;
  box-sizing: border-box;
  cursor: ${(props) => (props.tooltip ? "pointer" : "default")};
  background-color: ${(props) =>
    props.active ? (props.crossOver ? "#e4e9ef" : "#F0F2F5") : "transperent"};
`;

const StyledDiv = styled.div`
  background-color: ${(props) => props.color};
`;

const StyledTh = styled.th`
  font-size: ${(props) => `${props.textSize}px` || "10px"};
  color: ${(props) => (props.active ? "#000" : props.textColor || "#000")};
  font-weight: ${(props) =>
    props.active ? "600" : props.textWeight || "normal"};
  font-family: ${(props) => props.textFamily || "Arial, sans-serif"};
  /* padding: 8px; */
  font-style: normal;
  text-align: center;
  line-height: normal;
  text-transform: uppercase;
  /* Ensure consistent width */
  min-width: 50px; /* Adjust this value as needed */
  /* Optional: add padding to ensure spacing */
  padding: 8px;
  box-sizing: border-box;
`;

const StyledTfoot = styled.tfoot`
  box-sizing: border-box;
  th {
    padding: 5px;
  }
`;
