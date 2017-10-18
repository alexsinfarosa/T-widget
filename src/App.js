import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// antd components
import { Spin, Button } from "antd";

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
        <Button
          type={false ? "primary" : "default"}
          icon="bar-chart"
          size="large"
          onClick={() => this.props.store.app.setIsGraph(true)}
        >
          Time Series Graph
        </Button>

        <br />
        {!isLoading ? <ObservedGauge /> : <Spin />}
      </Page>
    );
  }
}

export default App;
