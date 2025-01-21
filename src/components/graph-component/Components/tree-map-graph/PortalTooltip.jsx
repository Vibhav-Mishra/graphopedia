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
            style={props?.style}
            vAlign={props.vAlign}
            tooltipOffset={props.tooltipOffset}
        >
            {props.children}
        </Container>
    );
};

export default PortalTooltip;

const Container = styled.div`
  transform: ${(props) =>
        props.align === "left" ? "translateX(-100%)" : "translateX(0%)"};
  transform: ${(props) =>
        props.vAlign === "top" ? "translateY(-100%)" : "translateY(0%)"};
  position: absolute;
  left: ${(props) =>
        props.align === "left" ? props?.pos?.left - props?.tooltipOffset?.left : props?.pos?.left - props?.tooltipOffset?.right}px;
  top: ${(props) =>
        props.vAlign === "top" ? props?.pos?.top - props?.tooltipOffset?.top : props?.pos?.top + props?.tooltipOffset?.bottom}px;

  z-index: 100;
  background: #ffffff;
  box-shadow: 0px 2.90418px 5.80835px rgba(88, 88, 88, 0.3);
  border-radius: 8.71253px;
  width: fit-content;

  &::before {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-style: solid;
    border-width: ${(props) =>
        props.vAlign !== "top" ? "0 12px 12px 12px" : "12px 12px 0 12px"};
    border-color: ${(props) =>
        props.vAlign !== "top"
            ? "transparent transparent #ffffff transparent"
            : "#ffffff transparent transparent transparent"};
    top: ${(props) => (props.vAlign !== "top" ? "-10%" : "95%")};
  }
`;
PortalTooltip.propTypes = {
    isOpen: PropTypes.bool,
    pos: PropTypes.object,
    align: PropTypes.string,
    vAlign: PropTypes.string,
    children: PropTypes.node,
};
