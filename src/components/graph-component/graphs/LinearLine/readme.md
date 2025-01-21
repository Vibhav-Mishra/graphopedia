# Linear Line

The Linear component is a Graph component that creates the visual representation of the data provided in line graph format.

## Info

We can use this component for visualizing the data in single line chart, multi line chart, area chart and stacked area chart.

Also we can create the line or area graph in step or spline or the normal format.

We also can provide the custom colors to the graph.

## Usage

```
import React from 'react';
import {LinearLine} from 'graph-components';
import {graphData1} from 'mock-data.js'

function App() {


  return (
    <div>
      <LinearLine
                  data={graphData1}
                  config={{
                    graphType: "line",
                    gridXYLabelFontSize: 10,
                    enableGridYLine: true,
                    gridLineStrokeWidth: 1,
                    dasharray: 5,
                    graphType: "line",
                    enablePointCircle: true,
                    hideYAxis: false,
                    enableAllPointToolTip: false,
                    padding: {
                      right: 25,
                    },

                    handleMouseMove,
                    handleMouseEnter,
                    handleMouseLeave,
                  }}
                />
    </div>
  );
}

export default App;

```

## Props

| Prop   | Type   | Default    | Description                                                                                                                                                                      |
| ------ | ------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data   | array  | (required) | The data that should be provided to the graph. Its an array of objects with label and value key.                                                                                 |
| config | object |            | The configuration for the graph. Using the config we can achieve different kind of graphs we want. [Here](#available-config) are the available config for Linear Line component. |

## Available Config

| Config                | Type & Variant             | Description                                                                                                                                 |
| --------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| graphType             | string (line, area, sarea) | This will determine the type of graph. "line" represents line graph, "area" represents graph and "sarea" represents the stacked area graph. |
| enableCurve           | boolean                    | If true the graph will have the curved line in the graph.                                                                                   |
| enableStep            | boolean                    | If true the graph will have the stepped line in hte graph.                                                                                  |
| enableGradient        | boolean                    | If true the color of the graph will have gradient.                                                                                          |
| enableAreaLine        | boolean                    | If true the border line will appear in area graph.                                                                                          |
| areaLineStroke        | string                     | Represents the color of the area line .                                                                                                     |
| enablePointCircle     | boolean                    | If true circle dot will appear at each data point.                                                                                          |
| r                     | number                     | Determines the radius of the point circle                                                                                                   |
| disableCircleLabel    | boolean                    | If false the value of the graph will appear just above the graph line                                                                       |
| yDomainMultiplayer    | number                     | Multiplication factor for the y axis value.                                                                                                 |
| hideYAxis             | boolean                    | If true hides the y-axis                                                                                                                    |
| enableAllPointToolTip | boolean                    | if true, will enable the tooltip at every data point.                                                                                       |
| handleMouseEnter      | function                   | callback function that runs when we enter the graph area                                                                                    |
| handleMouseMove       | function                   | callback function that runs when we hover over the graph area                                                                               |
| handleMOuseLeave      | function                   | callback function that runs when we leave the graph area                                                                                    |

## License

MIT © [](https://github.com/)
