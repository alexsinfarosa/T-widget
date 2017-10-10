import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// components
import StationsMenu from "components/StationsMenu";
import TempSlider from "components/TempSlider";
import Header from "components/Header";

// Styled components
import { Page } from "styles";

@inject("store")
@observer
class App extends Component {
  render() {
    const { daysAboveLastYear, temperature } = this.props.store.app;
    return (
      <Page>
        <StationsMenu />
        <br />
        <TempSlider />
        <br />
        <Header
          temperature={temperature}
          daysAboveLastYear={daysAboveLastYear}
        />
      </Page>
    );
  }
}

export default App;
