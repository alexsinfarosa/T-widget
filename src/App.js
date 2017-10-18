import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// antd components
import { Spin, Button } from "antd";

// components
import StationsMenu from "components/StationsMenu";
import TempSlider from "components/TempSlider";
import ObservedGauge from "components/ObservedGauge";
import Projection from "components/Projection";
import ProjectionButtons from "components/ProjectionButtons";

// Styled components
import { Page } from "styles";

@inject("store")
@observer
class App extends Component {
  render() {
    const { isLoading, isGraph } = this.props.store.app;
    return (
      <Page>
        <StationsMenu />
        <br />
        <TempSlider />
        <br />
        <Button
          type={isGraph ? "primary" : "default"}
          icon="bar-chart"
          size="large"
          onClick={() => this.props.store.app.setIsGraph(true)}
        >
          Time Series Graph
        </Button>

        <br />
        {!isLoading ? <ObservedGauge /> : <Spin />}
        <br />
        {!isLoading ? <Projection /> : <Spin />}
        {!isLoading ? <ProjectionButtons /> : <Spin />}
      </Page>
    );
  }
}

export default App;
