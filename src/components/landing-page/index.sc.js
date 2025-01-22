import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
`;

export const Header = styled.header`
  background: #f5f5f5;
  padding: 0.3rem; /* Further reduced height */
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid #e20074;
  position: relative;
`;

export const HeaderTitle = styled.h1`
  color: #e20074;
  font-size: 1.2rem; /* Adjusted size to match smaller header */
  font-family: "Trebuchet MS", sans-serif;
  font-weight: bold;
`;

export const HamburgerIcon = styled.div`
  cursor: pointer;
  font-size: 1.5rem; /* Adjusted size for smaller header */
  color: #e20074;
  position: absolute;
  left: 1rem;
`;

export const Menu = styled.div`
  position: absolute;
  top: 40px; /* Adjusted position for smaller header */
  left: 0;
  background: white;
  border: 1px solid pink;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MenuItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`;

export const Content = styled.div`
  display: flex;
  height: calc(100vh - 2.6rem); /* Adjusted height for smaller header */
  padding: 2rem;
  gap: 2rem;
`;

export const CityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 30%; /* Reduced width for city list */
`;

export const Hexagon = styled.div`
  width: 40px;
  height: 45px;
  background: #e20074;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  cursor: pointer;
  &:hover {
    background: #ff4da6;
  }
`;

export const GraphBox = styled.div`
  flex: 1;
  padding: 1rem;
  background: #f9f9f9;
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  justify-content: space-between;
  width: 75%; /* Increased width for graph box */
`;

export const GraphWrapper = styled.div`
  flex: 1 1 calc(50% - 10px); /* Slightly increased width for graphs */
  min-width: 450px; /* Increased minimum width */
  border: 1px solid #ccc;
  padding: 1rem;
  background: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

export const TabHeader = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const Tab = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  background: ${({ isActive }) => (isActive ? "#e20074" : "#f0f0f0")};
  color: ${({ isActive }) => (isActive ? "white" : "black")};
  border-radius: 5px;
  &:hover {
    background: ${({ isActive }) => (isActive ? "#c80066" : "#e5e5e5")};
  }
`;

export const TabContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;