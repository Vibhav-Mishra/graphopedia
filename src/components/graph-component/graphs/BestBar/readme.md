# Bar Graphs

Bar Graphs

## Info

Bar Graphs for data visualization

## Usage

```jsx
import React from 'react';
import { BestBar } from 'graph-components';
import { actualOneD } from '../../mock-data';
const App = () => {
  return (
    <BestBar
      data={{ ...actualOneD, data: actualOneD.data.slice(0, 4) }}
      config={{
        graphType: 'group',
        handleMouseMove,
        handleMouseEnter,
        handleMouseLeave,
        enableGridXLine: true,
        dasharray: 5,
        gridLineStrokeWidth: 1,
        yLabelAlignment: 30,
        gutterSpace: 20,
        xLabelAlignment: 25,
      }}
    />
  );
};

export default App;
```

## Sample Data

```Jsx

export const actualOneD = {
  title: "Defect Distribution",
  subtitle: "2020-04-17",
  summary: { label: "55%", subLabel: "132/237" },
  data: [
    { label: "Q1", value: 26, thresholdValue: 80, color: "#DE1D83" },
    { label: "Q2", value: 78, thresholdValue: 20, color: "#FF9315" },
    { label: "Q3", value: 42, thresholdValue: 60, color: "#22AAFF" },

    { label: "Q4", value: 64, thresholdValue: 180, color: "#375DD7" },
    { label: "Qtr5", value: 30, thresholdValue: 20, color: "#FFBA07" },
  ],
  labels: [
    {
      label: "label",
      value: "value",
      // color: "#E20074",
      // color1: "#ffffff00",
      // colorOpacity: 1,
      // colorOpacity1: 0.1,
    },
  ],
  info: [],
};

```

## Props

- data - An array of data for the chart.
- graphType - Defines the type of the graph.
- YLabelAlignment - Defines the alignment of y axis labels.
- XLabelAlignment - Defines the alignment of x axis labels.
- gutterSpace - Defines the space between the bars/columns.
- enableGridYLine - Enables/Disables the horizontal grid-lines.
- enableGridXLine - Enables/Disables the vertical grid-lines.
- gridLineStrokeWidth - Defines the stroke width of grid-lines.
- dasharray - Defines the dashes to the grid lines.
- gridYTicks - Defines the amount of ticks to y axis.
- gridXTicks - Defines the amount of ticks to x axis.

## Props (table)

| Prop             | Type    | Default | Description                                            |
| ---------------- | ------- | ------- | ------------------------------------------------------ |
| data             | array   | N/A     | An array of data for the chart.                        |
| graphType        | string  | 'group' | Defines the type of the graph.                         |
| YLabelAlignment  | number  | N/A     | Defines the alignment of y axis labels.                |
| XLabelAlignment  | number  | N/A     | Defines the alignment of x axis labels.                |
| gutterSpace      | number  | N/A     | Defines the space between the bars/columns.            |
| enableGridYLine  | number  | N/A     | Enables/Disables the horizontal grid-lines.            |
| enableGridXLine  | number  | N/A     | Enables/Disables the vertical grid-lines.              |
| dasharray        | number  | N/A     | Defines the dashes to the grid lines.                  |
| gridYTicks       | number  | N/A     | Defines the amount of ticks to y axis.                 |
| hoverRect        | boolean | false   | If true then show hoverRect on hover for column graph. |
| enableRectLabels | boolean | false   | If true then show labels on hoverRect for bar graph.   |
| xTotalLabelFS    | number  |         | Defines x Total label Font size.                       |
| xTotalSubLabelFS | number  |         | Defines x Total sublabel Font size.                    |
| xTotalLabelSpace | number  |         | IDefines the space between the x total label.          |

## License

MIT © [](https://github.com/)
