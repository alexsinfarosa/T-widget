import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { stations } from "stations";
import { Radio } from "antd";

import { Box } from "styles";

@inject("store")
@observer
class StationsMenu extends Component {
  onChange = e => {
    this.props.store.app.setStation(e.target.value);
    this.props.store.app.loadObservedData();
    this.props.store.app.loadProjection2040();
    this.props.store.app.loadProjection2070();
  };

  render() {
    const { station } = this.props.store.app;
    const stationList = stations.map((s, i) => {
      return (
        <Radio.Button key={i} value={s.name} checked={station.name === s.name}>
          {s.name}
        </Radio.Button>
      );
    });

    return (
      <Box>
        <Radio.Group
          defaultValue={station ? station.name : null}
          size="large"
          onChange={this.onChange}
        >
          {stationList}
        </Radio.Group>
      </Box>
    );
  }
}

export default StationsMenu;
