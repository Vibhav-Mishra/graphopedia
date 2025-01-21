import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const Table = ({ data }) => {
  const tableRef = useRef(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (data && data.length > 0) {
      d3.select(tableRef.current).selectAll("*").remove();

      const table = d3
        .select(tableRef.current)
        .append("table")
        .attr("class", "market-share-table");
      const thead = table.append("thead");
      const tbody = table.append("tbody");

      const headerMapping = {
        eng_market: "MARKET",
        TMUS_SHARE: "T-MOBILE",
        ATT_SHARE: "AT&T",
        VERIZON_SHARE: "VERIZON",
        OTHER_SHARE: "OTHER",
      };

      const headers = [
        "eng_market",
        "TMUS_SHARE",
        "ATT_SHARE",
        "VERIZON_SHARE",
        "OTHER_SHARE",
      ];

      // Append headers
      thead
        .append("tr")
        .selectAll("th")
        .data(headers)
        .enter()
        .append("th")
        .text((d) => headerMapping[d] || d);

      // Append rows and cells
      const rows = tbody.selectAll("tr").data(data).enter().append("tr");

      rows
        .selectAll("td")
        .data((row) => headers.map((header) => row[header]))
        .enter()
        .append("td")
        .style("position", "relative")
        .style("padding", "5px 10px")
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("font-family", "Inter")
        .style("text-transform", "uppercase")
        .each(function (d, i, nodes) {
          const header = headers[i];
          if (d && !isNaN(d)) {
            const percentage = parseFloat(d);
            const barContainer = d3
              .select(nodes[i])
              .append("div")
              .style("background-color", "#edf0f6")
              .style("min-width", "100px")
              .style("height", "12px")
              .style("margin", "0 auto")
              .style("position", "relative")
              .style("overflow", "hidden");

            const bar = barContainer
              .append("div")
              .style("background-color", () => {
                if (header.includes("TMUS_SHARE")) return "#FF69B4";
                if (header.includes("ATT_SHARE")) return "#1E90FF";
                if (header.includes("VERIZON_SHARE")) return "#FFA500";
                return "#C0C0C0";
              })
              .style("width", "0%")
              .style("height", "12px")
              .style("position", "absolute")
              .style("left", "0")
              .style("top", "0")
              .style("transition", "width 1s ease-in-out");

            setTimeout(() => {
              bar.style("width", `${percentage}%`);
            }, 10);

            d3.select(nodes[i])
              .append("span")
              .text(`${percentage}%`)
              .style("position", "absolute")
              .style("right", "12px")
              .style("top", "50%")
              .style("transform", "translateY(-50%)")
              .style("z-index", "0")
              .style("font-size", "10px")
              .style("font-weight", "500")
              .style("font-family", "Inter");
          } else {
            d3.select(nodes[i]).text(d);
          }
        });

      setAnimate(true);
    }
  }, [data]);

  return (
    <div className="table-container">
      <style>
        {`
          .table-container {
            min-width: 1060px;
            height: 332px;
            overflow: auto;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none;  /* Internet Explorer 10+ */
          }
          .table-container::-webkit-scrollbar { /* WebKit browsers */
            width: 0;
            height: 0;
          }
          .market-share-table {
            width: 100%;
            height: 100%;
            border-collapse: separate; 
            border-spacing: 0 5px;
            font-family: 'Inter';
          }
          .market-share-table th, .market-share-table td {
            border: 1px solid #c2ccd9; 
            padding: 0px 8px 0px 8px;
            text-align: left;
            font-family: 'Inter';
          }
          .market-share-table th {
            font-weight: 700;
            font-size: 12px;
            font-family: 'Inter';
            height: 25.2px;
            position: sticky;
            top: 0;
            background-color: #ffffff;
            z-index: 1;
          }
          .market-share-table th:first-child {
            text-align: left; 
            width: 140px; 
          }
          .market-share-table th:not(:first-child) {
            text-align: center; 
            width: 230px;
          }
          .market-share-table td:first-child {
            width: 140px; 
          }
          .market-share-table td:not(:first-child) {
            width: 230px;
          }
          .market-share-table tr:nth-child(even) td:first-child {
            background-color: #edf0f6; 
          }
          .market-share-table td {
            position: relative;
            padding: 0;
            font-family: 'Inter';
            font-size: 12px;
            font-weight: 500;
            height: 25.2px;
            box-sizing: border-box;
            border-top: none;
            border-bottom: none;
            border-left: 1px solid #c2ccd9;
            border-right: 1px solid #c2ccd9;
            color: #606080; 
          }
          .market-share-table td div {
            border-radius: 2px;
            font-family: 'Inter';
          }
        `}
      </style>
      <div ref={tableRef}></div>
    </div>
  );
};

export default Table;
