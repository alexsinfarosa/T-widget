import React from "react";

const Header = ({ daysAboveLastYear, temperature }) => {
  switch (daysAboveLastYear) {
    case 0:
      return <h2>This year there have been 0 days above {temperature}˚F </h2>;
    case 1:
      return (
        <h2>
          This year there has been {daysAboveLastYear} day above {temperature}˚F{" "}
        </h2>
      );
    default:
      return (
        <h2>
          This year there have been {daysAboveLastYear} days above {temperature}˚F{" "}
        </h2>
      );
  }
};

export default Header;
