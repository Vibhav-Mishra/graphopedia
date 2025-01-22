import React, { useState } from "react";
import { cities } from "../data/cityData";
import BarGraph from "../graph-component/Components/bar-graph";
import ColumnGraph from "../graph-component/Components/column-graph";
import { columnData } from "../graph-component/Components/column-graph/columnData";

import {
  PageContainer,
  Header,
  HeaderTitle,
  HamburgerIcon,
  Menu,
  MenuItem,
  Content,
  Hexagon,
  CityList,
  GraphBox,
  GraphWrapper,
} from "./index.sc";

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  const handleMenuSelect = () => {
    setSelectedOption(true);
    setMenuOpen(false);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  return (
    <PageContainer>
      {/* Header */}
      <Header>
        <HamburgerIcon onClick={handleMenuToggle}>☰</HamburgerIcon>
        <HeaderTitle>Graphopedia</HeaderTitle>
        {menuOpen && (
          <Menu>
            <MenuItem onClick={handleMenuSelect}>USA Market</MenuItem>
          </Menu>
        )}
      </Header>

      {/* Main Content */}
      <Content>
        {selectedOption && (
          <CityList>
            {cities.map((city) => (
              <Hexagon key={city.name} onClick={() => handleCitySelect(city)}>
                {city.name}
              </Hexagon>
            ))}
          </CityList>
        )}

        {/* Graph Section */}
        {selectedCity && (
          <GraphBox>
            <GraphWrapper>
              <BarGraph
                data={{ data: columnData.data }}
                tooltip={true}
                legend={true}
                chartTitle={`Bar Graph - ${selectedCity.name}`}
                legendPosition="top-center"
                barSize={20}
                enableGridXLine={true}
                enableGridYLine={true}
                enableThreshold={true}
                thresholdValue={50}
                padding={{ left: 10, right: 10, top: 20, bottom: 20 }}
              />
            </GraphWrapper>
            <GraphWrapper>
              <ColumnGraph
                data={{ data: columnData.data }}
                tooltip={true}
                legend={true}
                chartTitle={`Column Graph - ${selectedCity.name}`}
                legendPosition="top-center"
                gridXTicks={10}
                gridYTicks={5}
                enableGridXLine={true}
                enableGridYLine={true}
                padding={{ left: 10, right: 10, top: 20, bottom: 20 }}
              />
            </GraphWrapper>
          </GraphBox>
        )}
      </Content>
    </PageContainer>
  );
};

export default LandingPage;
