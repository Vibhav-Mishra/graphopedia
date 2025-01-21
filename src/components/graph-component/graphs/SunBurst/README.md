# SunburstGraph

SunburstGraph is a React component that displays data in a sunburst graph format. It is designed to show hierarchical data as a series of nested circles, where each circle represents a different level in the hierarchy. The graph also supports interactive features such as sector selection and tooltips.

## Installation

To use the SunburstGraph component in your React project, you can install it via npm:

```bash
npm install --save graph-components
```

## Usage

```jsx
import React from 'react'
import { SunburstGraph } from 'graph-components'

const Example = () => {
  const data = {
    centerSummaryInnerHTML: `Center Text`,
    sectors: [
      {
        name: 'Sector 1',
        carriers: [
          { name: '5G Carrier 1', color: '#E07D98', value: 67 },
          {
            name: '5G Carrier 2',
            color: 'rgba(224, 125, 152, 0.75)',
            value: 84
          },
          { name: 'LTE Carrier 1', color: '#67DCBB', value: 22 },
          {
            name: 'LTE Carrier 2',
            color: 'rgba(139, 226, 203, 0.75)',
            value: 41
          }
        ]
      },
      {
        name: 'Sector 2',
        carriers: [
          { name: '5G Carrier 1', color: '#E07D98', value: 75 },
          {
            name: '5G Carrier 2',
            color: 'rgba(224, 125, 152, 0.75)',
            value: 29
          },
          { name: 'LTE Carrier 1', color: '#67DCBB', value: 93 },
          {
            name: 'LTE Carrier 2',
            color: 'rgba(139, 226, 203, 0.75)',
            value: 56
          }
        ]
      },
      {
        name: 'Sector 3',
        carriers: [
          { name: '5G Carrier 1', color: '#E07D98', value: 42 },
          {
            name: '5G Carrier 2',
            color: 'rgba(224, 125, 152, 0.75)',
            value: 87
          },
          { name: 'LTE Carrier 1', color: '#67DCBB', value: 64 },
          {
            name: 'LTE Carrier 2',
            color: 'rgba(139, 226, 203, 0.75)',
            value: 23
          }
        ]
      },
      {
        name: 'Sector 4',
        carriers: [
          { name: '5G Carrier 1', color: '#E07D98', value: 90 },
          {
            name: '5G Carrier 2',
            color: 'rgba(224, 125, 152, 0.75)',
            value: 35
          },
          { name: 'LTE Carrier 1', color: '#67DCBB', value: 77 },
          {
            name: 'LTE Carrier 2',
            color: 'rgba(139, 226, 203, 0.75)',
            value: 68
          }
        ]
      }
    ]
  }

  return <SunburstGraph data={data} />
}

export default Example
```

## Props

The SunburstGraph component accepts the following props:

| Prop                    | Type             | Description                                                                                                              |
| ----------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| data (required)         | object           | An object representing the sunburst graph data. See below for its structure.                                             |
| config                  | object           | An optional object to configure the appearance and behavior of the sunburst graph. See below for available options.      |
| angleOfRotation         | number           | (Optional) Angle of rotation for the entire graph in radians. Default: -Math.PI / 8.                                     |
| radialAxisColors        | array of objects | (Optional) Array of objects representing radial axis colors and their corresponding rangeMax (max value) for each color. |
| innerGraphRadiusPercent | number           | (Optional) Percentage value to set the inner graph radius relative to the overall graph radius. Default: 0.25.           |
| onSectorSelect          | function         | (Optional) Callback function that will be called when a sector in the sunburst graph is selected.                        |
| onSectorUnSelect        | function         | (Optional) Callback function that will be called when a selected sector in the sunburst graph is unselected.             |
| graphWrapStyle          | object           | (Optional) Custom styling for the container of the sunburst graph.                                                       |
| tooltipNode             | React node       | (Optional) Custom tooltip content that appears when hovering over a sector.                                              |
| onMouseOver             | function         | (Optional) Callback function that will be called when the mouse is over a sector in the sunburst graph.                  |
| onMouseLeave            | function         | (Optional) Callback function that will be called when the mouse leaves a sector in the sunburst graph.                   |
