import * as d3 from "d3";
import * as d3Cloud from "d3-cloud";
import { colorBox, initialValues } from "../utils/graphConst";
import { setUpEvents } from "../utils/graphEvents";

export const wordCloud = function wordCloud() {
  let config = {
    ...initialValues,
    rotate: false,
    maxNumberOfData: 15,
  };

  // draw the graph here
  function graph(selected) {
    selected.each(function (data) {
      function draw(wcdata) {
        function wcChange(eleRef) {
          eleRef
            .style("fill", function (d, i) {
              return d.color || colorBox[i % colorBox.length];
            })

            .attr("transform", function (d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })

            .text(function (d) {
              return d.text;
            });
        }
        selected
          .selectAll(".word-cloud-text")
          .data(wcdata.slice(0, config.maxNumberOfData))
          .join(
            (enter) => {
              enter
                .append("text")
                .attr("class", "word-cloud-text")
                .attr("font-weight", config.fontWeight || 400)

                .attr("text-anchor", "middle")
                .style("font-size", function (d) {
                  return d.size;
                })
                .attr("transform", "translate(0,0)")
                .transition()
                .duration(500)
                .call(wcChange);
            },
            (update) =>
              update
                .attr("font-weight", config.fontWeight || 400)
                .transition()
                .call(wcChange),
            (exit) => {
              exit.remove();
            }
          );
      }

      const dcounts = d3.extent(data.map((ele) => ele.value));

      const fontSize = d3
        .scaleLog()
        .domain(dcounts)
        .range([
          config.minFontSize || 10,
          config.maxFontSize || config.width / 20,
        ]);

      const layout = d3Cloud()
        .size([config.width, config.height])
        .words(
          data.map(function (d) {
            return { ...d, text: d.label, size: fontSize(d.value) };
          })
        )
        .font("Inter")
        .fontSize(function (d) {
          return d.size;
        })
        .padding(config.padding || 1) // space between words
        .spiral("rectangular")
        .rotate(function () {
          return config.rotateRandom
            ? Math.random() * 360
            : config.rotateAlternate
            ? ~~(Math.random() * 2) * config.rotateAngle
            : config.rotateAngle
            ? config.rotateAngle
            : 0;
        })

        .on("end", draw);
      layout.start();

      setUpEvents(config, selected, "word-cloud-text");
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
