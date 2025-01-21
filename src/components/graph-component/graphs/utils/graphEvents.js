import * as d3 from "d3";

export const onClickFunc = (selected, className, config) => {
  // default code for all graph
  const classSelected = selected.selectAll(`.${className}`);
  classSelected.style("cursor", "pointer").on("click", function (event, d) {
    const siblings = selected.selectAll(`.${className}`);
    siblings.classed("unselected", true);
    d3.select(this).node().classList.remove("unselected");
    d3.select(this).node().classList.add("selected");
    config.handleOnClick(event, d);
    event.stopPropagation();
  });
};

export const onMouseOverOut = (selected, className, overFunc, outFunc) => { };

export const onMouseEnterMoveLeave = (
  selected,
  className,
  config,
  enterFunc,
  moveFunc,
  leaveFunc
) => {
  // remove all pointer-text in line graph
  if (className === "line-bg-rect" || className === "line-path") {
    config.showPointerValueOnHover && d3.selectAll(".pointer-text").remove();
  }

  let tooltipHovered = false;

  const tooltip = d3.select(".tooltip-anchor");
  tooltip
    .on("mouseenter", () => {
      tooltipHovered = true;
    })
    .on("mouseleave", () => {
      tooltipHovered = false;
    });

  selected
    .selectAll(`.${className}`)
    .style("cursor", "pointer")
    .on("mouseenter", function (event, d) {
      const hoveredElement = d3.select(this);
      const sibling1 = hoveredElement
        .node()
        .parentNode.querySelectorAll("rect");

      const index = Array.prototype.indexOf.call(
        sibling1,
        hoveredElement.node()
      );

      const xAxisLines = d3.selectAll(".x-axis-line");

      xAxisLines
        .filter((d, i) => i === index)
        .style("stroke", config.gridHoverColor)
        .classed("hovered", true); // Add 'hovered' class

      xAxisLines
        .filter((d, i) => i !== index)
        .style("stroke", config.gridLineXStroke);

      if (config.xAxisTickHightlight) {
        const parentNode = d3.selectAll(".x.axis");
        const children = parentNode.selectAll(".tick");

        children
          .filter((d, i) => i === index)
          .style("stroke", config.gridHoverColor);
      }

      d3.selectAll(".x-axis .tick text").each(function () {
        this.style.fill = config.gridHoverColor;
      });

      const pointCircleGroups = d3.selectAll(".line-circle-grp");
      const pointCircleGroup = pointCircleGroups.filter(
        (d, i) => d.index === index
      );
      const pointCircle = pointCircleGroup.selectAll("circle");
      pointCircle
        .transition()
        .duration(300)
        .attr("r", config.r + 1);

      const siblings = selected.selectAll(`.${className}`);
      siblings.classed("hover-unselected", true);
      selected
        .selectAll(`.${className}.selected`)
        .classed("hover-unselected", false);
      hoveredElement
        .classed("hover-unselected", false)
        .classed("hover-selected", true);

      enterFunc(event, d, config);
    })
    .on("mousemove", (event, d) => {
      moveFunc(event, d, config);
    })
    .on("mouseleave", function (event, d) {
      if (tooltipHovered) {
        return;
      }
      const hoveredElement = d3.select(this);
      const sibling1 = hoveredElement
        .node()
        .parentNode.querySelectorAll("rect");
      const index = Array.prototype.indexOf.call(
        sibling1,
        hoveredElement.node()
      );
      // const allRect = d3.selectAll(".line-bg-rect");

      // allRect
      //   .filter((d, i) => i === index)
      //   .style("fill", "transparent")
      //   .classed("hovered", true);
      const sel = d3
        .selectAll(".x-axis-line")
        .filter((d, i) => i === index)
        .style("stroke-width", "1px")
        .style("stroke", "")
        .classed("hovered", false); // Remove 'hovered' class

      // d3.selectAll(".x-axis-line")
      //   .filter((d, i) => d.label === config.activeXLabel)
      //   .style("stroke", config.gridHoverColor);
      // const siblings = selected.selectAll(`.${className}`);
      // siblings
      //   .classed("hover-unselected", false)
      //   .classed("hover-selected", false);

      if (config.xAxisTickHightlight) {
        const parentNode = d3.selectAll(".x.axis");
        const children = parentNode.selectAll(".tick");

        children.filter((d, i) => i === index).style("stroke", "");
      }
      const pointCircleGroups = d3.selectAll(".line-circle-grp");
      const pointCircleGroup = pointCircleGroups.filter(
        (d, i) => d.index === index
      );
      const pointCircle = pointCircleGroup.selectAll("circle");
      pointCircle.transition().duration(300).attr("r", 5);

      // Remove hover-selected and hover-unselected classes
      if (className === "line-path" || className === "line-bg-rect") {
        selected
          .selectAll(`.${className}`)
          .classed("hover-unselected", false)
          .classed("hover-selected", false);

        // Remove hover-selected and unselected class from line-path by force
        selected
          .selectAll(".line-path")
          .classed("hover-unselected", false)
          .classed("hover-selected", false);
      }

      leaveFunc(event, d, config);
    });
};

// export const onMouseEnterMoveLeave = (
//   selected,
//   className,
//   config,
//   enterFunc,
//   moveFunc,
//   leaveFunc
// ) => {
//   selected
//     .selectAll(`.${className}`)
//     .style("cursor", "pointer")
//     .on("mouseenter", function (event, d) {
//       const hoveredElement = d3.select(this);
//       const sibling1 = hoveredElement
//         .node()
//         .parentNode.querySelectorAll("rect");

//       const index = Array.prototype.indexOf.call(
//         sibling1,
//         hoveredElement.node()
//       );

//       const xAxisLines = d3.selectAll(".x-axis-line");

//       xAxisLines
//         .filter((d, i) => i === index)
//         .style("stroke", config.gridHoverColor);

//       xAxisLines.filter((d, i) => i !== index).style("stroke", "");

//       const siblings = selected.selectAll(`.${className}`);
//       siblings.classed("hover-unselected", true);
//       selected
//         .selectAll(`.${className}.selected`)
//         .classed("hover-unselected", false);
//       hoveredElement
//         .classed("hover-unselected", false)
//         .classed("hover-selected", true);
//       enterFunc(event, d, config);
//     })
//     .on("mousemove", (event, d) => {
//       moveFunc(event, d, config);
//     })
//     .on("mouseleave", function (event, d) {
//       const hoveredElement = d3.select(this);
//       const sibling1 = hoveredElement
//         .node()
//         .parentNode.querySelectorAll("rect");
//       const index = Array.prototype.indexOf.call(
//         sibling1,
//         hoveredElement.node()
//       );

//       const sel = d3
//         .selectAll(".x-axis-line")
//         .filter((d, i) => i === index)
//         .style("stroke-width", "1px")
//         .style("stroke", "");
//       const siblings = selected.selectAll(`.${className}`);
//       siblings
//         .classed("hover-unselected", false)
//         .classed("hover-selected", false);
//       leaveFunc(event, d, config);
//     });
// };

export const setUpEvents = (config, selected, className) => {
  setTimeout(function () {
    if (config.handleOnClick) {
      onClickFunc(selected, className, config);
    }

    if (config.handleMouseOver && config.handleMouseOut) {
      onMouseOverOut(
        selected,
        className,
        config.handleMouseOver,
        config.handleMouseOut
      );
    }

    if (
      config.handleMouseEnter &&
      config.handleMouseLeave &&
      config.handleMouseMove
    ) {
      onMouseEnterMoveLeave(
        selected,
        className,
        config,
        config.handleMouseEnter,
        config.handleMouseMove,
        config.handleMouseLeave
      );
    }
  }, 1000);
};
