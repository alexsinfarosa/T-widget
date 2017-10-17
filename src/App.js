import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// antd components
import { Spin } from "antd";

// components
import StationsMenu from "components/StationsMenu";
import TempSlider from "components/TempSlider";
import ObservedGauge from "components/ObservedGauge";

// Styled components
import { Page } from "styles";

@inject("store")
@observer
class App extends Component {
  render() {
    const { isLoading } = this.props.store.app;
    return (
      <Page>
        <StationsMenu />
        <br />
        <TempSlider />
        <br />
        {!isLoading ? <ObservedGauge /> : <Spin />}
      </Page>
    );
  }
}

export default App;
