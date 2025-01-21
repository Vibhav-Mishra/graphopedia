import React from "react";

import { Wrapper } from "./index.sc";

const SubHeading = ({
  lineHeight,
  children,
  color,
  fontSize,
  fontWeight,
  fontFamily,
}) => {
  return (
    <Wrapper
      lineHeight={lineHeight}
      color={color}
      fontSize={fontSize}
      fontWeight={fontWeight}
      fontFamily={fontFamily}
    >
      {children}
    </Wrapper>
  );
};

export default SubHeading;
