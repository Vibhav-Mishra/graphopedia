import React, { useState } from "react";
import PropTypes from "prop-types";
import * as Styles from "./TimelineSlider.sc.js";

const TimelineSlider = ({ data, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(data[0].period);
  const [hoveredDate, setHoveredDate] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setHoveredDate(null);
    onDateChange(date);
  };

  const handleMouseEnter = (date) => {
    setHoveredDate(date);
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  const formatLabel = (date) => {
    return date;
  };

  const uniqueDates = [...new Set(data.map((item) => item.period))];
  const firstDate = uniqueDates[0];
  const lastDate = uniqueDates[uniqueDates.length - 1];

  return (
    <Styles.TimelineContainer>
      <Styles.Timeline>
        <Styles.TimelineLine />
        {uniqueDates.map((date, index) => (
          <Styles.TimelinePoint
            key={date}
            active={date === selectedDate}
            hovered={date === hoveredDate}
            last={index === uniqueDates.length - 1}
            onClick={() => handleDateClick(date)}
            onMouseEnter={() => handleMouseEnter(date)}
            onMouseLeave={handleMouseLeave}
            data-label={
              date === selectedDate ||
              date === firstDate ||
              date === lastDate ||
              date === hoveredDate
                ? formatLabel(date)
                : ""
            }
            showLabel={
              date === selectedDate ||
              date === firstDate ||
              date === lastDate ||
              date === hoveredDate
            }
          />
        ))}
      </Styles.Timeline>
    </Styles.TimelineContainer>
  );
};

TimelineSlider.propTypes = {
  data: PropTypes.array.isRequired,
  onDateChange: PropTypes.func.isRequired,
};

export default TimelineSlider;
