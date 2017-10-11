import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// antd components
import { Spin } from "antd";

// components
import StationsMenu from "components/StationsMenu";
import TempSlider from "components/TempSlider";
import Header from "components/Header";
import ObservedGauge from "components/ObservedGauge";
import GaugeChart from 'components/GaugeChart'

// Styled components
import { Page, Box } from "styles";

@inject("store")
@observer
class App extends Component {
  render() {
    const {
      isLoading,
      daysAboveThresholdThisYear,
      temperature
    } = this.props.store.app;
    this.props.store.app.observedQuantilesNoDuplicates;
    this.props.store.app.observedIndex;
    return (
      <Page>
        <StationsMenu />
        <br />
        <TempSlider />
        <br />
        {!isLoading ? (
          <Box>
            <Header
              temperature={temperature}
              daysAboveThresholdThisYear={daysAboveThresholdThisYear}
            />
            <br />
            <ObservedGauge />
          </Box>
        ) : (
          <Spin />
        )}
        <GaugeChart />
      </Page>
    );
  }
}

export default App;
