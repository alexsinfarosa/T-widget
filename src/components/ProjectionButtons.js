import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Radio } from "antd";

@inject("store")
@observer
class ProjectionButtons extends Component {
  onChange = e => {
    this.props.store.app.setProjection(e.target.value);
  };

  render() {
    const { selectedProjection } = this.props.store.app;
    return (
      <Radio.Group
        style={{ margin: "20px auto" }}
        defaultValue={selectedProjection}
        size="large"
        onChange={this.onChange}
      >
        <Radio.Button
          value="Projection 2040-2069"
          checked={selectedProjection === "Projection 2040-2069" ? true : false}
        >
          Projection 2040-2069
        </Radio.Button>
        <Radio.Button
          value="Projection 2070-2099"
          checked={selectedProjection === "Projection 2070-2099" ? true : false}
        >
          Projection 2070-2099
        </Radio.Button>
      </Radio.Group>
    );
  }
}

export default ProjectionButtons;
