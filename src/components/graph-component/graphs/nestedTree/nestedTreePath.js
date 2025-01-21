import { initialValues } from '../utils/graphConst';
import { setUpEvents } from '../utils/graphEvents';

export const nestedTreePath = function nestedTreePath() {
  let config = {
    ...initialValues,
    hideLabel: false,
    labelColor: '#000',
  };

  // draw the graph here
  function graph(selected) {
    selected.each(function (data) {
      selected
        .selectAll('.nested-tree-path-grp')
        .data((d) => {
          console.log('d', d);
          return d.height;
        })
        .join('g')
        .attr('filter', '')
        .selectAll('g')
        .data((d) => d[1])
        .join('g')
        .attr('transform', (d) => `translate(${d.x0},${d.y0})`);

      // let mainRoot = selected
      //   .selectAll(".tree-path-grp")
      //   .data(root.leaves())
      //   .join(
      //     (enter) => {
      //       let rectGrp = enter.append("g").attr("class", "tree-path-grp");
      //       rectGrp
      //         .transition(t)

      //         .attr("transform", function (d) {
      //           return "translate(" + d.x0 + "," + d.y0 + ")";
      //         });

      //       rectGrp
      //         .append("rect")
      //         .transition(t)
      //         .attr("class", "tree-path")
      //         .attr("fill", function (d) {
      //           return (
      //             d.data.color ||
      //             ColorParser(colorBox[d.parent.data.labelIndex])
      //           );
      //         })
      //         .attr("width", function (d) {
      //           return d.x1 - d.x0;
      //         })
      //         .attr("height", function (d) {
      //           return d.y1 - d.y0;
      //         });
      //       if (config.hideLabel) {
      //         rectGrp
      //           .append("text")
      //           .attr("clip-path", function (d) {
      //             return "url(#clip-" + d.data.id + ")";
      //           })
      //           .attr("x", 4)
      //           .attr("y", function (d, i) {
      //             return 13;
      //           })
      //           .text(function (d) {
      //             return d.data.label;
      //           })
      //           .style("fill", config.labelColor)
      //           .style("font-size", function (d) {
      //             let cn = d3.select(this);
      //             // const textWidth = TextLength.getWidth(
      //             //   d.data.label,
      //             //   config.fontSize,
      //             //   "Inter"
      //             // );
      //             const textWidth = cn.node().getComputedTextLength();
      //             let clearArea =
      //               d.x1 - d.x0 < d.y1 - d.y0 ? d.x1 - d.x0 : d.y1 - d.y0;
      //             return `${
      //               config.fontSize < clearArea && textWidth < d.x1 - d.x0 - 10
      //                 ? config.fontSize
      //                 : 0
      //             }px`;
      //           });
      //       }
      //     },
      //     (update) => update,
      //     (exit) => {
      //       exit
      //         .select("rect")
      //         .transition(t)
      //         .attr("width", 0)
      //         .attr("height", 0)
      //         .remove();
      //       exit.selectAll("text").remove();
      //     }
      //   )
      //   .transition(t)
      //   .attr("transform", function (d) {
      //     return "translate(" + d.x0 + "," + d.y0 + ")";
      //   });

      setUpEvents(config, selected, 'nested-tree-path-grp');
    });

    return selected;
  }

  graph.config = function graphConfig(val) {
    if (!arguments.length) {
      return config;
    }
    config = Object.assign(config, val);
    return graph;
  };

  return graph;
};
