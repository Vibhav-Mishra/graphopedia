/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { debounce } from './graphUtils';

const ResizeHandlerHOC =
  (Component) =>
  ({ ...props }) => {
    const [rerender, setRerender] = useState(false);
    useEffect(() => {
      // Add event listener
      window.addEventListener(
        'resize',
        debounce(function (e) {
          setRerender(Math.random());
        })
      );
    }, []);
    return <Component {...props} rerender={rerender} />;
  };
export default ResizeHandlerHOC;
