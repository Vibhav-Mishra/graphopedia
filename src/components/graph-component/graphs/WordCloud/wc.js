/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import d3Cloud from 'd3-cloud';

function count(words) {
  const counts = {};

  for (const w in words) {
    // console.log("trying to count words: " + w + " : " + words[w]);
    counts[words[w]] = (counts[words[w]] || 0) + 1;
  }

  return counts;
}

class Word extends React.Component {
  ref = React.createRef();
  state = { transform: this.props.transform };

  componentDidUpdate() {
    const { transform } = this.props;
    d3.select(this.ref.current)
      .transition()
      .duration(500)
      .attr('transform', this.props.transform)
      .on('end', () => this.setState({ transform }));
  }

  render() {
    const { style, counter, showCounts, countSize, children } = this.props;
    const { transform } = this.state;
    // console.log("Value of showCounts inside word is: " + showCounts);
    // debugger;
    return (
      <text
        transform={transform}
        textAnchor="middle"
        style={style}
        ref={this.ref}
      >
        <div> {showCounts} </div>
        {children}
        {counter > 1 && showCounts && (
          // <tspan fontSize={style.fontSize - 3} baseline-shift="super">
          //   {" " + counter}
          // </tspan>
          <tspan fontSize={countSize}>{' ' + counter}</tspan>
        )}
      </text>
    );
  }
}

function createCloud({
  words,
  width,
  height,
  angle,
  fontSizeSmall,
  fontSizeLarge,
  showCounts,
  countSize,
}) {
  return new Promise((resolve) => {
    // console.log("logging words from createCloud: " + words);
    const counts = count(words);
    console.log('counts', counts);
    console.log('showCounts = ' + showCounts);
    const dcounts = d3.extent(Object.values(counts));
    console.log('dcounts', dcounts);
    const fontSize = d3
      .scaleLog()
      .domain(dcounts)
      .range([fontSizeSmall, fontSizeLarge]);

    // console.log("logging from create cloud: \n" + words);
    const layout = d3Cloud()
      .size([width, height])
      .words(
        Object.keys(counts)
          // .filter(w => counts[w] > 1)
          .map((word) => ({ word }))
      )
      // .padding(2)
      .font('Impact')
      .fontSize((d) => fontSize(counts[d.word]))
      // .text(d => d.word + (counts[d.word] > 1 ? "-" + counts[d.word] : ""))
      .text((d) => d.word)
      .rotate(function () {
        //                debugger;
        return ~~(Math.random() * 2) * angle;
      })
      .on('end', resolve);

    layout.start();
    // debugger;
  });
}

const WordCloud = ({
  words,
  width,
  height,
  angle,
  fontSizeSmall,
  fontSizeLarge,
  showCounts,
  countSize,
}) => {
  const [cloud, setCloud] = useState(null);
  useEffect(() => {
    createCloud({
      words,
      width,
      height,
      angle,
      fontSizeSmall,
      fontSizeLarge,
      showCounts,
      countSize,
    }).then(setCloud);
    // console.log("trying to log cloud: " );
  }, [
    words,
    width,
    height,
    angle,
    fontSizeSmall,
    fontSizeLarge,
    showCounts,
    countSize,
  ]);

  const colors = ['red', 'green', 'blue'];
  const counts = count(words);

  return (
    cloud && (
      <>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {cloud.map((w, i) => (
            <Word
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              style={{
                fontSize: w.size,
                fontFamily: 'impact',
                fill: colors[i % colors.length],
              }}
              counter={counts[w.word]}
              key={w.word}
              showCounts={showCounts}
              countSize={countSize}
            >
              {w.word}
            </Word>
          ))}
        </g>
      </>
    )
  );
};
export default WordCloud;
