import React, { useState } from 'react'
import { actualTwoD3 } from '../../graphs/utils/mockData'
import { StackedLine } from '../../index'
import { Wrapper } from '../styled-components'

const WidgetLab = () => {
  // const [data, setData] = useState(data1)
  const [selected, setSelected] = useState(2)

  // useEffect(() => {
  //   setTimeout(() => {
  //     setData(data2)
  //   }, 5000)
  // }, [])

  const handleOnClick = (event, d, i) => {
    console.log('handleOnClick', event, d, i)
    setSelected(d.index)
  }

  const tickClick = (event, d, i) => {
    console.log('tickClick', event, d, i)
  }

  const handleMouseEnter = (event, d, i) => {
    console.log('handleMouseEnter', event, d, i)
  }

  const handleMouseMove = (event, d, i) => {
    console.log('handleMouseMove', event, d, i)
  }

  const handleMouseLeave = (event, d, i) => {
    console.log('handleMouseLeave', event, d, i)
  }
  const aa = [
    {
      label: 'A',
      low: '100',
      medium: '260',
      medium1: '210',
      high: '600'
    },
    {
      label: 'B',
      low: '200',
      medium: '300',
      medium1: '25',
      high: '70'
    },
    {
      label: 'C',
      low: '15',
      medium: '250',
      medium1: '20',
      high: '50'
    },
    {
      label: 'D',
      low: '5',
      medium: '15',
      medium1: '100',
      high: '80'
    },
    {
      label: 'E',
      low: '20',
      medium: '40',
      medium1: '35',
      high: '600'
    },
    {
      label: 'F',
      low: '30',
      medium: '35',
      medium1: '30',
      high: '700'
    },
    {
      label: 'G',
      low: '20',
      medium: '50',
      medium1: '45',
      high: '60'
    },
    {
      label: 'H',
      low: '15',
      medium: '45',
      medium1: '40',
      high: '70'
    }
  ]

  return (
    <Wrapper>
      <StackedLine
        data={{
          ...actualTwoD3,
          ...(selected === 1 && {
            data: aa,
            labels: [
              {
                label: 'Low',
                value: 'low'
              }
            ]
          })
        }}
        config={{
          yAxisType: 'number',
          yLabelAlignment: 50,
          rectIndicator: true,
          selected: selected,
          yAxisTicksFormat: true,
          hoverLine: true,
          xLabelPos: 0.5,
          gridYTicks: 5,
          gridXTicks: 3,
          handleOnClick,
          handleMouseEnter,
          handleMouseMove,
          handleMouseLeave,
          tickClick
        }}
      />
    </Wrapper>
  )
}

export default WidgetLab
