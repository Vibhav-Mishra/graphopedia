export function topLabels(elementRef, config, t) {
  elementRef.selectAll("*").remove();
  const labelGrp = elementRef;
  labelGrp.transition(t).attr("transform", (d, i) => {
    const barOffset =
      (config.columnWidth / config.labels.length) *
      (d.labelIndex - config.labels.length / 2 + 0.4);
    return `translate(${
      config.graphType === "group"
        ? config.xScale(d.label) + config.xScale.bandwidth() / 2 + barOffset
        : config.xScale(d.label) + config.xScale.bandwidth() / 2
    }, ${
      config.graphType === "stack"
        ? config.yScale(d.positiveAcc) - 10
        : d.value <= 0
        ? config.yScale(0) - 8
        : config.yScale(d.value) - 8
    })`;
  });

  labelGrp
    .append("text")
    .attr("class", "y-total-label")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("fill", (d) => config.yTotalLabelColor || "#000")
    .style("font-size", config.yTotalLabelFS)
    .text((d) =>
      d.yTotalLabel || config.graphType === "group" ? d.value : d.accValue || ""
    )
    .style("display", function (d) {
      // const cn = d3.select(this);
      // const textWidth = cn.node().getComputedTextLength();
      const barWidth =
        config.graphType === "group"
          ? config.columnWidth / config.labels.length +
            config.columnGroupPadding
          : config.columnWidth + config.columnGroupPadding;

      // const barHeight =
      //   config.graphAreaH -
      //   config.yScale(
      //     parseFloat(config.graphType === "group" ? d.value : d.accValue)
      //   ) -
      //   config.yTotalLabelFS;
      return `${config.yTotalLabelFS < barWidth ? "block" : "none"}`;
    });

  labelGrp
    .append("text")
    .attr("class", "y-total-sub-label")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("fill", (d) => d.yTotalSubLabelColor || "#000")
    .style("font-size", config.yTotalSubLabelFS)
    .attr("x", 0)
    .attr("y", 0);
  // .style("transform", (d, i) => {
  //   return `translate(0px, 0px)`;
  // })
  // .text((d) => d.yTotalSubLabel || "");
  // .transition(t)
  // .attr("x", 0)
  // .attr("y", config.yTotalLabelFS + config.yTotalLabelSpace / 3);
  // .style("transform", (d, i) => {
  //   return `translate(0px, ${
  //     config.yTotalLabelFS + config.yTotalLabelSpace / 3
  //   }px)`;
  // });
}

export function rectLabels(eleRef, config, t) {
  eleRef
    .selectAll(".rect-label")
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
          .append("text")
          .attr("class", "rect-label")
          .style("text-anchor", "middle")
          .style("font-weight", "bold")
          .style("fill", config.yTotalLabelColor)
          .style("font-size", config.yTotalLabelFS)
          .style("transform", (d, i) => {
            const barOffset =
              (config.columnWidth / config.labels.length) *
              (d.labelIndex - config.labels.length / 2 + 0.4);
            return `translate(${
              config.graphType === "group"
                ? config.xScale(d.label) +
                  config.xScale.bandwidth() / 2 +
                  barOffset
                : config.xScale(d.label) + config.xScale.bandwidth() / 2
            }px,${config.yScale(0)}px)`;
          })
          .text((d) => d.value)
          .transition(t)
          .style("transform", (d, i) => {
            const barOffset =
              (config.columnWidth / config.labels.length) *
              (d.labelIndex - config.labels.length / 2 + 0.4);
            return `translate(${
              config.graphType === "group"
                ? config.xScale(d.label) +
                  config.xScale.bandwidth() / 2 +
                  barOffset
                : config.xScale(d.label) + config.xScale.bandwidth() / 2
            }px,${
              config.graphType === "stack"
                ? d.value < 0
                  ? config.yScale(d.negativeAcc) -
                    Math.abs(
                      config.yScale(0) - config.yScale(parseFloat(d.value))
                    ) /
                      2 +
                    3
                  : config.yScale(d.positiveAcc) +
                    Math.abs(
                      config.yScale(0) - config.yScale(parseFloat(d.value))
                    ) /
                      2 +
                    3
                : d.value < 0
                ? config.yScale(d.value) - config.yTotalLabelFS
                : config.yScale(d.value) + config.yTotalLabelFS
            }px)`;
          })
          .style("display", function (d) {
            // const cn = d3.select(this);
            // const textWidth = cn.node().getComputedTextLength();
            const width =
              config.graphType === "group"
                ? config.columnWidth / config.labels.length -
                  config.columnGroupPadding
                : config.columnWidth;
            const barWidth = d.value < 0 ? width - 3 : width;

            const height =
              config.yScale(0) - config.yScale(parseFloat(d.value));
            // Math.abs(config.yScale(d.value) - config.yScale(0));
            const barHeight = height < 0 ? -1 * height : height;
            return `${
              config.yTotalLabelFS < barWidth &&
              config.yTotalLabelFS * 1.5 < barHeight
                ? "block"
                : "none"
            }`;
          });
      },
      (update) => update,
      (exit) => {
        exit.remove();
      }
    )
    .style("fill", config.yTotalLabelColor)
    .style("font-size", config.yTotalLabelFS)
    .text((d) => d.value)
    .transition(t)
    .style("transform", (d, i) => {
      console.log(d);
      const barOffset =
        (config.columnWidth / config.labels.length) *
        (d.labelIndex - config.labels.length / 2 + 0.4);
      return `translate(${
        config.graphType === "group"
          ? config.xScale(d.label) + config.xScale.bandwidth() / 2 + barOffset
          : config.xScale(d.label) + config.xScale.bandwidth() / 2
      }px,${
        config.graphType === "stack"
          ? d.value < 0
            ? config.yScale(d.negativeAcc) -
              Math.abs(config.yScale(0) - config.yScale(parseFloat(d.value))) /
                2 +
              3
            : config.yScale(d.positiveAcc) +
              Math.abs(config.yScale(0) - config.yScale(parseFloat(d.value))) /
                2 +
              3
          : d.value < 0
          ? config.yScale(d.value) - config.yTotalLabelFS
          : config.yScale(d.value) + 1.5 * config.yTotalLabelFS
      }px)`;
    })
    .style("display", function (d) {
      // const cn = d3.select(this);
      // const textWidth = cn.node().getComputedTextLength();
      const width =
        config.graphType === "group"
          ? config.columnWidth / config.labels.length -
            config.columnGroupPadding
          : config.columnWidth;
      const barWidth = d.value < 0 ? width - 3 : width;

      const height = config.yScale(0) - config.yScale(parseFloat(d.value));
      const barHeight = height < 0 ? -1 * height : height;
      return `${
        config.yTotalLabelFS < barWidth &&
        config.yTotalLabelFS * 1.5 < barHeight
          ? "block"
          : "none"
      }`;
    });
}
