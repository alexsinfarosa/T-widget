import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import StationsMenu from "components/StationsMenu";

@inject("store")
@observer
class App extends Component {
  render() {
    const { app } = this.props.store;
    return (
      <div>
        <StationsMenu store={app} />
      </div>
    );
  }
}

export default App;
