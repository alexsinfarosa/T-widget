import React from "react";

const Header = ({ daysAboveThresholdThisYear, temperature }) => {
  switch (daysAboveThresholdThisYear) {
    case 0:
      return <h2>This year there have been 0 days above {temperature}˚F </h2>;
    case 1:
      return (
        <h2>
          This year there has been {daysAboveThresholdThisYear} day above{" "}
          {temperature}˚F{" "}
        </h2>
      );
    default:
      return (
        <h2>
          This year there have been {daysAboveThresholdThisYear} days above{" "}
          {temperature}˚F{" "}
        </h2>
      );
  }
};

export default Header;
