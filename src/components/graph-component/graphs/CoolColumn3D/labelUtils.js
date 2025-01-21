import * as d3 from 'd3';

export function topLabels(elementRef, config, t) {
  elementRef.selectAll('*').remove();

  const labelGrp = elementRef;

  labelGrp.transition(t).attr('transform', (d, i) => {
    return `translate(${
      config.rectWidth
        ? (config.rectWidth + config.gutterSpace) * i
        : config.graphType === 'group'
        ? config.xScale(d.label) + config.xScale.bandwidth() / 2 // breaking here
        : config.xScale(d.label) + config.xScale.bandwidth() / 2
    }, ${
      (config.graphType === 'group' || config.displayAtTop
        ? config.yScale(config.maxY * 1.15)
        : config.yScale(d.accValue)) +
      (d.yTotalSubLabel ? -2 : -1) * config.yTotalLabelSpace
    })`;
  });

  labelGrp
    .append('text')
    .attr('class', 'y-total-label')
    .style('text-anchor', 'middle')
    .style('font-weight', 'bold')
    .style('fill', (d) => d.yTotalLabelColor || '#000')
    .style('font-size', config.yTotalLabelFS)
    .text((d) => d.yTotalLabel || d.accValue || '');

  labelGrp
    .append('text')
    .attr('class', 'y-total-sub-label')
    .style('text-anchor', 'middle')
    .style('font-weight', 'bold')
    .style('fill', (d) => d.yTotalSubLabelColor || '#000')
    .style('font-size', config.yTotalSubLabelFS)
    .attr('x', 0)
    .attr('y', 0)

    .text((d) => d.yTotalSubLabel || '')
    // .transition(t)
    .attr('x', 0)
    .attr('y', config.yTotalLabelFS + config.yTotalLabelSpace / 3);
}

export function rectLabels(eleRef, config, t, xWidth) {
  eleRef
    .selectAll('.rect-label')
    .data((d, i) => {
      d.map((entry) => {
        const temp = entry;
        temp.labelIndex = i;
        return temp;
      });
      return d;
    })
    .join(
      (enter) => {
        enter
          .append('text')
          .attr('class', 'rect-label')
          .style('text-anchor', 'middle')
          .style('font-weight', 'bold')
          .style('fill', config.yRectLabelColor)
          .style('font-size', config.yTotalLabelFS)
          .style('transform', (d, i) => {
            return `translate(${
              config.xScale(d.label) + config.xScale.bandwidth() / 2
            }px,${config.yScale(0)}px)`;
          })
          .text((d) => d.value)
          .transition(t)
          .style('transform', (d, i) => {
            return `translate(${
              config.xScale(d.label) + config.xScale.bandwidth() / 2
            }px,${config.yScale(d.accValue) - -1 * config.fontSize}px)`;
          })
          .style('display', function (d) {
            const cn = d3.select(this);
            const textWidth = cn.node().getComputedTextLength();
            const barHeight =
              config.graphAreaH -
              config.yScale(parseFloat(d.value)) -
              config.fontSize;
            return `${
              textWidth < xWidth && textWidth < barHeight ? 'block' : 'none'
            }`;
          });
      },
      (update) => update,
      (exit) => {
        exit.remove();
      }
    )
    .style('fill', config.yRectLabelColor)
    .style('font-size', config.yTotalLabelFS)
    .text((d) => d.value)
    .transition(t)
    .style('transform', (d, i) => {
      return `translate(${
        config.xScale(d.label) + config.xScale.bandwidth() / 2
      }px,${config.yScale(d.accValue) - -1 * config.fontSize}px)`;
    })
    .style('display', function (d) {
      const cn = d3.select(this);
      const textWidth = cn.node().getComputedTextLength();
      const barHeight =
        config.graphAreaH -
        config.yScale(parseFloat(d.value)) -
        config.fontSize;
      return `${
        textWidth < xWidth && textWidth < barHeight ? 'block' : 'none'
      }`;
    });
}
