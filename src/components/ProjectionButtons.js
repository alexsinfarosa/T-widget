import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Radio } from "antd";

import { Box } from "styles";

@inject("store")
@observer
class ProjectionButtons extends Component {
  onChange = e => {
    this.props.store.app.setSelectedProjection(e.target.value);
    if (e.target.value === "Projection 2040-2069") {
      this.props.store.app.loadProjection2040();
    } else {
      this.props.store.app.loadProjection2070();
    }
  };

  changeEmission = e => {
    this.props.store.app.setHighEmission(e.target.value);
    const { selectedProjection } = this.props.store.app;

    if (selectedProjection === "Projection 2040-2069") {
      this.props.store.app.loadProjection2040();
    } else {
      this.props.store.app.loadProjection2070();
    }
  };

  render() {
    const { selectedProjection, highEmission } = this.props.store.app;
    return (
      <Box column style={{ marginBottom: "2em" }}>
        <Radio.Group
          style={{ margin: "20px auto" }}
          defaultValue={selectedProjection}
          size="large"
          onChange={this.onChange}
        >
          <Radio.Button
            value="Projection 2040-2069"
            checked={
              selectedProjection === "Projection 2040-2069" ? true : false
            }
          >
            Projection 2040-2069
          </Radio.Button>
          <Radio.Button
            value="Projection 2070-2099"
            checked={
              selectedProjection === "Projection 2070-2099" ? true : false
            }
          >
            Projection 2070-2099
          </Radio.Button>
        </Radio.Group>

        <br />

        <div style={{ margin: "0 auto" }}>
          <Radio.Group onChange={this.changeEmission} value={highEmission}>
            <Radio value={45}>Low Emission rpc 4.5</Radio>
            <Radio value={85}>High Emission rpc 8.5</Radio>
          </Radio.Group>
        </div>
      </Box>
    );
  }
}

export default ProjectionButtons;
