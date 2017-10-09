import React from "react";

const Header = ({ store }) => {
  console.log(store.app.daysAboveLastYear);
  const { daysAboveLastYear, temperature } = store.app;
  console.log(daysAboveLastYear);
  return "visdf";
};

export default Header;
