import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const PortalTooltip = (props) => {
  if (!props.isOpen) {
    return null;
  }
  return (
    <Container
      pos={props.pos}
      align={props.align}
      vAlign={props.vAlign}
      leftAlign={props.leftAlign}
      boxShadow={props.boxShadow}
      borderradius={props.borderRadius}
      tooltipOffset={props.tooltipOffset}
      ref={props.tooltipRef}
      className="tooltip"
    >
      {props.children}
    </Container>
  );
};

export default PortalTooltip;

const Container = styled.div`
  position: absolute;
  transform: ${(props) => {
    return props.align === "right"
      ? `translate(0, -50%)`
      : `translate(-50%, calc(-100% - ${props.tooltipOffset}px ))`;
  }};

  left: ${(props) => {
    return props.align === "right"
      ? props.pos.left + props.tooltipOffset
      : props.pos.left;
  }}px;
  top: ${(props) => props.pos.top}px;

  z-index: 99999;
  overflow: hidden;
  background: #ffffff;
  box-shadow: ${({ boxShadow }) =>
    boxShadow || "0px 2.90418px 5.80835px rgba(88, 88, 88, 0.3)"};
  border-radius: ${({ borderRadius }) => borderRadius || "8.71253px"};
  text-align: left;
  transition: all 0.3s ease-in-out;
`;

PortalTooltip.propTypes = {
  isOpen: PropTypes.bool,
  pos: PropTypes.object,
  align: PropTypes.string,
  vAlign: PropTypes.string,
  children: PropTypes.node,
  leftAlign: PropTypes.number,
  boxShadow: PropTypes.string,
  borderRadius: PropTypes.string,
};
